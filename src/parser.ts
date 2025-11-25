import * as vscode from "vscode"
import path from "node:path"
import fs from "node:fs"
import { toAbsolute } from "./utils"

export function parseSrcc(content: string, filepath: string) {
  const lines = content
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

  console.log(`Opening diff view: ${leftFilePath} vs ${rightFilePath}`)

  const srccDir = path.dirname(filepath)
  const resolvedLeftPath = toAbsolute(leftFilePath, srccDir)
  const resolvedRightPath = toAbsolute(rightFilePath, srccDir)

  if (!fs.existsSync(resolvedLeftPath)) {
    throw new Error(`左侧文件不存在: ${resolvedLeftPath}`)
  }
  if (!fs.existsSync(resolvedRightPath)) {
    throw new Error(`右侧文件不存在: ${resolvedRightPath}`)
  }

  // create URI
  const leftUri = vscode.Uri.file(resolvedLeftPath)
  const rightUri = vscode.Uri.file(resolvedRightPath)

  return [leftUri, rightUri] as const
}
