// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "viscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.viscode', () => {
		// The code you place here will be executed every time your command is executed

		getVariables();

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello VS World!');
	});

	context.subscriptions.push(disposable);

}

async function getVariables() {

	const session = vscode.debug.activeDebugSession;
	if (!session) return;
	const response = await session.customRequest('stackTrace', { threadId: 1 })
	const frameId = response.stackFrames[0].id;

	const response2 = await session.customRequest('scopes', { frameId: frameId });
	const ref = response2.scopes[0].variablesReference;

	const response3 = await session.customRequest('variables', { variablesReference: ref });

	const response1 = await session.customRequest('evaluate', { expression: 'text', frameId: frameId });
	const car = response1.result;

}

// this method is called when your extension is deactivated
export function deactivate() {}
