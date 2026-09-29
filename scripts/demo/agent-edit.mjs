import { spawnSync } from "node:child_process";

const file = process.argv[2];
if (!file) {
  console.error("usage: agent-edit.mjs <file>");
  process.exit(1);
}

const useColor = process.env.NO_COLOR === undefined && process.env.FORCE_COLOR !== "0";
const red = (text) => (useColor ? `\u001b[31m${text}\u001b[0m` : text);
const green = (text) => (useColor ? `\u001b[32m${text}\u001b[0m` : text);

console.log(`> Write ${file}`);

const result = spawnSync("npx", ["clay", "check-generated"], {
  input: JSON.stringify({ tool_input: { file_path: file } }),
  encoding: "utf8",
});

const raw = (result.stdout ?? "").trim();
if (!raw) {
  console.log(green("allowed. This file is not generated."));
  process.exit(0);
}

const decision = JSON.parse(raw);
if (decision.decision === "block") {
  const reason = String(decision.reason ?? "");
  const [first, ...rest] = reason.split("\n");
  console.log(red(first));
  if (rest.length > 0) console.log(rest.join("\n"));
  process.exit(2);
}

console.log(raw);
process.exit(result.status ?? 0);
