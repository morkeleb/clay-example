import assert from "node:assert/strict";
import { test } from "node:test";
import { renameNote } from "./rename";

test("renameNote changes the title and keeps the body", () => {
  const note = renameNote(
    { id: "1", title: "Old", body: "Same body" },
    { id: "1", title: "New" },
  );
  assert.equal(note.title, "New");
  assert.equal(note.body, "Same body");
  assert.equal(note.id, "1");
});
