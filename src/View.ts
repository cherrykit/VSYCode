import * as vscode from 'vscode';
import getHTML from './render';

// Visualizes a single variable.
export default class ViewPanel {

  // The panel created by the view
  panel: vscode.WebviewPanel;

  constructor(varName: string) {
    this.panel = vscode.window.createWebviewPanel(
      'catCoding', 
      varName + ' - Visualization',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
      }
    );
  }

  render = (value: string) => {
    this.panel.webview.html = getHTML(JSON.parse(value));
  };

  onDidDispose = (callback: () => void) => {
    this.panel.onDidDispose(callback);
  };

}
