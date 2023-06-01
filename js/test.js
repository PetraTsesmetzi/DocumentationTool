

let blockScopedVar = 'Hello';
function exampleFunction() {
    if (true) {

        const anotherBlockScopedVar = 'World';
        console.log(blockScopedVar);  // Output: Hello
        console.log(anotherBlockScopedVar);  // Output: World
        blockScopedVar = 'du';
    }

}


exampleFunction()

console.log('ausserhalb')
console.log(blockScopedVar);  // Error: blockScopedVar is not defined
// console.log(anotherBlockScopedVar);  // Error: anotherBlockScopedVar is not defined