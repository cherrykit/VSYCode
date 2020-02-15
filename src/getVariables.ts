import * as vscode from 'vscode';

export default async function getVariables() {

	const session = vscode.debug.activeDebugSession;
	if (!session) { 
    return;
  }
	const response = await session.customRequest('stackTrace', { threadId: 1 });
	const frameId = response.stackFrames[0].id;

	const response2 = await session.customRequest('scopes', { frameId: frameId });
	const ref = response2.scopes[0].variablesReference;

	const response3 = await session.customRequest('variables', { variablesReference: ref });

	const response1 = await session.customRequest('evaluate', { expression: 'credits', frameId: frameId });
	const variable = response1.result;

	return variable;
}
