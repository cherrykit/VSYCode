import * as vscode from 'vscode';
import getHTML from './render';

export default class View {

  // The panel created by the view
  panel?: vscode.WebviewPanel;
  //view?: vscode.Webview;

  constructor() {}

  _formatVariable = (variable : any) => {

    // TODO: Parse python var into js
    return JSON.parse(variable); /*{
      data: 10,
      a: {
          text: "haha"
      },
      b: {
          text: "nope"
      },
      c: {
          text: "ligma"
      }
    }; */
  };

  handleNewVariable = (variable : any) => {

    // Draw variable in the webview
    // console.log(`Drawing variable ${variable}`);

    const panel = vscode.window.createWebviewPanel(
      'catCoding', // Identifies the type of the webview. Used internally
      'Visualization', // Title of the panel displayed to the user
      vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
      {
        enableScripts: true,
      } // Webview options. More on these later.
    );

    const varToRender = this._formatVariable(variable);
    const html = getHTML(varToRender);
    panel.webview.html = html;

  };
}
