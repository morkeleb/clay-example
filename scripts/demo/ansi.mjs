function enabled() {
  if (process.env.NO_COLOR !== undefined && process.env.NO_COLOR !== "") return false;
  if (process.env.FORCE_COLOR === "0") return false;
  return Boolean(process.stdout.isTTY || process.stderr.isTTY) || process.env.FORCE_COLOR === "1";
}

function paint(code, text) {
  if (!enabled()) return text;
  return `\u001b[${code}m${text}\u001b[0m`;
}

export const red = (text) => paint("31", text);
export const green = (text) => paint("32", text);
export const yellow = (text) => paint("33", text);
export const cyan = (text) => paint("36", text);
export const dim = (text) => paint("2", text);
export const boldRed = (text) => paint("1;31", text);
