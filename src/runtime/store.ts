import type { Note } from "../generated/types";

export class NotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFound";
  }
}

export const seedIds = {
  welcome: "00000000-0000-4000-8000-000000000001",
  next: "00000000-0000-4000-8000-000000000002",
} as const;

const seedNotes: Note[] = [
  {
    id: seedIds.welcome,
    title: "Welcome",
    body: "This note is on the shelf.",
  },
  {
    id: seedIds.next,
    title: "Next",
    body: "Pick a note to rename it.",
  },
];

function copySeed(): Note[] {
  return seedNotes.map((note) => ({ ...note }));
}

let notes: Note[] = copySeed();

export function resetStore(): void {
  notes = copySeed();
}

export const store = {
  listNotes(): Note[] {
    return notes.map((note) => ({ ...note }));
  },

  getNote(id: string): Note {
    const found = notes.find((note) => note.id === id);
    if (!found) {
      throw new NotFound(`No note with id ${id}.`);
    }
    return { ...found };
  },

  saveNote(note: Note): Note {
    const index = notes.findIndex((candidate) => candidate.id === note.id);
    if (index === -1) {
      notes.push({ ...note });
    } else {
      notes[index] = { ...note };
    }
    return { ...note };
  },
};
