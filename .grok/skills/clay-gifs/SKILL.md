---
name: clay-gifs
description: >
  Record a new Shelf/Clay example GIF with VHS. Use when the user asks for a
  gif, a tape, a keynote clip, or /clay-gifs. Follow the house style: 16:9 at
  about 120 columns, vi for edits, git diff and tree for output, and a single
  shell # comment before each vi open and each git or tree command.
---

# Clay example GIFs

Record keynote clips for this repo. Existing tapes in `tapes/` are the pattern. Do not re-record them unless the user asks.

## Frame

Every tape starts with:

```
Set Shell bash
Set FontSize 16
Set Width 1080
Set Height 608
Set Padding 12
Set TypingSpeed 14ms
```

That is 16:9 and about 120 columns. Do not widen the frame. Do not drop to 80 columns. Type errors and paths wrap too hard at 80.

Hidden setup, then `Show`:

```
export PS1='$ '
unset NO_COLOR
export FORCE_COLOR=1
export TERM=xterm-256color
```

## Comments

A comment is a shell `#` line. Type it. Press Enter. Pause.

```
Type "clear"
Enter
Type "# Let's add a field"
Enter
Sleep 3s
```

`#` prints once. Do not define a `comment` function and do not `echo` the same sentence. That draws the line twice.

Rules:

- One sentence. One line.
- `clear` before each new part.
- `Sleep 3s` after every `#` line, before the command it explains.
- Explain every `vi` open before the `vi` command. Say what is about to be added: `# Let's add a field`, `# Let's add a faulty field`, `# Let's add a cancel button to all our forms`.
- Explain every `git` command before it. Say what the flags show and why: `# git diff --stat -- src. Line counts for the type and the page only.`
- Explain a `tree` the same way: what the viewer is about to see.

Pauses after results: `Sleep 4s` after generate, `Sleep 5s` after a diff or tree, `Sleep 6s` after an error the viewer must read (`tsc`, validate, test).

## What appears on screen

- Edits happen in `vi -u scripts/demo/vimrc`. Do not show a node script mutating the model.
- File changes are `git --no-pager diff`. Always pass `--no-pager`. A pager eats the next keys.
- Limit the path. `-- src`, `-- src/generated/forms`, or `-- src/generated/handlers`. A bare `git diff` also shows `.clay`, `.gitattributes`, and the gifs.
- `--stat` when the point is which files changed and how many lines.
- `--name-status` when the point is the file list. `A` is added. `M` is modified.
- `-U1` when the point is one new line in each file.
- New files are invisible to `git diff` until `git add -N src`. The `#` line must say that.
- Layout tours use `tree -C`. Ignore `node_modules` and `.git`.

Quote any path that contains a space. Generator template directories do (`{{kebabCase clay_parent.name}}`). An unquoted path makes `vi` open the wrong file, and later keystrokes land in that buffer.

```
Type `vi -u scripts/demo/vimrc "clay/generators/forms/templates/{{kebabCase clay_parent.name}}/{{kebabCase name}}.html.hbs"`
```

VHS strings: double quotes when the text has no double quote. Backticks when it does. Do not write `\"` inside a double-quoted `Type`. The parser rejects it.

After `Escape`, `Sleep 400ms` before `:wq` or the next normal-mode command. `scripts/demo/vimrc` sets `timeoutlen` to 200 so Escape is recognized.

## Checks that already have clips

Do not make another clip for these unless the user asks for a change:

| Clip | Point |
| --- | --- |
| `layout` | Opens with what Shelf is. Then `tree`: model, generators, generated vs touch vs runtime |
| `add-field` | One field. Only the type and the page change. `tsc` fails in the touch file |
| `add-mutation` | One mutation writes the form, the handler, and the touch files |
| `reject-unknown-key` | Unknown model key. The vocabulary is fixed |
| `cancel-button` | One template line. Every form changes |
| `role-check` | One template line. Every handler checks the role |
| `token-efficiency` | One mutation. `--stat` is the lines the LLM did not write |
| `blocked-edit` | Hook blocks a write to a generated file. The touch file is allowed |

Two lessons may share one clip. Say both in the `#` line. Do not record a second clip that only repeats the first.

## Record

1. Add `tapes/<name>.tape` and `vhs tapes/<name>.tape` in `scripts/record-gifs.sh`.
2. Run that tape from the repo root. `scripts/record-gifs.sh` restores `clay/`, `src/`, and `.clay` from the `demo-baseline` tag around each tape. The ledger must match the baseline, or the next `npm run generate` skips a repeat of the same edit. It does not reset `tapes/` or `docs/gifs/`.
3. A tape that edits the model or a template must leave the tree on the baseline. The role-check tape may `git commit` a temporary "before" in its hidden section. The restore puts `HEAD` back on `demo-baseline`.
4. Link the gif from `README.md`.
5. Read one frame of the `#` line and one frame of the result. The comment is a single line. `vi` opened the intended file. The diff does not list `.clay` or `docs/gifs/`.

Output path: `docs/gifs/<name>.gif`.
