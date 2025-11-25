import * as path from "path"

export function toAbsolute(filePath: string, baseDir?: string): string {
  if (path.isAbsolute(filePath)) {
    return filePath
  }
  const base = baseDir || process.cwd()
  return path.resolve(base, filePath)
}
