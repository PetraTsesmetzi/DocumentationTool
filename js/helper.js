import {API_URL} from './config.js';
import {state} from "./model.js";

/**
 * ajax sendet per post method daten an controler.php
 * empfängt json
 * @param formData
 * @returns {Promise<any>}
 */
export const getJSONObj=async function(formData){
    try{

        const response = await fetch(`${API_URL}`,
            {
                body: formData,
                method: "post"
            });

        if(!response.ok) throw new Error(`${data.message} (${response.status}`);
        //data aufbereitung für stateObject
        let data = await response.json();

        // let data = JSON.parse(await response.json());
        // let data = JSON.parse(await response.text());

        return data;
    }catch(e){
        console.log(e.name);
        console.log(e.message);
        console.log(e.lineNumber);
    }

}

/**
 * findet in einem array die fehlenden zahlen von 1 bis zum max wert des übergebenen arrays
 * @param arr
 * @returns {*[]}
 */
export const findFreeArticleNumbers=function(arr){
    console.log('in free args',arr)
    console.log( state.form.actionForm)
    arr = arr.sort(function (a, b) {  return a - b;});
    // console.log(arr);
    let count=0;
    let freeArticleNumbers=[]
    for (let i = 1; i <arr[arr.length-1] ; i++) {
        if(arr[count]===i) {
            count++;
        }else{
            freeArticleNumbers.push(i);
        }
    }
    // console.log(freeArticleNumbers);

    if(arr.length===0){
        freeArticleNumbers.push(1);
    }else{
        freeArticleNumbers.push(Math.max(...arr)+1);
    }

    console.log('return free: ',freeArticleNumbers);
    return freeArticleNumbers;
}

/**
 * suchfunktion ob articel schon in der Db vorhanden ist.
 * ergebnisse der db werden vorher in args abgelegt
 * @param action
 * @param args
 * @param searchStr
 * @returns {boolean}
 */
export const ifNotExistsElements =(action,args,searchStr)=>{
    if(action==='checkArtikels'){

        let checkArticles=args.find((arg)=>arg.articleName===searchStr);

        return checkArticles === undefined ? true : false;
    }else if(action==='checkSubchapter'){
        // console.log(args);
        let checkSubchapter=args.find((arg)=>arg.subchapterName===searchStr);
        return checkSubchapter === undefined ? true : false;
    }
}


//sortiert ein Array mit Objekten nach einem vorgegebenem Attribut
export const sortArrayOfObjects = (arr, propertyName, order = 'ascending') => {
    const sortedArr = arr.sort((a, b) => {

        if (a[propertyName] < b[propertyName]) {
            return -1;

        }
        if (a[propertyName] > b[propertyName]) {
            return 1;

        }
        return 0;
    })
    if (order === 'descending') {
        return sortedArr.reverse();
    }
    return sortedArr;
}