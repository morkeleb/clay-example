import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const template =
  "clay/generators/handlers/templates/handler/{{kebabCase clay_parent.name}}/{{kebabCase name}}.ts.hbs";
const line = '  requirePermission(ctx.user, "{{permission}}");\n';
const text = readFileSync(template, "utf8");

if (!text.includes(line)) {
  console.error("The role check line is not in the handler template.");
  process.exit(1);
}

writeFileSync(template, text.replace(line, ""));
execFileSync("npx", ["clay", "generate", "clay/model.json", ".", "--force"], { stdio: "inherit" });
