import * as vscode from 'vscode';
import getHTML from './render';

export default class View {

  // The panel created by the view
  panel?: vscode.WebviewPanel;

  constructor() {}

  _formatVariable = (variable : any) => {
    return JSON.parse(variable);
  };

  handleNewVariable = (variable : any) => {

<<<<<<< HEAD
    // Draw variable in the webview
    // console.log(`Drawing variable ${variable}`);

    const panel = vscode.window.createWebviewPanel(
      'catCoding', // Identifies the type of the webview. Used internally
      'Visualization', // Title of the panel displayed to the user
      vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
=======
    // Open graphical renderer webview beside the current code window
    this.panel = vscode.window.createWebviewPanel(
      'catCoding', 
      'Visualization',
      vscode.ViewColumn.Beside,
>>>>>>> 83ff195b6deba7d0ad4866562c7211ef94ca412b
      {
        enableScripts: true,
      }
    );

    const varToRender = this._formatVariable(variable);
    const html = getHTML(varToRender);
    this.panel.webview.html = html;

  };
}
