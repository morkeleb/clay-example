import { cpSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";

const dest = "tapes/.snapshot";

export function snapshot() {
  rmSync(dest, { recursive: true, force: true });
  cpSync("src/generated", `${dest}/src/generated`, { recursive: true });
  cpSync("src/logic", `${dest}/src/logic`, { recursive: true });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  snapshot();
}
