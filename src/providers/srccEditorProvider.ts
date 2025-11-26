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
      // 即使 Diff 视图打开了，这个标签页依然存在，我们需要给用户展示一些有用的信息
      // webviewPanel.webview.html = this.getHtmlForWebview(left.path, right.path)
      webviewPanel.dispose()
    } catch (error: any) {
      // 出错时在 Webview 显示错误信息
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
