// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import getVariables, { DebugWrapper } from './getVariables';
import View from './View';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ViSCode" is now active!');

	let view = new View();
	let debugWrapper = new DebugWrapper();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.viscode', () => {
		// The code you place here will be executed every time your command is executed

		const { activeTextEditor } = vscode.window;
		if (!activeTextEditor) { return; }
		const { document, selection } = activeTextEditor;
		const { end } = selection;

		const wordAtCursorRange = document.getWordRangeAtPosition(end);

		const variable = document.getText(wordAtCursorRange);

		debugWrapper.watchVariable(variable);

		// TODO: use map more generally
		debugWrapper.onVariableUpdate(varMap => {
			let value = varMap.get(variable);
			if (value === undefined) {
				throw Error(`KeyError variable ${variable} not present in map`);
			}
			view.handleNewVariable(variable, value);
		});
	});


	context.subscriptions.push(disposable);

}

// this method is called when your extension is deactivated
export function deactivate() {}