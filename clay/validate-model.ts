import { readFileSync } from "node:fs";
import { validateModel } from "./model-schema";

const useColor =
  (process.env.NO_COLOR === undefined || process.env.NO_COLOR === "") &&
  process.env.FORCE_COLOR !== "0" &&
  (Boolean(process.stderr.isTTY) || process.env.FORCE_COLOR === "1");

function paint(code: string, text: string): string {
  if (!useColor) return text;
  return `\u001b[${code}m${text}\u001b[0m`;
}

const modelPath = "clay/model.json";
const model = JSON.parse(readFileSync(modelPath, "utf8")) as unknown;
const errors = validateModel(model);

if (errors.length > 0) {
  console.error(paint("1;31", "Clay model is invalid:"));
  for (const error of errors) {
    console.error(paint("31", `  - ${error}`));
  }
  process.exit(1);
}

console.log(paint("32", "Clay model is valid."));
