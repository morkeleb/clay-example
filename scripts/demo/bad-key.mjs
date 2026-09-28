import { loadModel, noteType, saveModel } from "./model.mjs";

const model = loadModel();
const entity = noteType(model);
entity.commands = [];
saveModel(model);

console.log("Added Note.commands = [].");
console.log("This model uses mutations, not commands.");
