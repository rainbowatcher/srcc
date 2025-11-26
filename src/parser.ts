import * as vscode from "vscode"
import path from "node:path"
import fs from "node:fs"
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
    throw new Error("SRCC文件格式错误：需要至少两个文件路径（每行一个）")
  }

  const [leftFilePath, rightFilePath] = lines

  if (!leftFilePath || !rightFilePath) {
    throw new Error("SRCC文件格式错误：文件路径不能为空")
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
  const { Uri, workspace } = vscode

  const workspaceRoot = workspace.workspaceFolders?.at(0)
  const srccParent = path.dirname(srccFilePath)

  let absPath = toAbsolute(filepath, srccParent)
  if (!fs.existsSync(absPath)) {
    absPath = toAbsolute(filepath, workspaceRoot?.uri.fsPath)
  }

  if (!fs.existsSync(absPath)) {
    throw new Error("文件不存在: " + filepath)
  }

  const fileUri = Uri.file(absPath)
  const fileBuffer = await workspace.fs.readFile(fileUri)
  const content = await workspace.decode(fileBuffer)

  return {
    content,
    filename: path.basename(filepath),
    filepath,
    uri: fileUri,
  }
}
