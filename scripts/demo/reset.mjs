import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { loadModel, noteType, saveModel } from "./model.mjs";

const model = loadModel();
const entity = noteType(model);
delete entity.commands;
entity.fields = entity.fields.filter((field) => field.name !== "pinned");
entity.mutations = entity.mutations.filter((mutation) => mutation.name !== "archive");
for (const mutation of entity.mutations) {
  mutation.input.fields = mutation.input.fields.filter((field) => field.name !== "pinned");
}
saveModel(model);

const demoFiles = [
  "src/logic/note/archive.ts",
  "src/logic/note/archive.spec.ts",
  "src/generated/handlers/note/archive.ts",
  "src/generated/forms/note/archive.html",
];
for (const file of demoFiles) rmSync(file, { force: true });
rmSync("tapes/.snapshot", { recursive: true, force: true });

const clayPath = ".clay";
const clay = JSON.parse(readFileSync(clayPath, "utf8"));
for (const entry of clay.models ?? []) {
  for (const file of Object.keys(entry.generated_files ?? {})) {
    if (file.endsWith("/archive.ts") || file.endsWith("/archive.html") || file.endsWith("/archive.spec.ts")) {
      delete entry.generated_files[file];
    }
  }
}
writeFileSync(clayPath, JSON.stringify(clay, null, 2) + "\n");

execFileSync("npm", ["run", "validate"], { stdio: "inherit" });
execFileSync("npx", ["clay", "generate", "clay/model.json", ".", "--force"], { stdio: "inherit" });
