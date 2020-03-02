import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { PrettierModule } from "./types";

const globalDir = path.resolve(require("global-modules"), "..");
const pluginDir = path.resolve(__dirname, "..");

declare const __webpack_require__: typeof require;
declare const __non_webpack_require__: typeof require;
const r =
  typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;

export default function findPrettier(
  filepath?: string
): { instance: PrettierModule; local: boolean } {
  let prettierPath;

  if (filepath) {
    const folder = vscode.workspace.getWorkspaceFolder(
      vscode.Uri.file(path.dirname(filepath))
    );
    if (folder) {
      prettierPath = getPrettierPath(folder.uri.fsPath);
    }
  }

  if (prettierPath) {
    return { instance: r(prettierPath), local: true };
  }

  prettierPath = getPrettierPath(globalDir) || getPrettierPath(pluginDir);

  if (!prettierPath) {
    throw Error();
  }

  return { instance: r(prettierPath), local: false };
}

function getPrettierPath(dirpath: string): string | undefined {
  const filepath = path.join(dirpath, "node_modules", "prettier", "index.js");
  if (fs.existsSync(filepath)) {
    return filepath;
  }
}
