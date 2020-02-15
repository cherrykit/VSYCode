import * as vscode from 'vscode';

export default async function getVariables(varName: string) {

	const session = vscode.debug.activeDebugSession;
	if (!session) { 
    return;
  }
	const response = await session.customRequest('stackTrace', { threadId: 1 });
	const frameId = response.stackFrames[0].id;

	//const response2 = await session.customRequest('scopes', { frameId: frameId });
	//const ref = response2.scopes[0].variablesReference;

	//const response3 = await session.customRequest('variables', { variablesReference: ref });

	const response1 = await session.customRequest('evaluate', { expression: varName, frameId: frameId });

	if (response1.type != "Object") {
		return response1.result;
	}

	const response2 = await session.customRequest('variables', { variablesReference: response1.variablesReference});

	const variable = await parseVariable(session, "", response2.variables[0]);

	return variable;
}

async function parseVariable(session: vscode.DebugSession, string : string, response : any) {

	if (response.name == "__proto__" || response.type != "Object") {
		return string;
	}

	//modify string to incorporate info from current object

	string += response.value;


	const response1 = await session.customRequest('variables', { variablesReference: response.variablesReference}); 

	for (let i = 0; i < response1.variables.length; i++) {
		string = await parseVariable(session, string, response1.variables[i]);
	}

	return string;

}