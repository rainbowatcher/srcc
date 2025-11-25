import * as vscode from "vscode"
import { SrccEditorProvider } from "./providers/srccEditorProvider"
import { toggleAutoOpen } from "./commands/toggleAutoOpen"

export function activate(context: vscode.ExtensionContext) {
  console.log("SRCC extension is now active!")

  // register toggle auto open command
  const toggleAutoOpenCommand = vscode.commands.registerCommand(
    "srcc.toggleAutoOpen",
    toggleAutoOpen,
  )

  // register functions
  context.subscriptions.push(
    // openDocumentDisposable,
    toggleAutoOpenCommand,
    SrccEditorProvider.register(context),
  )
}

export function deactivate() {
  console.log("SRCC extension is now deactivated!")
}
