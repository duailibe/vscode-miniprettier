import * as vscode from "vscode";
import findPrettier from "./find-prettier";
import { PrettierModule } from "./types";

function getLanguages() {
  const _languages = new Array<string>();
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders === undefined) {
    _addLanguages(findPrettier().instance);
  } else {
    workspaceFolders.forEach(folder => {
      _addLanguages(findPrettier(folder.uri.fsPath).instance);
    });
  }
  return Array.from(new Set(_languages));

  function _addLanguages(prettier: PrettierModule) {
    prettier.getSupportInfo().languages.forEach(lang => {
      if (lang && lang.vscodeLanguageIds) {
        _languages.push(...lang.vscodeLanguageIds);
      }
    });
  }
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.languages.registerDocumentFormattingEditProvider(
    getLanguages(),
    formattingProvider
  );

  context.subscriptions.push(disposable);
}

const formattingProvider = {
  provideDocumentFormattingEdits(
    document: vscode.TextDocument
  ): vscode.TextEdit[] {
    const text = document.getText();

    const result = format(text, document);
    if (result === text) {
      return [];
    }
    return [vscode.TextEdit.replace(fullDocumentRange(document), result)];
  }
};

function fullDocumentRange(document: vscode.TextDocument) {
  const lastLineId = document.lineCount - 1;
  return new vscode.Range(
    0,
    0,
    lastLineId,
    document.lineAt(lastLineId).text.length
  );
}

function format(text: string, { fileName: filepath }: vscode.TextDocument) {
  const { instance: prettier, local } = findPrettier(filepath);
  const options = local
    ? prettier.resolveConfig.sync(filepath)
    : vscode.workspace.getConfiguration("prettier.defaultOptions");
  return prettier.format(text, { ...options, filepath });
}

export function deactivate() {}
