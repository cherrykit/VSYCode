import * as vscode from 'vscode';

export default class View {

  // The panel created by the view
  panel?: vscode.WebviewPanel;
  //view?: vscode.Webview;

  constructor() {}

  handleNewVariable(variable : any) {

    // Draw variable in the webview
    // console.log(`Drawing variable ${variable}`);

    const panel = vscode.window.createWebviewPanel(
      'catCoding', // Identifies the type of the webview. Used internally
      'Visualization', // Title of the panel displayed to the user
      vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      {} // Webview options. More on these later.
    );

    panel.webview.html = getWebviewContent(variable);
  }
}




function getWebviewContent(variable: any) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <p>Check out this variable: </p>
    <p>${variable}</>

</body>
</html>`;
}