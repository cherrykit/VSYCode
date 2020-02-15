export function replace(target: string, obj:any){
    let spaces:RegExp = / /g;
    target = target.replace(spaces, '');
    target = target.substr(target.indexOf('{'));

    let value:string = obj.value;
    value = value.substr(value.indexOf('{'));

    let nameArr:Array<string> = obj.evaluateName.split('.');
    let beginStr:string = '';
    for(let i:number = 2; i < nameArr.length; ++i){
        let nextField:string = nameArr[i];
        if(nextField == 'right'){
            let leftParen:number = target.indexOf('{', target.indexOf('left'))+1;
            let rightParen:number = findMatching(target, leftParen);
            beginStr += target.substr(0, rightParen+1);
            target = target.substr(rightParen+1);
        }
            beginStr += target.substr(0, target.indexOf(nextField)+nextField.length + 1);
            target = target.substr(target.indexOf(nextField)+nextField.length +1);
    }
    let end:number = target.indexOf(',');
    let end2:number = target.indexOf('}');
    if(end == -1 || end2 < end) end = end2;
    let newstr:string = beginStr + value + target.substr(end);
    return newstr;
}

function findMatching(str: string, index: number){
    let count:number = 1;
    while(count > 0){
        if(str[index] == '{') ++count;
        else if(str[index] == '}') --count;
        ++index;
        if (index == str.length) throw "No matching } found.";
    }
    return index;
}

export function addQuotes(target: string){
    let spaces:RegExp = / /g;
    let re1:RegExp = /{/g;
    let re2:RegExp = /:/g;
    let re3:RegExp = /,/g;
    return target.replace(spaces, '').replace(re1, '{"').replace(re2, '":').replace(re3, ',"');
}

/* let a:string = 'BinaryTree { root:Node }';
let b:any = {
    evaluateName: 'tree.root',
    name: 'root',
    value: 'Node { left: 1, right: 2}'
}

let c:string = addQuotes(replace(a, b));
console.log(c);
let d:any = JSON.parse(c);
console.log(d); */