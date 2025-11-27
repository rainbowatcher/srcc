import * as vscode from "vscode"
import { parseSrcc } from "../parser"

export class SrccEditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      "srcc.diffView",
      new SrccEditorProvider(context),
    )
  }

  constructor(private readonly context: vscode.ExtensionContext) {}

  openCustomDocument() {}

  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken,
  ): Promise<void> {
    try {
      const autoOpen = vscode.workspace
        .getConfiguration("srcc")
        .get("autoOpenDiff", true)
      if (!autoOpen) {
        vscode.commands.executeCommand(
          "vscode.openWith",
          document.uri,
          "default",
        )
      } else {
        const { left, right } = await parseSrcc(document)

        vscode.commands.executeCommand(
          "vscode.diff",
          left.uri,
          right.uri,
          undefined,
          {
            preview: false,
          },
        )
      }

      webviewPanel.dispose()
    } catch (error: any) {
      // Display error information in Webview when error occurs
      webviewPanel.webview.html = `
                <html>
                <body style="padding: 20px; color: #f48771;">
                    <h3>Error loading .srcc file</h3>
                    <p>${error.message}</p>
                </body>
                </html>
            `
    }
  }
}
