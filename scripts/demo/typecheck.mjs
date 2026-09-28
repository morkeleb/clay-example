import { spawnSync } from "node:child_process";
import { boldRed, cyan, dim, yellow } from "./ansi.mjs";

const result = spawnSync("node_modules/.bin/tsc", ["--noEmit", "--pretty", "false"], {
  encoding: "utf8",
});
const text = `${result.stdout ?? ""}${result.stderr ?? ""}`.trimEnd();

function quote(message) {
  return message.replace(/'([^']+)'/g, (_, word) => yellow(`'${word}'`));
}

function colorLine(line) {
  const match = /^(\S+?)(\(\d+,\d+\)): (error|warning) (TS\d+): (.*)$/.exec(line);
  if (!match) return quote(line);
  const [, file, location, kind, code, message] = match;
  const label = kind === "error" ? boldRed(kind) : yellow(kind);
  return `${cyan(file)}${yellow(location)}: ${label} ${dim(code)}: ${quote(message)}`;
}

if (text) {
  console.log(text.split("\n").map(colorLine).join("\n"));
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
