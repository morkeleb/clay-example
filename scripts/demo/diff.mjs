import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { cyan, dim, green, yellow } from "./ansi.mjs";

const snap = "tapes/.snapshot";

function walk(dir) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function rank(file) {
  if (file.endsWith("types.ts")) return 0;
  if (file.endsWith("page.html")) return 1;
  if (file.includes("/forms/")) return 2;
  if (file.includes("/logic/")) return 3;
  if (file.endsWith("routes.ts")) return 4;
  return 5;
}

if (!existsSync(snap)) {
  console.error("No snapshot. Run a demo script first.");
  process.exit(1);
}

const changes = [];
for (const root of ["src/generated", "src/logic"]) {
  const before = new Set(walk(path.join(snap, root)).map((file) => path.relative(snap, file)));
  const after = walk(root);
  for (const file of after) {
    const previous = path.join(snap, file);
    if (!existsSync(previous)) {
      changes.push({ file, kind: "new" });
      continue;
    }
    if (readFileSync(previous, "utf8") !== readFileSync(file, "utf8")) {
      changes.push({ file, kind: "changed" });
    }
  }
  for (const file of before) {
    if (!existsSync(file)) changes.push({ file, kind: "deleted" });
  }
}

changes.sort((a, b) => rank(a.file) - rank(b.file) || a.file.localeCompare(b.file));

if (changes.length === 0) {
  console.log("No generated file changed.");
  process.exit(0);
}

console.log("Files touched by generate:");
for (const change of changes) {
  const kind = change.kind === "new" ? green(change.kind.padEnd(8)) : yellow(change.kind.padEnd(8));
  const name = change.kind === "new" ? green(change.file) : cyan(change.file);
  console.log(`  ${kind} ${name}`);
}

const shown = changes.filter((change) => change.kind !== "deleted").slice(0, 4);
for (const change of shown) {
  console.log(`\n${dim("---")} ${cyan(change.file)} ${dim("---")}`);
  const before = change.kind === "new" ? "/dev/null" : path.join(snap, change.file);
  const env = { ...process.env, FORCE_COLOR: "1" };
  delete env.NO_COLOR;
  const result = spawnSync(
    "git",
    ["-c", "color.ui=always", "diff", "--no-index", "--color=always", "--unified=3", "--", before, change.file],
    { encoding: "utf8", env },
  );
  const lines = (result.stdout ?? "")
    .split("\n")
    .filter((line) => {
      const plain = line.replace(/\u001b\[[0-9;]*m/g, "");
      return !plain.startsWith("diff --git") && !plain.startsWith("index ");
    })
    .slice(0, 32);
  console.log(lines.join("\n"));
}
