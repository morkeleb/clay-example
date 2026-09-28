import { snapshot } from "./snapshot.mjs";
import { loadModel, noteType, saveModel } from "./model.mjs";

snapshot();

const model = loadModel();
const entity = noteType(model);
const field = {
  name: "pinned",
  type: "boolean",
  required: true,
  description: "True when the note stays at the top.",
};

if (!entity.fields.some((item) => item.name === "pinned")) {
  entity.fields.push(field);
}
const create = entity.mutations.find((item) => item.name === "create");
if (!create.input.fields.some((item) => item.name === "pinned")) {
  create.input.fields.push({ ...field });
}
saveModel(model);

console.log("Added Note.pinned, a required boolean.");
console.log("Added the same field on the create mutation.");
