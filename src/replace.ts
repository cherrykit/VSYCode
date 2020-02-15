export function replace(target: string, obj:any){
    target = target.substr(target.indexOf('{'));
    let name:string = obj.name;
    let value:string = obj.value;
    value = value.substr(value.indexOf('{'));
    let start:number = target.indexOf(name) + name.length + 1;
    let end:number = target.indexOf(',', start);
    if(end == -1) end = target.indexOf('}', start);
    let newstr:string = target.substr(0, start) + value + target.substr(end);
    return newstr;
}
export function addQuotes(target: string){
    let spaces:RegExp = / /g;
    let re1:RegExp = /{|{ /g;
    let re2:RegExp = /:|: /g;
    let re3:RegExp = /,|, /g;
    return target.replace(spaces, '').replace(re1, '{"').replace(re2, '":').replace(re3, ',"');
}

/* let a:string = 'BinaryTree { root:Node }';
let b:any = {
    name: 'root',
    value: 'Node { left: 1, right: 2}'
}

let c:string = addQuotes(replace(a, b));
console.log(c);
let d:any = JSON.parse(c);
console.log(d); */