import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const marker = "implement this test";
const root = "src/logic";
const errors: string[] = [];

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

for (const file of walk(root)) {
  if (!file.endsWith(".ts") || file.endsWith(".spec.ts")) continue;
  const spec = file.replace(/\.ts$/, ".spec.ts");
  let text: string;
  try {
    text = readFileSync(spec, "utf8");
  } catch {
    errors.push(`${file} needs a spec at ${spec}.`);
    continue;
  }
  if (text.includes(marker)) {
    errors.push(`${spec} still contains the scaffold "${marker}".`);
  }
}

const useColor =
  (process.env.NO_COLOR === undefined || process.env.NO_COLOR === "") &&
  process.env.FORCE_COLOR !== "0" &&
  (Boolean(process.stderr.isTTY) || process.env.FORCE_COLOR === "1");

function paint(code: string, text: string): string {
  if (!useColor) return text;
  return `\u001b[${code}m${text}\u001b[0m`;
}

if (errors.length > 0) {
  console.error(paint("1;31", "Touch specs are not implemented:"));
  for (const error of errors) {
    const token = `"${marker}"`;
    const at = error.indexOf(token);
    if (at === -1) {
      console.error(paint("31", `  - ${error}`));
      continue;
    }
    console.error(
      `  - ${paint("31", error.slice(0, at))}${paint("1;33", token)}${paint("31", error.slice(at + token.length))}`,
    );
  }
  process.exit(1);
}

console.log(paint("32", "Touch specs are implemented."));
