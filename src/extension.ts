import * as vscode from 'vscode';
import * as path from 'path';

/**
 * 当扩展激活时调用的函数
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('SRCC extension is now active!');

    // 监听文本文档打开事件
    const openDocumentDisposable = vscode.workspace.onDidOpenTextDocument((document) => {
        if (document.languageId === 'source-compare') {
            handleSrccFile(document);
        }
    });

    // 监听活跃编辑器变化，确保新打开的.srcc文件也能被处理
    // const activeEditorDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
    //     if (editor && editor.document.languageId === 'source-compare') {
    //         handleSrccFile(editor.document);
    //     }
    // });

    // 注册dispose函数
    context.subscriptions.push(openDocumentDisposable/* , activeEditorDisposable */);
}

/**
 * 处理.srcc文件，读取路径并打开diff视图
 */
async function handleSrccFile(document: vscode.TextDocument) {
    try {
        // 获取文件内容
        const content = document.getText();

        // 按行分割，获取前两行作为文件路径
        const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        if (lines.length < 2) {
            vscode.window.showWarningMessage('SRCC文件格式错误：需要至少两个文件路径（每行一个）');
            return;
        }

        // TypeScript安全：检查数组元素存在
        const leftFilePath = lines[0];
        const rightFilePath = lines[1];

        if (!leftFilePath || !rightFilePath) {
            vscode.window.showWarningMessage('SRCC文件格式错误：文件路径不能为空');
            return;
        }

        console.log(`Opening diff view: ${leftFilePath} vs ${rightFilePath}`);

        // 解析文件路径：支持绝对路径和相对路径（相对于.srcc文件所在目录）
        const srccDir = path.dirname(document.fileName);
        const resolvedLeftPath = path.isAbsolute(leftFilePath) ? leftFilePath : path.resolve(srccDir, leftFilePath);
        const resolvedRightPath = path.isAbsolute(rightFilePath) ? rightFilePath : path.resolve(srccDir, rightFilePath);

        // 检查文件是否存在
        const fs = require('fs');
        if (!fs.existsSync(resolvedLeftPath)) {
            vscode.window.showErrorMessage(`左侧文件不存在: ${resolvedLeftPath}`);
            return;
        }
        if (!fs.existsSync(resolvedRightPath)) {
            vscode.window.showErrorMessage(`右侧文件不存在: ${resolvedRightPath}`);
            return;
        }

        // 创建URI
        const leftUri = vscode.Uri.file(resolvedLeftPath);
        const rightUri = vscode.Uri.file(resolvedRightPath);

        // 检查配置是否自动打开diff视图
        const autoOpen = vscode.workspace.getConfiguration('srcc').get('autoOpenDiff', true);
        if (autoOpen) {
            // 打开diff视图
            await vscode.commands.executeCommand('vscode.diff', leftUri, rightUri);
        }

    } catch (error) {
        console.error('Error handling SRCC file:', error);
        vscode.window.showErrorMessage(`处理SRCC文件时出错: ${error}`);
    }
}

/**
 * 当扩展停用时调用的函数
 */
export function deactivate() {
    console.log('SRCC extension is now deactivated!');
}
