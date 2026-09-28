import type { Note, RenameNoteInput } from "../../generated/types";

export function renameNote(note: Note, input: RenameNoteInput): Note {
  return { ...note, title: input.title };
}
