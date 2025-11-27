import vscode from "vscode"
import * as path from "path"

interface ToAbsOptions {
  uri?: boolean
}

export function toAbsolute(filePath: string, baseDir?: string): string
export function toAbsolute(
  filePath: string,
  baseDir: string | undefined,
  opts: ToAbsOptions & { uri: true },
): vscode.Uri

export function toAbsolute(
  filePath: string,
  baseDir?: string,
  opts?: ToAbsOptions,
): string | vscode.Uri {
  const { uri = false } = opts ?? {}
  if (path.isAbsolute(filePath)) {
    return uri ? vscode.Uri.file(filePath) : filePath
  }
  const base = baseDir || process.cwd()
  const absPath = path.resolve(base, filePath)
  return uri ? vscode.Uri.file(absPath) : absPath
}
