import assert from "node:assert/strict";
import { test } from "node:test";
import { createNote } from "./create";

test("createNote copies the title and the body", () => {
  const note = createNote({ title: "A title", body: "A body" });
  assert.equal(note.title, "A title");
  assert.equal(note.body, "A body");
  assert.equal(typeof note.id, "string");
  assert.ok(note.id.length > 0);
});
