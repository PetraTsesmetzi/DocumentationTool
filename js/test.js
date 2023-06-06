/**
 * testdatei zum austesten von codestückchen
 * @param arr
 * @returns {*|*[]}
 */


export const findFreeArticleNumbers=function(arr){
    arr = arr.sort(function (a, b) {  return a - b;  });
    let count=0;
    let freeArticleNumbers=[]
    for (let i = arr[0]; i <arr[arr.length-1] ; i++) {
        if(arr[count]===i) {
            count++;
        }else{
            // console.log(i);
            freeArticleNumbers.push(i);
        }
    }

    freeArticleNumbers.push(Math.max(...arr));
    console.log(freeArticleNumbers);
    freeArticleNumbers = arr.sort(function (a, b) {  return b - a;  });
    return freeArticleNumbers;
}
let arr=[10,2,15];
findFreeArticleNumbers(arr);