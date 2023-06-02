import {getJSONObj} from './helper.js';

export const state={
    subchapter:{}
}
export const loadArticle = async (id) => {
    try {

        // erstelle ein formdata object
        let formData = new FormData();
        formData.append('action','loadArticles');
        formData.append('id', id);

        //hole JSONObj aus DB über helper-methode
        let data=await getJSONObj(formData);

          //dataObject wird geparsed
        const articlesArr=data.articleArr;
        for (const key in articlesArr) {
            articlesArr[key]=JSON.parse(articlesArr[key]);
            for (const keyKey in  articlesArr[key].descriptionArr) {
                //console.log(articlesArr[key].descriptionArr);
                 articlesArr[key].descriptionArr[keyKey]=JSON.parse(articlesArr[key].descriptionArr[keyKey]);
            }
            for (const keyKey in  articlesArr[key].codeArr) {
                //console.log(articlesArr[key].descriptionArr);
                articlesArr[key].codeArr[keyKey]=JSON.parse(articlesArr[key].codeArr[keyKey]);
            }
        }

        //aufbereitung eine state.subchapter Object zu leichteren verarbeitung
        const articles2=[];

        //ein artikel Object wird erstellt und in das articles array gepushed
        for (const key in articlesArr) {
            //mergen des descriptionsArr und CodeArr

            let articleElementsArr=[...articlesArr[key].descriptionArr,...articlesArr[key].codeArr]
            articleElementsArr=sortArrayOfObjects(articleElementsArr,'elementOrder');
            let article = {
                id: articlesArr[key].id,
                articleNumber: articlesArr[key].articleNumber,
                articleName: articlesArr[key].articleName,
                descriptionArr: articlesArr[key].descriptionArr,
                codeArr: articlesArr[key].codeArr,
                articleElementArr:articleElementsArr
            }
            articles2.push(article);

        }
        //ein subchapter wir erstellt
        state.subchapter=
            {
                subchapterName:data.subchapterName,
                articlesArr:articles2
            }
    } catch (e) {
        console.log(e.name);
        console.log(e.message);
        console.log(e.lineNumber);
        document.getElementById("console-error").innerHTML =e.message;
    }
}

export const createArticle = async (submitEvent) => {
    try{


        const subChapterTitel=document.getElementById('subChapterTitel');
        const subChapterNr=document.getElementById('subChapterNr');
        const articleTitel=document.getElementById('articleTitel');
        const articleNr=document.getElementById('articleNr');
        const descriptions=document.getElementsByClassName('description');
        const codes=document.getElementsByClassName('code');
        const descriptionsArr=[];
        for (let i = 0; i < descriptions.length; i++) {
            let description={};
            description.descriptionText=descriptions[i].value;
            description.elementOrder=descriptions[i].dataset.elementorder;
            descriptionsArr.push(description);
        }
        const codeArr=[];
        for (let i = 0; i < codes.length; i++) {
            let code={};
            code.descriptionText=codes[i].value;
            code.elementOrder=codes[i].dataset.elementorder;
            codeArr.push(code);
        }
        console.log(codeArr);
        let formData = new FormData();
        formData.append('action','createArticle');
        formData.append('subChapterTitel',subChapterTitel.value);
        formData.append('subChapterNr',subChapterNr.value);

        formData.append('articleTitel',articleTitel.value);
        formData.append('articleNr',articleNr.value);

        formData.append('descriptionsArr',JSON.stringify(descriptionsArr));
        formData.append('codeArr',JSON.stringify(codeArr));

        let data=await getJSONObj(formData);

    }catch($e){

    }
}



export const deleteArticle = async (id) => {
    try{
        console.log('delete this from db: '+id);
    }catch($e){

    }
}

export const updateArticle = async (id) => {
    try{
        console.log('edit this from db: '+id);
    }catch($e){

    }
}









//sortiert ein Array mit Objekten nach einem vorgegebenem Attribut
const sortArrayOfObjects=(arr, propertyName, order='ascending')=>{
    const sortedArr=arr.sort((a,b)=>{

        if(a[propertyName]<b[propertyName]){
            return -1;

        }
        if(a[propertyName]>b[propertyName]){
            return 1;

        }
        return 0;
    })
    if(order==='descending'){
        return sortedArr.reverse();
    }
    return sortedArr;
}



