import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export const GITHUB_OWNER = "DanDhany";
export const GITHUB_REPO = "forgex-fullstack-engineer";
export const SKILL_REPO_PATH = "skills/forgex";

const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
const MAX_FILES = 100;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024;

async function readResponse(response, label) {
  if (!response.ok) {
    const detail = response.status === 403 || response.status === 429
      ? "GitHub may be rate-limiting requests. Try again later."
      : `HTTP ${response.status}`;
    throw new Error(`Could not fetch ${label}: ${detail}`);
  }
  return response;
}

function safeRelativePath(repoPath) {
  const prefix = `${SKILL_REPO_PATH}/`;
  if (!repoPath.startsWith(prefix)) return null;
  const relative = repoPath.slice(prefix.length);
  const parts = relative.split("/");
  if (!relative || parts.some(part => !part || part === "." || part === "..")) return null;
  return parts.join(path.sep);
}

/** Fetch the canonical installable skill from the public GitHub repository. */
export async function fetchCanonicalSkill({ fetchImpl = globalThis.fetch, tempDir = os.tmpdir() } = {}) {
  if (typeof fetchImpl !== "function") throw new Error("This Node.js runtime does not provide fetch(). Use Node.js 20 or newer.");

  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ForgeX-Full-Stack-Engineer-Installer",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const repoResponse = await readResponse(await fetchImpl(API_BASE, { headers }), "GitHub repository metadata");
  const repo = await repoResponse.json();
  const branch = repo.default_branch;
  if (typeof branch !== "string" || !branch) throw new Error("GitHub repository metadata did not include a default branch.");

  const treeUrl = `${API_BASE}/git/trees/${encodeURIComponent(branch)}?recursive=1`;
  const treeResponse = await readResponse(await fetchImpl(treeUrl, { headers }), "GitHub repository tree");
  const tree = await treeResponse.json();
  if (!Array.isArray(tree.tree)) throw new Error("GitHub repository tree response was invalid.");

  const entries = tree.tree
    .filter(entry => entry.type === "blob" && (entry.mode === "100644" || entry.mode === "100755"))
    .map(entry => ({ entry, relative: safeRelativePath(entry.path) }))
    .filter(item => item.relative !== null);

  if (!entries.some(item => item.relative === "SKILL.md")) {
    throw new Error(`The canonical GitHub source does not contain ${SKILL_REPO_PATH}/SKILL.md.`);
  }
  if (entries.length > MAX_FILES) throw new Error(`The skill contains too many files (${entries.length}; maximum ${MAX_FILES}).`);

  const tempRoot = await fs.mkdtemp(path.join(tempDir, "forgex-skill-source-"));
  const source = path.join(tempRoot, "forgex");
  let totalBytes = 0;

  try {
    for (const { entry, relative } of entries) {
      if (typeof entry.size === "number" && entry.size > MAX_FILE_BYTES) {
        throw new Error(`Refusing to download oversized skill file: ${entry.path}`);
      }
      const encodedPath = entry.path.split("/").map(encodeURIComponent).join("/");
      const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${encodeURIComponent(branch)}/${encodedPath}`;
      const response = await readResponse(await fetchImpl(rawUrl, { headers: { "User-Agent": headers["User-Agent"] } }), entry.path);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length > MAX_FILE_BYTES) throw new Error(`Refusing to write oversized skill file: ${entry.path}`);
      totalBytes += bytes.length;
      if (totalBytes > MAX_TOTAL_BYTES) throw new Error(`The skill exceeds the ${MAX_TOTAL_BYTES / (1024 * 1024)} MiB download limit.`);
      const destination = path.join(source, relative);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, bytes, { flag: "wx" });
    }

    const skillText = await fs.readFile(path.join(source, "SKILL.md"), "utf8");
    if (!/^---\s*\n[\s\S]*?^name:\s*forgex\s*$/m.test(skillText)) {
      throw new Error("The downloaded SKILL.md is missing the expected `name: forgex` frontmatter.");
    }

    return {
      source,
      branch,
      repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
      cleanup: () => fs.rm(tempRoot, { recursive: true, force: true }),
    };
  } catch (error) {
    await fs.rm(tempRoot, { recursive: true, force: true });
    throw error;
  }
}
