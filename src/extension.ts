import * as vscode from "vscode"
import { SrccEditorProvider } from "./providers/srccEditorProvider"
import { toggleAutoOpen } from "./commands/toggleAutoOpen"

export function activate(context: vscode.ExtensionContext) {
  console.log("SRCC extension is now active!")

  const srccEditorProvider = SrccEditorProvider.register(context)
  // command
  const toggleAutoOpenCommand = vscode.commands.registerCommand(
    "srcc.toggleAutoOpen",
    toggleAutoOpen,
  )

  context.subscriptions.push(toggleAutoOpenCommand, srccEditorProvider)
}

export function deactivate() {
  console.log("SRCC extension is now deactivated!")
}
