import * as vscode from 'vscode';
import getHTML from './render';

export default class View {

  // The panel created by the view
  panel?: vscode.WebviewPanel;

  constructor() {}

  _formatVariable = (variable : string) => {
    console.log('attempting to pars variable', variable);
    return JSON.parse(variable);
  };

  handleNewVariable = (varName : string, variable : string) => {

    // Open graphical renderer webview beside the current code window
    let panel = this.getWebViewPanel(varName);

    const varToRender = this._formatVariable(variable);
    const html = getHTML(varName, varToRender);
    
    panel.webview.html = html;

  };

  getWebViewPanel = (variable : string) : vscode.WebviewPanel => {
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'catCoding', 
        variable + ' - Visualization',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
        }
      );
    }
    return this.panel;
  };
}
