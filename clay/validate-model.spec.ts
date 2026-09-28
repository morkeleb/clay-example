import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { validateModel } from "./model-schema";

function baseline(): Record<string, unknown> {
  return JSON.parse(readFileSync(new URL("./model.json", import.meta.url), "utf8")) as Record<
    string,
    unknown
  >;
}

function note(model: Record<string, unknown>): Record<string, unknown> {
  const domain = model.model as { types: Record<string, unknown>[] };
  return domain.types[0];
}

test("the model file is valid", () => {
  assert.deepEqual(validateModel(baseline()), []);
});

test("an unknown key fails and names the allowed keys", () => {
  const model = baseline();
  note(model).format = "card";
  const errors = validateModel(model);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /unknown key "format"/);
  assert.match(errors[0], /Allowed keys: name, category, fields, queries, mutations/);
});

test("a renamed concept fails", () => {
  const model = baseline();
  const entity = note(model);
  entity.commands = entity.mutations;
  delete entity.mutations;
  const errors = validateModel(model).join("\n");
  assert.match(errors, /unknown key "commands"/);
  assert.match(errors, /Allowed keys: name, category, fields, queries, mutations/);
  assert.match(errors, /mutations: Required/);
});

test("a permission that no role has fails", () => {
  const model = baseline();
  const entity = note(model);
  const mutations = entity.mutations as { permission: string }[];
  mutations[1].permission = "note.admin";
  const errors = validateModel(model);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /note\.admin/);
  assert.match(errors[0], /not on a role/);
});
