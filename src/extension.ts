// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { isRegExp } from 'util/types';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "al-object-extension-tracker" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

    let disposable = vscode.commands.registerCommand('al-object-extension-tracker.searchObjectExtension', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const position = editor.selection.active;

            // Get the entire line text where the cursor is located
            const lineText = document.lineAt(position.line).text;

            // Regular expression to match Record, Page, and Report declarations
            //TODO Upper case search        

            const regex = /(\w+)\s*:\s*(Record|Page|Report)\s*(?:"([^"]+)"|([a-zA-Z0-9_]+))/;

            // Find the match in the line text
            const match = lineText.match(regex);
            let objectName: string = '';
            let queryText: string = '';
            if (match) {
                const objectType = match[2];
                if (match[3]) {
                    objectName = match[3];
                    queryText =  `extends "${objectName}"`;
                }
                else if (match[4]) {
                    objectName = match[4];
                    queryText =  `extends ${objectName}`;
                }

                if (objectName) {
                    vscode.commands.executeCommand('workbench.action.findInFiles', {
                        query: queryText,
                        isRegExp: true,
                        triggerSearch: true
                    });
                } else {
                    vscode.window.showErrorMessage('No valid AL object (Record|Page|Report) found under cursor.');
                }
            } else {
                vscode.window.showErrorMessage('No valid AL object (Record|Page|Report) found under cursor.');
            }
        }
    });
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
