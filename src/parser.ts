import * as vscode from "vscode"
import path from "node:path"
import { toAbsolute } from "./utils"

export interface SrccItem {
  content: string
  filename: string
  filepath: string
  uri: vscode.Uri
}

export interface SrccContext {
  left: SrccItem
  right: SrccItem
}

export async function parseSrcc(
  document: vscode.TextDocument,
): Promise<SrccContext> {
  const lines = document
    .getText()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length < 2) {
    throw new Error(
      "SRCC file format error: at least two file paths required (one per line)",
    )
  }

  const [leftFilePath, rightFilePath] = lines

  if (!leftFilePath || !rightFilePath) {
    throw new Error("SRCC file format error: file paths cannot be empty")
  }

  return {
    left: await parseSrccItem(leftFilePath, document.uri.fsPath),
    right: await parseSrccItem(rightFilePath, document.uri.fsPath),
  }
}

export async function parseSrccItem(
  filepath: string,
  srccFilePath: string,
): Promise<SrccItem> {
  const { workspace } = vscode

  const workspaceRoot = workspace.workspaceFolders?.at(0)
  const srccParent = path.dirname(srccFilePath)

  let absUri = toAbsolute(filepath, srccParent, { uri: true })

  try {
    await workspace.fs.stat(absUri)
  } catch {
    // Try workspace root if srcc parent doesn't work
    absUri = toAbsolute(filepath, workspaceRoot?.uri.fsPath, { uri: true })
    try {
      await workspace.fs.stat(absUri)
    } catch {
      throw new Error(`File not found: ${filepath}`)
    }
  }

  const fileBuffer = await workspace.fs.readFile(absUri)
  const content = await workspace.decode(fileBuffer)

  return {
    content,
    filename: path.basename(filepath),
    filepath,
    uri: absUri,
  }
}
