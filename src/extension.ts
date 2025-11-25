import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('SRCC extension is now active!');

    const openDocumentDisposable = vscode.workspace.onDidOpenTextDocument((document) => {
        if (document.languageId === 'source-compare') {
            handleSrccFile(document);
        }
    });

    // register the dispose function
    context.subscriptions.push(openDocumentDisposable);
}

/**
 * Process .srcc files, read paths, and open the diff view.
 */
async function handleSrccFile(document: vscode.TextDocument) {
    try {
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

        // check configuration
        const autoOpen = vscode.workspace.getConfiguration('srcc').get('autoOpenDiff', true);
        if (autoOpen) {
            // open compare view
            await vscode.commands.executeCommand('vscode.diff', leftUri, rightUri);
        }

    } catch (error) {
        console.error('Error handling SRCC file:', error);
        vscode.window.showErrorMessage(`处理SRCC文件时出错: ${error}`);
    }
}

export function deactivate() {
    console.log('SRCC extension is now deactivated!');
}
