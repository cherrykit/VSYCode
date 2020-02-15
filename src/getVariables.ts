import * as vscode from 'vscode';
import { replace, addQuotes } from './replace';
export class DebugWrapper {
	session?: vscode.DebugSession;

	watchedVars: Map<string, string>;
	watchIntervalId?: NodeJS.Timeout;

	variableUpdateCallback: Function;

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

	watchVariable = (varName : string) => {
		if (this.session === undefined) {
			throw Error("Tried to watch variable but there is no active debug session");
		}

		this.watchedVars.set(varName, '');

		this.startWatch();
	};

	onVariableUpdate = (callback : (watchedVars : Map<string, string>) => void) => {
		this.variableUpdateCallback = callback;
	};


	// For auto refreshing variable values
	startWatch = () => {
		if (this.watchIntervalId) { 
			return;
		}
		this.watchIntervalId = setInterval(async () => {
			
			let newValues = await Promise.all(Array.from(this.watchedVars.keys()).map(async (varName) : Promise<[string, string]>  => {
				const varData = await getVariables(varName);
				return [varName, varData];
			}));

			let oldValues = Array.from(this.watchedVars.entries());

			// JSON.stringify() allows for deep object comparison
			if (JSON.stringify(newValues) !== JSON.stringify(oldValues)) {
				this.watchedVars = new Map(newValues);
				this.variableUpdateCallback(this.watchedVars);
			}

		}, 1000);
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
	}

	const response2 = await session.customRequest('variables', { variablesReference: response1.variablesReference});

	const variable = await parseVariable(session, "", response2.variables[0]);

	return addQuotes(variable);
}

async function parseVariable(session: vscode.DebugSession, string : string, response : any) {

	if (response.name === "__proto__" || response.type !== "Object") {
		return string;
	}

	if (string !== "") {
		string = replace(string, response);
	} else {
		string = response.value;
	}

	const response1 = await session.customRequest('variables', { variablesReference: response.variablesReference}); 

	for (let i = 0; i < response1.variables.length; i++) {
		string = await parseVariable(session, string, response1.variables[i]);
	}

	return string;

}