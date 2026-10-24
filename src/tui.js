import process from "node:process";

const codes = { reset: "\x1b[0m", cyan: "\x1b[36m", bold: "\x1b[1m", dim: "\x1b[2m", green: "\x1b[32m", yellow: "\x1b[33m" };
export function paint(text, code) {
  if (!process.stdout.isTTY || process.env.NO_COLOR) return String(text);
  return `${code}${text}${codes.reset}`;
}
export function banner() {
  console.log(paint("╭──────────────────────────────────────────────╮", codes.cyan));
  console.log(paint("│          ForgeX Full-Stack Engineer           │", codes.cyan + codes.bold));
  console.log(paint("│        One skill · Multi-agent installer      │", codes.cyan));
  console.log(paint("╰──────────────────────────────────────────────╯", codes.cyan));
}
export async function ask(rl, label, fallback = "") {
  const value = (await rl.question(`${label}${fallback ? ` [${fallback}]` : ""}: `)).trim();
  return value || fallback;
}
export async function chooseOne(rl, label, options, defaultIndex = 0) {
  console.log(`\n${label}`);
  options.forEach((x, i) => console.log(` ${i + 1}. ${x.label}${x.note ? ` ${paint("— " + x.note, codes.dim)}` : ""}`));
  while (true) {
    const value = await ask(rl, `Pilih 1-${options.length}`, String(defaultIndex + 1));
    const i = Number(value) - 1;
    if (Number.isInteger(i) && i >= 0 && i < options.length) return options[i];
    console.log("Pilihan tidak valid.");
  }
}
export async function chooseMany(rl, label, options) {
  console.log(`\n${label}`);
  options.forEach((x, i) => console.log(` ${i + 1}. ${x.label}`));
  console.log(paint("Nomor dipisah koma, rentang (1-3), atau 'all'.", codes.dim));
  while (true) {
    const raw = (await ask(rl, "Pilihan", "all")).toLowerCase();
    if (raw === "all" || raw === "*") return [...options];
    const set = new Set(); let valid = true;
    for (const part of raw.split(",").map(x => x.trim()).filter(Boolean)) {
      const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (range) {
        const a = Number(range[1]), b = Number(range[2]);
        if (a < 1 || b > options.length || a > b) { valid = false; break; }
        for (let i = a; i <= b; i++) set.add(i - 1);
      } else {
        const n = Number(part);
        if (!Number.isInteger(n) || n < 1 || n > options.length) { valid = false; break; }
        set.add(n - 1);
      }
    }
    if (valid && set.size) return [...set].sort((a,b)=>a-b).map(i => options[i]);
    console.log("Pilihan tidak valid.");
  }
}
export async function confirm(rl, label) {
  const v = (await ask(rl, `${label} (y/N)`, "")).toLowerCase();
  return v === "y" || v === "yes";
}
export function showPlan(plan) {
  console.log("\nPreview:");
  for (const item of plan) {
    console.log(` ${item.conflict ? paint("[SKIP: already exists]", codes.yellow) : paint("[NEW]", codes.green)} ${item.agentLabel}`);
    console.log(`   ${paint(item.destination, codes.dim)}`);
  }
}
