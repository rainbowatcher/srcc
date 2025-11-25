import * as vscode from "vscode"

/**
 * Toggle the auto open diff view setting
 */
export async function toggleAutoOpen() {
  const config = vscode.workspace.getConfiguration("srcc")
  const currentValue = config.get("autoOpenDiff", true)

  const newValue = !currentValue

  try {
    await config.update(
      "autoOpenDiff",
      newValue,
      vscode.ConfigurationTarget.Global,
    )

    const statusText = newValue ? "启用" : "禁用"
    vscode.window.showInformationMessage(`自动打开差异视图已${statusText}`)
  } catch (error) {
    console.error("Error toggling auto open setting:", error)
    vscode.window.showErrorMessage("切换自动打开设置时出错")
  }
}
