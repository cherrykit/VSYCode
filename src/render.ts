var fs = require('fs');

let lines: string = '';
let whites:string  = '';
let shapes: string = '';
let text:string = 'cx.fillStyle=foreground;';
let warnings:string = '';

const center:number = 200;

let vname = '';

export default function getHTML(varName: string, obj: any){
    lines = '';
    whites = '';
    shapes = '';
    vname = varName;
    text = 'cx.fillStyle=foreground;';
    warnings = '';
    var html = '<html><body>';
    
    if(obj.constructor === Object){
        if(Object.entries(obj).length == 0){
            warnings += "This object is empty.";
        }else{
            render(obj, varName, center, 100);
        }
    }else{
        warnings += "This is not an object.";
    }
    if(warnings.length > 0) html += '<div color="Red">' + warnings + '</div>';
    html +='<canvas width="700" height="700"></canvas><script>let canvas = document.querySelector("canvas");let cx = canvas.getContext("2d");';
    html += 'var background = "Black"; var foreground = "White";';
    html += 'cx.lineWidth=2;cx.fillStyle=background;cx.fillRect(0, 0, canvas.width, canvas.height);cx.strokeStyle = foreground;cx.fillStyle=foreground;';
    html += lines;
    html += whites;
    html += shapes;
    html += text;
    html += '</script>';
    html += '</body></html>';

    return html;
}

function renderArray(arr: Array<any>, name: string, x: number, y: number){
    text += 'cx.font = \"16px Consolas\";cx.fillText(\"' + name + '\", ' + (x+7) + ', ' + y + ');cx.font = \"12px Consolas\";';
    var arrSize = 5;
    for(let elem of arr){
        text += 'cx.fillText(\"' + elem + '\", ' + (x+7) + ', ' + (y + arrSize+13) + ');';
        shapes += 'cx.beginPath();cx.strokeRect(' + x + ', '+ (y+arrSize)+ ', 20, 20);cx.stroke();';
        arrSize += 20;
    }
    return [x, y];
}
 
function render(obj: any, name: string, x: number, y: number){
    if(Array.isArray(obj)) {return renderArray(obj, name, x, y);}
    text += 'cx.font = \"16px Consolas\";cx.fillText(\"' + name + '\", ' + (x+5) + ', ' + (y+20) + ');cx.font = \"12px Consolas\";';
    var boxSize = 40;
    const keys = Object.keys(obj);
    var objectFields = [];
    var numlines = 0;
    for(const key of keys){
        if(numlines === 10){
            text += 'cx.fillText(\"...\",' + (x+5) + ',' + (y + boxSize) +');';
            boxSize += 20;
            break;
        }
        if(typeof(obj[key]) === "object"){
            if(obj[key] != null && obj[key] != undefined) objectFields.push([key, obj[key]]);
        }else{
            text += 'cx.fillText(\"' + key + ': ' + obj[key] + '\",' + (x+5) + ',' + (y + boxSize) +');';
            boxSize += 20;
            numlines++;
        }
    }

    var objCount = 0;
    for(const objectPair of objectFields){
        var newx;
        var newy;
        if(objectPair[0] === 'left' || objCount === 0){
            newy = y + boxSize + 50;
            if(x-center > 0) newx = 0.5 * (x-center) +center;
            else if(x-center < 0) newx = 1.5 * (x-center) +center;
            else newx = 0.5*center;
        }
        else if(objectPair[0] === "right" || objCount === 1){
            newy = y + boxSize + 50;
            if(x-center > 0) newx = 1.5 * (x-center) +center;
            else if(x-center < 0) newx = 0.5 * (x-center) +center;
            else newx = 1.5*center;
        }else if(objectPair[0] === "next"){
            newx = x + 125;
            newy = y;
        }else{
            switch(objCount){
                case 2:
                    newy = y + boxSize + 50;
                    newx = x;
                    break;
                case 3:
                    newy = y;
                    newx = x-125;
                    break;
                case 4:
                    newy = y;
                    newx = x+125;
                    break;
                default:
                    warnings += "Field " + objectPair[0] + " of Object " + name + " not displayed\n";
                    continue;
            }
        }
        objCount++;
        var coordinates = render(objectPair[1], objectPair[0], newx, newy);
        lines += 'cx.beginPath();cx.moveTo('+ (x+boxSize/2) + ', ' + (y+boxSize/2) + ');cx.lineTo(' + coordinates[0] + ', ' + coordinates[1] + ');cx.stroke();';
    }

    whites += 'cx.beginPath();cx.fillStyle = background;cx.arc(' + (x+boxSize/2) + ',' + (y+boxSize/2) + ',' + (boxSize *0.75) + ', 0, 2 * Math.PI);cx.fill();';
    if(name === vname){
        shapes += 'cx.strokeStyle = "Red";cx.lineWidth = 3;cx.beginPath();cx.arc(' + (x+boxSize/2) + ',' + (y+boxSize/2) + ',' + (boxSize *0.75) + ', 0, 2 * Math.PI);cx.stroke();cx.strokeStyle = foreground;cx.lineWidth = 1;';
    }else{
        shapes += 'cx.beginPath();cx.arc(' + (x+boxSize/2) + ',' + (y+boxSize/2) + ',' + (boxSize *0.75) + ', 0, 2 * Math.PI);cx.stroke();';
    }
    
    return [(x+boxSize/2), (y+boxSize/2)];
}

/*let obj:Object = {
    data: 10,
    a: {
        text: "haha"
    },
    b: {
        text: "nope"
    },
    c: [1, 5, 6, 8]
}

fs.writeFile('build.html', getHTML(obj), function (err: any) {
    if (err) throw err;
    console.log('Saved!');
  });*/

  