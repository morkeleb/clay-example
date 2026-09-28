import assert from "node:assert/strict";
import { test } from "node:test";
import { handleRenameNote } from "../generated/handlers/note/rename";
import { listNotes } from "../generated/queries/note/list";
import { AccessDenied } from "./access";
import { resetStore, seedIds } from "./store";

test("a reader can list notes", () => {
  resetStore();
  const notes = listNotes({ user: { role: "reader" } });
  assert.equal(notes.length, 2);
});

test("a reader cannot rename a note", () => {
  resetStore();
  assert.throws(
    () => handleRenameNote({ user: { role: "reader" } }, { id: seedIds.welcome, title: "Nope" }),
    AccessDenied,
  );
});

test("an editor can rename a note", () => {
  resetStore();
  const note = handleRenameNote(
    { user: { role: "editor" } },
    { id: seedIds.welcome, title: "Hello" },
  );
  assert.equal(note.title, "Hello");
  assert.equal(note.id, seedIds.welcome);
  const listed = listNotes({ user: { role: "editor" } });
  assert.equal(listed.find((item) => item.id === seedIds.welcome)?.title, "Hello");
});
