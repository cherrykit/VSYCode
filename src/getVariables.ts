import * as vscode from 'vscode';
import { replace, addQuotes } from './replace';
import { callbackify } from 'util';

type VariableUpdateCallback = (varName: string, varValue: string) => void;
export class DebugWrapper {
	session?: vscode.DebugSession;

	watchedVars: Map<string, {old: string, callback: VariableUpdateCallback}>;
	watchIntervalId?: NodeJS.Timeout;

	variableUpdateCallback: VariableUpdateCallback;

	constructor() {
		this.session = vscode.debug.activeDebugSession;
		this.watchedVars = new Map();
		this.variableUpdateCallback = () => {};

		this.setUpHandlers();
	}

	private setUpHandlers = () => {
		vscode.debug.onDidStartDebugSession(session => { this.session = session; });
		vscode.debug.onDidTerminateDebugSession(() => {
			this.endWatch();
			this.session = undefined;
		});
	};

	registerVariable = (varName : string, onVariableUpdate : VariableUpdateCallback) => {
		getVariables(varName).then(newVal => {
			this.watchedVars.set(varName, {old: newVal, callback: onVariableUpdate});
			onVariableUpdate(varName, newVal);
		});

		this.startWatch();
	};

	unregisterVariable = (varName: string) => {
		this.watchedVars.delete(varName);

		if (this.watchedVars.size === 0) {
			this.endWatch();
		}
	};

	// For auto refreshing variable values
	startWatch = () => {
		if (this.watchIntervalId) {
			return;
		}
		this.watchIntervalId = setInterval(async () => {

			// Detect variable changes and call callbacks if value has changed
			for (let [varName, {old: oldVal, callback}] of this.watchedVars.entries()) {
				getVariables(varName).then(newVal => {
					if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
						this.watchedVars.set(varName, {old: newVal, callback});
						callback(varName, newVal);
					}
				});
			}

		}, 500);
	};

	// For auto refreshing variable values
	endWatch = () => {
		if (this.watchIntervalId !== undefined) {
			clearInterval(this.watchIntervalId);
			this.watchIntervalId = undefined;
		}
	};
}

export default async function getVariables(varName: string) : Promise<string> {

	const session = vscode.debug.activeDebugSession;
	if (!session) {
    throw Error('No active debug session');
  }
	const response = await session.customRequest('stackTrace', { threadId: 1 });
	const frameId = response.stackFrames[0].id;

	//const response2 = await session.customRequest('scopes', { frameId: frameId });
	//const ref = response2.scopes[0].variablesReference;

	//const response3 = await session.customRequest('variables', { variablesReference: ref });

	const response1 = await session.customRequest('evaluate', { expression: varName, frameId: frameId });

	if (response1.type !== "Object") {
		return response1.result;
	} else if (response1.result.indexOf('Array') === 0) {
		return await constructArray(session, response1.variablesReference);
	}

	//const response2 = await session.customRequest('variables', { variablesReference: response1.variablesReference});

	const variable = await parseVariable(session, '', 
		{ name: 'var', type: 'Object', value: response1.result, variablesReference: response1.variablesReference});

	return addQuotes(variable);
}

async function parseVariable(session: vscode.DebugSession, string : string, response : any) {

	if (response.name === "__proto__" || response.type !== "Object") {
		return string;
	} else if (response.value.indexOf('Array') === 0) {
		return await constructArray(session, response.variablesReference);
	}

	if (string !== "") {
		string = replace(string, response);
	} else {
		string = response.value.substr(response.value.indexOf('{'));
	}

	const response1 = await session.customRequest('variables', { variablesReference: response.variablesReference});

	for (let i = 0; i < response1.variables.length; i++) {
		string = await parseVariable(session, string, response1.variables[i]);
	}

	return string;

}

async function constructArray(session : vscode.DebugSession, ref : number) {

	let array = '[';
	const response = await session.customRequest('variables', { variablesReference: ref});
	for (let i = 1; i < response.variables.length; i++) {
		if (response.variables[i].name === "__proto__") break;
		array += addQuotes(await parseVariable(session, response.variables[i].value, response.variables[i]));
		if (array[array.length - 1] != ',') array += ',';
	}
	array = array.replace(/,$/,']');
	return array;

}