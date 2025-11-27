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

    const statusText = newValue ? "enabled" : "disable"
    vscode.window.showInformationMessage(
      `Automatically open diff view is ${statusText}`,
    )
  } catch (error) {
    console.error("Error toggling auto open setting:", error)
    vscode.window.showErrorMessage("Error switching automatic open settings")
  }
}
