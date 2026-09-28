import { z } from "zod";

/**
 * Vocabulary for this example. Unknown keys fail.
 * The names stay fixed: fields, queries, mutations, permission.
 */

const FieldSchema = z
  .object({
    name: z.string().min(1),
    type: z.enum(["uuid", "string", "boolean"]),
    required: z.boolean(),
    primary: z.boolean().optional(),
    description: z.string().optional(),
  })
  .strict();

const QuerySchema = z
  .object({
    name: z.enum(["list", "get"]),
    permission: z.string().min(1),
    description: z.string().optional(),
  })
  .strict();

const MutationSchema = z
  .object({
    name: z.string().min(1),
    permission: z.string().min(1),
    description: z.string().optional(),
    input: z
      .object({
        fields: z.array(FieldSchema),
      })
      .strict(),
  })
  .strict();

const EntitySchema = z
  .object({
    name: z.string().min(1),
    category: z.enum(["entity"]),
    fields: z.array(FieldSchema).min(1),
    queries: z.array(QuerySchema),
    mutations: z.array(MutationSchema),
  })
  .strict();

const DomainSchema = z
  .object({
    identity: z
      .object({
        roles: z
          .array(
            z
              .object({
                name: z.string().min(1),
                permissions: z.array(z.string().min(1)),
              })
              .strict(),
          )
          .min(1),
      })
      .strict(),
    types: z.array(EntitySchema).min(1),
  })
  .strict();

const EnvelopeSchema = z
  .object({
    name: z.string().min(1),
    generators: z.array(z.string().min(1)).min(1),
    model: DomainSchema,
  })
  .strict();

export type ClayEnvelope = z.infer<typeof EnvelopeSchema>;

const allowedKeys: Record<string, string> = {
  envelope: "name, generators, model",
  model: "identity, types",
  identity: "roles",
  role: "name, permissions",
  type: "name, category, fields, queries, mutations",
  field: "name, type, required, primary, description",
  query: "name, permission, description",
  mutation: "name, permission, description, input",
  input: "fields",
};

function kindForPath(path: PropertyKey[]): string {
  if (path.length === 0) return "envelope";
  const tokens = path.filter((part): part is string => typeof part === "string");
  const last = tokens[tokens.length - 1];
  const kindByToken: Record<string, string> = {
    model: "model",
    identity: "identity",
    roles: "role",
    types: "type",
    fields: "field",
    queries: "query",
    mutations: "mutation",
    input: "input",
  };
  return kindByToken[last] ?? "envelope";
}

function valueAt(root: unknown, path: PropertyKey[]): unknown {
  let current = root;
  for (const key of path) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<PropertyKey, unknown>)[key];
  }
  return current;
}

function pathText(path: PropertyKey[]): string {
  if (path.length === 0) return "(root)";
  return path.map(String).join(".");
}

function formatIssue(input: unknown, issue: z.ZodIssue): string {
  const where = pathText(issue.path);
  if (issue.code === "unrecognized_keys") {
    const keys = issue.keys.map((key) => `"${key}"`).join(", ");
    const kind = kindForPath(issue.path);
    const allowed = allowedKeys[kind] ?? "";
    const node = valueAt(input, issue.path);
    const name =
      node && typeof node === "object" && "name" in node && typeof node.name === "string"
        ? ` (${node.name})`
        : "";
    return `${where}${name}: unknown key ${keys}. Allowed keys: ${allowed}.`;
  }
  return `${where}: ${issue.message}`;
}

function semanticErrors(envelope: ClayEnvelope): string[] {
  const errors: string[] = [];
  const permissions = new Set(envelope.model.identity.roles.flatMap((role) => role.permissions));
  const roleNames = new Set<string>();

  envelope.model.identity.roles.forEach((role, index) => {
    if (roleNames.has(role.name)) {
      errors.push(`model.identity.roles.${index}: duplicate role name "${role.name}".`);
    }
    roleNames.add(role.name);
  });

  envelope.model.types.forEach((type, typeIndex) => {
    const where = `model.types.${typeIndex} (${type.name})`;
    const fieldNames = new Set<string>();
    const primaries = type.fields.filter((field) => field.primary);

    type.fields.forEach((field, fieldIndex) => {
      if (fieldNames.has(field.name)) {
        errors.push(`${where}.fields.${fieldIndex}: duplicate field name "${field.name}".`);
      }
      fieldNames.add(field.name);
    });

    if (primaries.length !== 1 || primaries[0]?.name !== "id") {
      errors.push(`${where}: the entity has one primary field, and its name is id.`);
    }

    const queryNames = new Set<string>();
    type.queries.forEach((query, queryIndex) => {
      if (queryNames.has(query.name)) {
        errors.push(`${where}.queries.${queryIndex}: duplicate query name "${query.name}".`);
      }
      queryNames.add(query.name);
      if (!permissions.has(query.permission)) {
        errors.push(
          `${where}.queries.${queryIndex}: permission "${query.permission}" is not on a role.`,
        );
      }
    });

    const mutationNames = new Set<string>();
    type.mutations.forEach((mutation, mutationIndex) => {
      const mutationWhere = `${where}.mutations.${mutationIndex}`;
      if (mutationNames.has(mutation.name)) {
        errors.push(`${mutationWhere}: duplicate mutation name "${mutation.name}".`);
      }
      mutationNames.add(mutation.name);
      if (!permissions.has(mutation.permission)) {
        errors.push(
          `${mutationWhere}: permission "${mutation.permission}" is not on a role.`,
        );
      }

      const inputNames = new Set<string>();
      mutation.input.fields.forEach((field, fieldIndex) => {
        if (inputNames.has(field.name)) {
          errors.push(`${mutationWhere}.input.fields.${fieldIndex}: duplicate field name "${field.name}".`);
        }
        inputNames.add(field.name);
        if (field.name !== "id" && !fieldNames.has(field.name)) {
          errors.push(
            `${mutationWhere}: input field "${field.name}" is not id and not a field on ${type.name}.`,
          );
        }
        if (field.name === "id" && field.type !== "uuid") {
          errors.push(`${mutationWhere}: input field "id" has type uuid.`);
        }
        const entityField = type.fields.find((candidate) => candidate.name === field.name);
        if (entityField && entityField.type !== field.type) {
          errors.push(
            `${mutationWhere}: input field "${field.name}" has type ${entityField.type}, the same type as on ${type.name}.`,
          );
        }
      });

      if (mutation.name === "create" && inputNames.has("id")) {
        errors.push(`${mutationWhere}: mutation "create" does not take the id field.`);
      }
      if (mutation.name !== "create" && !inputNames.has("id")) {
        errors.push(`${mutationWhere}: mutation "${mutation.name}" needs an id input field.`);
      }
    });
  });

  return errors;
}

export function validateModel(input: unknown): string[] {
  const parsed = EnvelopeSchema.safeParse(input);
  if (!parsed.success) {
    return parsed.error.issues.map((issue) => formatIssue(input, issue));
  }
  return semanticErrors(parsed.data);
}
