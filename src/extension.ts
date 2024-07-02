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
            const range = document.getWordRangeAtPosition(position, /"[^"]*"|[a-zA-Z0-9_]+/);
            const selectedWord = range ? document.getText(range) : '';
            let queryText: string = '';

            // Get the entire line text where the cursor is located
            const lineText = document.lineAt(position.line).text;
            const objectNameMatch = isObjectName(lineText);
            if (objectNameMatch) {
                if (objectNameMatch[3]) {
                    queryText = `extends "${objectNameMatch[3]}"`;
                }
                else if (objectNameMatch[4]) {
                    queryText = `extends ${objectNameMatch[4]}`;
                }
            }
            else if (isVariableObjectName(lineText, selectedWord)) {
                queryText = `extends ${selectedWord}`;
            } else if (objectNameMatch) {
                if (objectNameMatch[3]) {
                    queryText = `extends "${objectNameMatch[3]}"`;
                }
                else if (objectNameMatch[4]) {
                    queryText = `extends ${objectNameMatch[4]}`;
                }
            } else {
                vscode.window.showErrorMessage('No valid AL object (Record|Page|Report) found under cursor.');
            }

            if (queryText) {
                vscode.commands.executeCommand('workbench.action.findInFiles', {
                    query: queryText,
                    isRegExp: true,
                    triggerSearch: true
                });
            }
        }
    });
    context.subscriptions.push(disposable);
}

//var AssemblyHeader: Record "Assembly Header"
function isVariableObjectName(lineText: string, selectedWord: string): RegExpMatchArray | null {
    //const regex = new RegExp(`(\\w+)\\s*:\\s*(Record|Page|Report)\\s*\\b${selectedWord}\\b`,'i');
    const regex = new RegExp(`(\\w+)\\s*:\\s*(${getSupportedVariablesTypes()})\\s*${selectedWord}`, 'i');
    const match = lineText.match(regex);
    return (match);
}
//Todo isVariableName
//var AssemblyHeader: Record "Assembly Header"

//table 55001 "Some Setup ACS"
function isObjectName(lineText: string): RegExpMatchArray | null {
    const regex = new RegExp(`(${getSupportedObjectTypes()})\\s*(\\d+)\\s*(?:"([^"]+)"|([a-zA-Z0-9_]+))`, 'i');
    const match = lineText.match(regex);
    return (match);
}

//Todo isExtends
//Probably not needed
//tableextension 55019 "Sales Cr.Memo Line ACS" extends "Sales Cr.Memo Line"

function getSupportedVariablesTypes(): string {
    return 'Record|Page|Report';
}

function getSupportedObjectTypes(): string {
    return 'table|page|report';
}

// This method is called when your extension is deactivated
export function deactivate() { }
