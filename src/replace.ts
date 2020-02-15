export function replace(target: string, obj:any){
    target = target.substr(target.indexOf('{'));

    let value:string = obj.value;
    value = value.substr(value.indexOf('{'));

    let nameArr:Array<string> = obj.evaluateName.split('.');
    let beginStr:string = '';
    for(let i:number = 2; i < nameArr.length-1; ++i){
        beginStr += target.substr(0, target.indexOf(nameArr[i])+1);
        target = target.substr(target.indexOf(nameArr[i])+1);
    }
    let name:string = obj.name;
    let start:number = target.indexOf(name) + name.length + 1;
    let end:number = target.indexOf(',', start);
    if(end == -1) end = target.indexOf('}', start);
    let newstr:string = beginStr + target.substr(0, start) + value + target.substr(end);
    return newstr;
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