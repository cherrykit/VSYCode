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

    // Open graphical renderer webview beside the current code window
    this.panel = vscode.window.createWebviewPanel(
      'catCoding', 
      'Visualization',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
      }
    );

    const varToRender = this._formatVariable(variable);
    const html = getHTML(varToRender);
    this.panel.webview.html = html;

  };
}
