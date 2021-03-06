// 创建播放窗口
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const viewPath = path.join(__dirname, '..', 'view', 'list.html');
const viewHtml = fs.readFileSync(viewPath, {
    encoding: 'utf-8'
});

let _readPanel;

module.exports = function () {
    if (!_readPanel) {
        const activeDocument = vscode.window.activeTextEditor.document;
        const panel = _readPanel = vscode.window.createWebviewPanel(
            'ReadPanel',
            '会了吧：单词朗读',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        // WebView内容
        panel.webview.html = viewHtml;

        // 读完关闭
        panel.webview.onDidReceiveMessage(_data => {
            const { word, data } = _data;
            vscode.window.showInformationMessage([
                `朗读: ${word}`,
                data && data.phonetic ?
                    `音标：[${data.phonetic}]`
                    : ''
            ].join('　'));
        });

        // 关闭事件
        panel.onDidDispose(() => {
            _readPanel = null;
        });

        // 启动后激活之前的标签
        setTimeout(() => {
            vscode.window.showTextDocument(activeDocument);
        }, 200);

    }
    return _readPanel.webview;
};