import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { rolePermissions, type RoleName } from "../generated/identity";
import { dispatch } from "../generated/routes";
import { AccessDenied } from "./access";
import type { HandlerContext } from "./context";
import { NotFound } from "./store";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const port = Number(process.env.PORT ?? 4317);

function composePage(): string {
  let html = readFileSync(path.join(root, "src/generated/page.html"), "utf8");
  const formsRoot = path.join(root, "src/generated/forms");
  for (const entity of readdirSync(formsRoot)) {
    const dir = path.join(formsRoot, entity);
    if (!statSync(dir).isDirectory()) continue;
    const forms = readdirSync(dir)
      .filter((file) => file.endsWith(".html"))
      .sort()
      .map((file) => readFileSync(path.join(dir, file), "utf8"));
    html = html.replace(`<!-- clay:forms:${entity} -->`, forms.join("\n"));
  }
  return html;
}

function send(res: ServerResponse, status: number, body: unknown, contentType: string): void {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "content-type": contentType,
    "cache-control": "no-store",
  });
  res.end(payload);
}

function userFrom(req: IncomingMessage): HandlerContext {
  const raw = req.headers["x-role"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value && value in rolePermissions) {
    return { user: { role: value as RoleName } };
  }
  return { user: { role: "reader" } };
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  const method = req.method ?? "GET";
  const url = new URL(req.url ?? "/", "http://127.0.0.1");

  try {
    if (method === "GET" && url.pathname === "/") {
      send(res, 200, composePage(), "text/html; charset=utf-8");
      return;
    }
    if (method === "GET" && url.pathname === "/client.js") {
      send(res, 200, readFileSync(path.join(root, "src/runtime/client.js"), "utf8"), "text/javascript; charset=utf-8");
      return;
    }

    let body: unknown = undefined;
    if (method === "POST") {
      const text = await readBody(req);
      try {
        body = JSON.parse(text) as unknown;
      } catch {
        send(res, 400, { error: "The body is not JSON." }, "application/json; charset=utf-8");
        return;
      }
    }

    const result = dispatch(userFrom(req), method, url.pathname, body);
    if (result === null) {
      send(res, 404, { error: "Not found." }, "application/json; charset=utf-8");
      return;
    }
    send(res, 200, result, "application/json; charset=utf-8");
  } catch (error) {
    if (error instanceof AccessDenied || error instanceof NotFound) {
      const status = error instanceof AccessDenied ? 403 : 404;
      send(res, status, { error: error.message }, "application/json; charset=utf-8");
      return;
    }
    console.error(error);
    send(res, 500, { error: "Server error." }, "application/json; charset=utf-8");
  }
});

const isMain = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  server.listen(port, "127.0.0.1", () => {
    console.log(`Shelf is on http://127.0.0.1:${port}`);
  });
}
