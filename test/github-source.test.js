import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fetchCanonicalSkill, GITHUB_OWNER, GITHUB_REPO, SKILL_REPO_PATH } from "../src/github-source.js";

function response(body, { status = 200 } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() { return body; },
    async arrayBuffer() { const bytes = Buffer.from(body); return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength); },
  };
}

test("canonical source downloads only the named skill directory from GitHub", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "forgex-source-test-"));
  const skill = "---\nname: forgex\ndescription: Test skill\n---\n# ForgeX";
  const calls = [];
  const fetchImpl = async url => {
    calls.push(String(url));
    if (String(url) === `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`) {
      return response({ default_branch: "main" });
    }
    if (String(url).includes("/git/trees/main?recursive=1")) {
      return response({ tree: [
        { path: `${SKILL_REPO_PATH}/SKILL.md`, type: "blob", mode: "100644", size: skill.length },
        { path: `${SKILL_REPO_PATH}/references/ui.md`, type: "blob", mode: "100644", size: 8 },
        { path: "README.md", type: "blob", mode: "100644", size: 100 },
        { path: `${SKILL_REPO_PATH}/../outside.md`, type: "blob", mode: "100644", size: 20 },
      ] });
    }
    if (String(url).endsWith("/skills/forgex/SKILL.md")) return response(skill);
    if (String(url).endsWith("/skills/forgex/references/ui.md")) return response("UI guide");
    throw new Error(`Unexpected fetch URL: ${url}`);
  };

  let downloaded;
  try {
    downloaded = await fetchCanonicalSkill({ fetchImpl, tempDir });
    assert.equal(downloaded.repository, `${GITHUB_OWNER}/${GITHUB_REPO}`);
    assert.equal(downloaded.branch, "main");
    assert.equal(await fs.readFile(path.join(downloaded.source, "SKILL.md"), "utf8"), skill);
    assert.equal(await fs.readFile(path.join(downloaded.source, "references", "ui.md"), "utf8"), "UI guide");
    await assert.rejects(fs.access(path.join(downloaded.source, "README.md")));
    await assert.rejects(fs.access(path.join(downloaded.source, "outside.md")));
    assert.ok(calls.some(url => url.startsWith("https://raw.githubusercontent.com/")));
  } finally {
    if (downloaded) await downloaded.cleanup();
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("canonical source fails closed if GitHub has no expected skill", async () => {
  const fetchImpl = async url => String(url).includes("/git/trees/")
    ? response({ tree: [{ path: "skills/other/SKILL.md", type: "blob", mode: "100644", size: 10 }] })
    : response({ default_branch: "main" });
  await assert.rejects(fetchCanonicalSkill({ fetchImpl }), /does not contain skills\/forgex\/SKILL.md/);
});
