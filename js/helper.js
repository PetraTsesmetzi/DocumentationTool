import {API_URL} from './config.js';
import {state} from "./model.js";

/**
 * Ajax sendet per post method Daten an controller.php
 * empfängt JSON String
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

        return await response.json();
    }catch(e){
        console.log(e.name);
        console.log(e.message);
        console.log(e.lineNumber);
    }

}

/**
 * Findet in einem Array die fehlenden Zahlen von 1 bis zum max wert des übergebenen Arrays
 * gibt die fehlenden Zahlen mit einem neuen Maxwert (alter Maxwert +1) zurrück
 * @param arr
 * @returns {*[]}
 */
export const findFreeArticleNumbers=function(arr){

    arr = arr.sort(function (a, b) {  return a - b;});
    let count=0;
    let freeArticleNumbers=[]
    for (let i = 1; i <arr[arr.length-1] ; i++) {
        if(arr[count]===i) {
            count++;
        }else{
            freeArticleNumbers.push(i);
        }
    }
    if(arr.length===0){
        freeArticleNumbers.push(1);
    }else{
        freeArticleNumbers.push(Math.max(...arr)+1);
    }

    return freeArticleNumbers;
}

/**
 * Suchfunktion ob Artikelname schon in der Db vorhanden ist.
 * Ergebnisse der db werden vorher in args abgelegt
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