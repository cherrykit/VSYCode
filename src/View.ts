import * as vscode from 'vscode';
import getHTML from './render';

export default class View {

  // The panel created by the view
  panel?: vscode.WebviewPanel;
  //view?: vscode.Webview;

  constructor() {
    // this.handleNewVariable.bind(this);
    // this._formatVariable.bind(this);
  }

  _formatVariable = (variable : any) => {

    // TODO: Parse python var into js
    return {
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
    };
  };

  handleNewVariable = (variable : any) => {

    // Draw variable in the webview
    // console.log(`Drawing variable ${variable}`);

    const panel = vscode.window.createWebviewPanel(
      'catCoding', // Identifies the type of the webview. Used internally
      'Visualization', // Title of the panel displayed to the user
      vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      {
        enableScripts: true,
      } // Webview options. More on these later.
    );

    const varToRender = this._formatVariable(variable);
    const html = getHTML(varToRender);
    console.log(html);
    panel.webview.html = getHTML(html);


    // panel.webview.html = getWebviewContent(variable);
    
    // getHTML(varToRender);
    // getWebviewContent(variable);
  };
}




// function getWebviewContent(variable: any) {
//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Cat Coding</title>
// </head>
// <body>
//     <canvas width='1000' height='1000' style="border: 1px solid #00f;"></canvas>
//     <p>Check out this variable: </p>
//     <p>${variable}</>

//     <script>
//       let canvas = document.querySelector('canvas');
//       canvas.width = 1000;
//       canvas.height = 1000;
//       let cx = canvas.getContext('2d');
//       cx.fillStyle = '#f00';
//       cx.fillRect(0,0,100,100);
//     </script>

// </body>
// </html>`;
// }