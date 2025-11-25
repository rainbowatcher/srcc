import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  console.log('SRCC extension is now active!');

  // register toggle auto open command
  const toggleAutoOpenCommand = vscode.commands.registerCommand('srcc.toggleAutoOpen', toggleAutoOpen);

  const openDocumentDisposable = vscode.workspace.onDidOpenTextDocument((document) => {
    if (document.languageId === 'source-compare') {
      handleSrccFile(document);
    }
  });

  // register functions
  context.subscriptions.push(openDocumentDisposable, toggleAutoOpenCommand);
}

/**
 * Process .srcc files, read paths, and open the diff view.
 */
async function handleSrccFile(document: vscode.TextDocument) {
  try {
    // check configuration
    const autoOpen = vscode.workspace.getConfiguration('srcc').get('autoOpenDiff', true);
    if (!autoOpen) return
    const content = document.getText();

    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    if (lines.length < 2) {
      vscode.window.showWarningMessage('SRCC文件格式错误：需要至少两个文件路径（每行一个）');
      return;
    }

    const [leftFilePath, rightFilePath] = lines;

    if (!leftFilePath || !rightFilePath) {
      vscode.window.showWarningMessage('SRCC文件格式错误：文件路径不能为空');
      return;
    }

    console.log(`Opening diff view: ${leftFilePath} vs ${rightFilePath}`);

    const srccDir = path.dirname(document.fileName);
    const resolvedLeftPath = path.isAbsolute(leftFilePath) ? leftFilePath : path.resolve(srccDir, leftFilePath);
    const resolvedRightPath = path.isAbsolute(rightFilePath) ? rightFilePath : path.resolve(srccDir, rightFilePath);

    // Check if the file exists
    const fs = require('fs');
    if (!fs.existsSync(resolvedLeftPath)) {
      vscode.window.showErrorMessage(`左侧文件不存在: ${resolvedLeftPath}`);
      return;
    }
    if (!fs.existsSync(resolvedRightPath)) {
      vscode.window.showErrorMessage(`右侧文件不存在: ${resolvedRightPath}`);
      return;
    }

    // create URI
    const leftUri = vscode.Uri.file(resolvedLeftPath);
    const rightUri = vscode.Uri.file(resolvedRightPath);

    // open compare view
    await vscode.commands.executeCommand('vscode.diff', leftUri, rightUri);
  } catch (error) {
    console.error('Error handling SRCC file:', error);
    vscode.window.showErrorMessage(`处理SRCC文件时出错: ${error}`);
  }
}

/**
 * Toggle the auto open diff view setting
 */
async function toggleAutoOpen() {
  const config = vscode.workspace.getConfiguration('srcc');
  const currentValue = config.get('autoOpenDiff', true);

  const newValue = !currentValue;

  try {
    await config.update('autoOpenDiff', newValue, vscode.ConfigurationTarget.Global);

    const statusText = newValue ? '启用' : '禁用';
    vscode.window.showInformationMessage(`自动打开差异视图已${statusText}`);
  } catch (error) {
    console.error('Error toggling auto open setting:', error);
    vscode.window.showErrorMessage('切换自动打开设置时出错');
  }
}

export function deactivate() {
  console.log('SRCC extension is now deactivated!');
}
