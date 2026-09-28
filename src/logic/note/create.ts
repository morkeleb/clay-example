import type { CreateNoteInput, Note } from "../../generated/types";

export function createNote(input: CreateNoteInput): Note {
  const id: string = crypto.randomUUID();
  return {
    id,
    title: input.title,
    body: input.body,
  };
}
