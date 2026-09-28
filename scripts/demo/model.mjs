import { readFileSync, writeFileSync } from "node:fs";

const modelPath = "clay/model.json";

export function loadModel() {
  return JSON.parse(readFileSync(modelPath, "utf8"));
}

export function saveModel(model) {
  writeFileSync(modelPath, JSON.stringify(model, null, 2) + "\n");
}

export function noteType(model) {
  const found = model.model.types.find((type) => type.name === "Note");
  if (!found) {
    throw new Error("The model has no Note type.");
  }
  return found;
}
