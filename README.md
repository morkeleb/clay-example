# Shelf

Shelf is a small [Clay](https://github.com/morkeleb/clay) example you can run and share.

The model in `clay/model.json` owns the fields, the queries, and the mutations. Clay generates the types, the index page, the forms, and the handlers. You write the business rule in a touch file. A spec sits next to that file.

## Path from the page to the rule

The index page shows the note list and the selected note.

1. The list calls the generated `list` query.
2. A click calls the generated `get` query and shows that note.
3. The note has one button for each mutation.
4. The button opens the form for that mutation.
5. The form sends JSON to the generated handler.
6. The handler checks the caller role against the mutation `permission`.
7. The handler calls the touch file in `src/logic`.
8. The spec next to that file must be a real test. `npm test` fails while the spec still contains `implement this test`.

A reader can list notes. A reader who submits a form gets HTTP 403. An editor can create a note and rename a note. The store is in memory and starts with two notes.

## Run

```bash
npm install
npm run dev
```

Open http://127.0.0.1:4317

The role control is in the page header. It sends the `x-role` header.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Serve the page on port 4317 |
| `npm run validate` | Reject a model that renames a concept or adds an unknown key |
| `npm run generate` | Validate the model, then run Clay |
| `npm run typecheck` | Run `tsc` |
| `npm test` | Require a real spec for each touch file, then run the tests |
| `npm run check` | Validate, typecheck, and test |
| `npm run gifs` | Record the three GIFs below |

`npm run dev` works after `npm install`. You do not need to generate first. The generated files are in the project.

## Layout

```
clay/model.json                 source of fields, queries, and mutations
clay/model-schema.ts            allowed keys
clay/validate-model.ts          vocabulary command
clay/generators/                one folder per generator
src/generated/                  Clay overwrites these files
src/logic/note/                 touch files, Clay writes each file once
src/runtime/                    server, store, access check, page client
scripts/demo/                   reset, snapshot, and the vi setup for the GIFs
tapes/                          VHS tapes
```

The generators were created with `clay init generator <name>`.

| Generator | Output |
| --- | --- |
| `types` | `src/generated/types.ts`, `src/generated/identity.ts` |
| `queries` | `list` and `get` handlers |
| `handlers` | mutation handlers and `src/generated/routes.ts` |
| `forms` | one HTML form per mutation |
| `pages` | `src/generated/page.html` |
| `logic` | `touch: true` rule and spec |

Clay does not overwrite a file under `src/logic` after the file exists. A new mutation still receives a scaffold.

## Vocabulary

The validator uses a strict schema. An unknown key fails. The error names the allowed keys at that place.

| Place | Allowed keys |
| --- | --- |
| file | `name`, `generators`, `model` |
| `model` | `identity`, `types` |
| role | `name`, `permissions` |
| type | `name`, `category`, `fields`, `queries`, `mutations` |
| field | `name`, `type`, `required`, `primary`, `description` |
| query | `name`, `permission`, `description` |
| mutation | `name`, `permission`, `description`, `input` |
| `input` | `fields` |

`category` is `entity`. A field `type` is `uuid`, `string`, or `boolean`. A query `name` is `list` or `get`. The entity has one primary field, and its name is `id`. Each `permission` appears on a role. `get` takes that id. `list` takes no input. A mutation other than `create` takes an `id` input. `create` does not take `id`.

`commands` is not a key. The name is `mutations`.

## What a model change does

The clips type the edit in vi, then show `git diff`. A yellow `#` line says what the step is for.

One field in the model rewrites the type and the page. Handlers and queries stay as they are. `tsc` then fails in the touch file the handler calls, because that file still builds a `Note` without the new field.

One mutation writes the form, the handler, and the touch files. The new spec still says `implement this test`, so `npm test` fails until you replace that test.

An unknown key fails validation. The name is `mutations`, not a name you invent.

One line in the form template adds a Cancel button to every mutation form. One line in the handler template adds the role check to every handler.

## GIFs

![One field. Only the type and the page change, then tsc fails in the touch file.](docs/gifs/add-field.gif)

![One mutation. Clay writes the form, the handler, and the touch files.](docs/gifs/add-mutation.gif)

![An unknown key. The validator names the allowed keys.](docs/gifs/reject-unknown-key.gif)

![One line in the form template. Every form gets a Cancel button.](docs/gifs/cancel-button.gif)

![One line in the handler template. Every handler checks the role.](docs/gifs/role-check.gif)

Record them again with [VHS](https://github.com/charmbracelet/vhs) on your `PATH`:

```bash
npm run gifs
```

The script returns the model to this baseline when it finishes. The baseline has no `pinned` field and no `archive` mutation.

## Local Clay checkout

The dependency is the published `clay-generator` package. To use the sibling checkout at `../clay` instead:

```bash
cd ../clay
npm link
cd ../clay-example
npm link clay-generator
```
