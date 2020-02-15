<<<<<<< HEAD:src/render.ts
/* eslint-disable */
//var fs = require('fs')


let lines = '';
let whites = '';
let circles = '';
let text = 'cx.fillStyle=\"Fuchsia\";';
let warnings = '';

export default function getHTML(obj : any){
    var html = '<html><body><canvas width="700" height="700"></canvas><script>let cx = document.querySelector("canvas").getContext("2d");' 
    render(obj, "Main", 200, 200)
    html += lines
    html += whites
    html += circles
    html += text
    html += '</script>'
    if(warnings.length > 0) html += '<div>' + warnings + '</div>'
    html += '</body></html>'
=======
var fs = require('fs');

let lines: string = '';
let whites:string  = '';
let circles: string = '';
let text:string = 'cx.fillStyle=\"Blue\";';
let warnings:string = '';

function getHTML(obj: any){
    var html = '<html><body><canvas width="700" height="700"></canvas><script>let cx = document.querySelector("canvas").getContext("2d");cx.lineWidth=1;';
    render(obj, "Current", 200, 200);
    html += lines;
    html += whites;
    html += circles;
    html += text;
    html += '</script>';
    if(warnings.length > 0) html += '<div>' + warnings + '</div>';
    html += '</body></html>';
>>>>>>> 9593cf252d046a0f31a79e4912d3cdd38e5345d6:src/render.js

    return html;
}

<<<<<<< HEAD:src/render.ts
function render(obj:any, name:any, x:any, y:any){
    text += 'cx.font = \"16px Comic Sans MS\";cx.fillText(\"' + name + '\", ' + (x+5) + ', ' + (y+20) + ');cx.font = \"12px Comic Sans MS\";'
    var boxSize = 40
    const keys = Object.keys(obj)
    var objectFields = []

    var numlines = 0;
    for(const key of keys){
        if(numlines === 10){
            text += 'cx.fillText(\"...\",' + (x+5) + ',' + (y + boxSize) +');'
            // text += `cx.fillText(\"...\",${x+5}, ${y+boxSize});`
            boxSize += 20
            break
=======
function render(obj: any, name: string, x: number, y: number){
    text += 'cx.font = \"16px Comic Sans MS\";cx.fillText(\"' + name + '\", ' + (x+5) + ', ' + (y+20) + ');cx.font = \"12px Comic Sans MS\";';
    var boxSize = 40;
    const keys = Object.keys(obj);
    var objectFields = [];
    var numlines = 0;
    for(const key of keys){
        if(numlines === 10){
            text += 'cx.fillText(\"...\",' + (x+5) + ',' + (y + boxSize) +');';
            boxSize += 20;
            break;
>>>>>>> 9593cf252d046a0f31a79e4912d3cdd38e5345d6:src/render.js
        }
        if(typeof(obj[key]) === "object"){
            objectFields.push([key, obj[key]]);
        }else{
            text += 'cx.fillText(\"' + key + ': ' + obj[key] + '\",' + (x+5) + ',' + (y + boxSize) +');';
            boxSize += 20;
            numlines++;
        }
    }

    var objCount = 0
    for(const objectPair of objectFields){
        var newx;
        var newy;
        if(objectPair[0] == 'left'){
            newy = y + boxSize + 50;
            newx = 0.5 * x;
        }
        else if(objectPair[0] == "right"){
            newy = y + boxSize + 50;
            newx = 1.5 * x;
        }else if(objectPair[0] == "next"){
            newx = x + 125;
            newy = y;
        }else{
            switch(objCount){
                case 0:
                    newy = y;
                    newx = x-125;
                    break;
                case 1:
                    newy = y + boxSize + 50;
                    newx = x;
                    break;
                case 2:
                    newy = y;
                    newx = x+125;
                    break;
                default:
                    warnings += "Field " + objectPair[0] + " of Object " + name + " not displayed\n";
                    continue;
            }
            objCount++;
        }
        var coordinates = render(objectPair[1], objectPair[0], newx, newy);
        lines += 'cx.beginPath();cx.moveTo('+ (x+boxSize/2) + ', ' + (y+boxSize/2) + ');cx.lineTo(' + coordinates[0] + ', ' + coordinates[1] + ');cx.stroke();';
    }

    whites += 'cx.beginPath();cx.fillStyle = \"White\";cx.arc(' + (x+boxSize/2) + ',' + (y+boxSize/2) + ',' + (boxSize *0.75) + ', 0, 2 * Math.PI);cx.fill();';
    if(name == 'Current'){
        circles += 'cx.strokeStyle = "Red";cx.lineWidth = 3;cx.beginPath();cx.arc(' + (x+boxSize/2) + ',' + (y+boxSize/2) + ',' + (boxSize *0.75) + ', 0, 2 * Math.PI);cx.stroke();cx.strokeStyle = "Black";cx.lineWidth = 1;';
    }else{
        circles += 'cx.beginPath();cx.arc(' + (x+boxSize/2) + ',' + (y+boxSize/2) + ',' + (boxSize *0.75) + ', 0, 2 * Math.PI);cx.stroke();';
    }
    
    return [(x+boxSize/2), (y+boxSize/2)];
}

let obj:Object = {
    data: 10,
    a: {
        text: "haha"
    },
    b: {
        text: "nope"
    },
    c: {
        text: "ligma"
    },
    d: {
        text: "ligma"
    }
}

fs.writeFile('mynewfile3.html', getHTML(obj), function (err: any) {
    if (err) throw err;
    console.log('Saved!');
  });