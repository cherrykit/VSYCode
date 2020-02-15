import * as vscode from 'vscode';
import getHTML from './render';

export default class ViewPanel {
  // The panel created by the view
  panel?: vscode.WebviewPanel;
  variableName: string;

  constructor(variableName: string) {
    this.variableName = variableName;

  }

  getWebViewPanel = () : vscode.WebviewPanel => {
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'catCoding', 
        'Visualization',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
        }
      );
    }
    return this.panel;
  };

  reveal = () => {
    this.getWebViewPanel().reveal(vscode.ViewColumn.Beside);
  };

  render = (variableData: string) => {
    const varToRender = JSON.parse(variableData);
    const html = getHTML(varToRender);

    let panel = this.getWebViewPanel();
    
    panel.webview.html = html;

  };


  
}