import { snapshot } from "./snapshot.mjs";
import { loadModel, noteType, saveModel } from "./model.mjs";

snapshot();

const model = loadModel();
const entity = noteType(model);
if (!entity.mutations.some((item) => item.name === "archive")) {
  entity.mutations.push({
    name: "archive",
    permission: "note.write",
    description: "Keep the note and mark it done.",
    input: {
      fields: [
        {
          name: "id",
          type: "uuid",
          required: true,
          description: "Note to archive.",
        },
      ],
    },
  });
}
saveModel(model);

console.log("Added the archive mutation on Note.");
console.log("Permission is note.write. Input is id.");
