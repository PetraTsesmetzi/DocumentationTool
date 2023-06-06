import {findFreeArticleNumbers, getJSONObj} from './helper.js';

export const state = {
    subchapter: {},
    subchapters:[],
    articles:[],
    deletedArticles:[],
    id:''
}
export const loadElements = async () => {
    try {

        let formData = new FormData();
        formData.append('action', 'loadElements');
        // console.log('model sendet');
        let data = await getJSONObj(formData);
        // console.log(JSON.parse(data[0]).articleArr);
        state.subchapters=[];
        for (let i = 0; i <data.length; i++) {
            let subchapters=JSON.parse(data[i]);
            state.subchapters[i]=subchapters;
        }
        state.deletedArticles=[];
        state.articles=[];
        let formDataArticles = new FormData();
        // console.log(id)
        formDataArticles.append('action', 'loadArticleNumbers');
        formDataArticles.append('id', '1');
        // console.log('model sendet');
        let dataArr = await getJSONObj(formDataArticles);
        console.log(JSON.parse(dataArr));
        for (let i = 0; i <dataArr.length; i++) {
            let subchapters=JSON.parse(dataArr[i]);
            for (let j = 0; j <subchapters.articleArr.length ; j++) {

                state.articles[j]=JSON.parse(subchapters.articleArr[j]);
                // console.log(state.articles[j]);
                let articleArr=JSON.parse(subchapters.articleArr[j]);
                //console.log(articleArr.articleNumber);
                state.deletedArticles[j]=articleArr.articleNumber;
            }
        }
        //console.log(state.deletedArticles)
        state.deletedArticles=findFreeArticleNumbers(state.deletedArticles);


    } catch (e) {
        console.log(e.name);
        console.log(e.message);
        console.log(e.lineNumber);
        document.getElementById("console-error").innerHTML = e.message;
    }
}
// export const loadElements = async () => {
//     try {
//
//         let formData = new FormData();
//         formData.append('action', 'loadElements');
//         // console.log('model sendet');
//         let data = await getJSONObj(formData);
//         // console.log(JSON.parse(data[0]).articleArr);
//
//         for (let i = 0; i <data.length; i++) {
//             let subchapters=JSON.parse(data[i]);
//             state.subchapters[i]=subchapters;
//
//             // console.log(subchapters.articleArr.length)
//             for (let j = 0; j <subchapters.articleArr.length ; j++) {
//                 state.articles[j]=JSON.parse(subchapters.articleArr[j]);
//                 let articleArr=JSON.parse(subchapters.articleArr[j]);
//
//                 state.deletedArticles[j]=articleArr.articleNumber;
//
//             }
//         }
//         // state.deletedArticles=findFreeArticleNumbers(state.deletedArticles);
//         // console.log(state.subchapters[0])
//         // console.log(state.deletedArticles);
//     } catch (e) {
//         console.log(e.name);
//         console.log(e.message);
//         console.log(e.lineNumber);
//         document.getElementById("console-error").innerHTML = e.message;
//     }
// }
export const loadArticleNumbersFromSub=async (id)=>{
    try {
        console.log('+++++++++++'+id);
        let formData = new FormData();
        formData.append('action', 'loadElements');
        // console.log('model sendet');
        let data = await getJSONObj(formData);
        // console.log(JSON.parse(data[0]).articleArr);
        state.subchapters=[];
        state.id=id;
        console.log('fsdfsdfsdfs'+state.id);
        for (let i = 0; i <data.length; i++) {
            let subchapters=JSON.parse(data[i]);
            state.subchapters[i]=subchapters;
        }

        let formDataArr = new FormData();
        // console.log(id)
        formDataArr.append('action', 'loadArticleNumbers');
        formDataArr.append('id', id);

            let dataArr = await getJSONObj(formDataArr);
            // console.log(JSON.parse(data));
           // console.log(JSON.parse(data[0]).articleArr);

            state.deletedArticles=[];
            state.articles=[];
            for (let i = 0; i <dataArr.length; i++) {
                let subchapters=JSON.parse(dataArr[i]);
                //state.subchapters[i]=subchapters;

                 // console.log(subchapters)
                for (let j = 0; j <subchapters.articleArr.length ; j++) {

                    state.articles[j]=JSON.parse(subchapters.articleArr[j]);
                    // console.log(state.articles[j]);
                    let articleArr=JSON.parse(subchapters.articleArr[j]);
                    //console.log(articleArr.articleNumber);
                    state.deletedArticles[j]=articleArr.articleNumber;

                }
            }
            //console.log(state.deletedArticles)
            state.deletedArticles=findFreeArticleNumbers(state.deletedArticles);

    } catch (e) {
        console.log(e.name);
        console.log(e.message);
        console.log(e.lineNumber);
        document.getElementById("console-error").innerHTML = e.message;
    }
}

// export const loadArticleNumbersFromSub=async (id)=>{
//     try {
//         let formData = new FormData();
//         // console.log(id)
//         formData.append('action', 'loadArticleNumbers');
//         formData.append('id', id);
//         // console.log('model sendet');
//         let data = await getJSONObj(formData);
//         // console.log(JSON.parse(data));
//         // console.log(JSON.parse(data[0]).articleArr);
//         state.subchapters=[];
//         state.deletedArticles=[];
//         state.articles=[];
//         for (let i = 0; i <data.length; i++) {
//             let subchapters=JSON.parse(data[i]);
//             state.subchapters[i]=subchapters;
//
//             // console.log(subchapters)
//             for (let j = 0; j <subchapters.articleArr.length ; j++) {
//
//                 state.articles[j]=JSON.parse(subchapters.articleArr[j]);
//                 // console.log(state.articles[j]);
//                 let articleArr=JSON.parse(subchapters.articleArr[j]);
//                 //console.log(articleArr.articleNumber);
//                 state.deletedArticles[j]=articleArr.articleNumber;
//
//             }
//         }
//         //console.log(state.deletedArticles)
//         state.deletedArticles=findFreeArticleNumbers(state.deletedArticles);
//
//     } catch (e) {
//         console.log(e.name);
//         console.log(e.message);
//         console.log(e.lineNumber);
//         document.getElementById("console-error").innerHTML = e.message;
//     }
// }
export const loadArticle = async (id) => {
    try {

        // erstelle ein formdata object
        let formData = new FormData();
        formData.append('action', 'loadArticles');
        formData.append('id', id);

        //hole JSONObj aus DB über helper-methode
        let dataRaw = await getJSONObj(formData);
        let data=JSON.parse(dataRaw);
        //dataObject wird geparsed
        const articlesArr = data.articleArr;

        for (const key in articlesArr) {
            articlesArr[key] = JSON.parse(articlesArr[key]);
            for (const keyKey in articlesArr[key].descriptionArr) {
                //console.log(articlesArr[key].descriptionArr);
                articlesArr[key].descriptionArr[keyKey] = JSON.parse(articlesArr[key].descriptionArr[keyKey]);
            }
            for (const keyKey in articlesArr[key].codeArr) {
                //console.log(articlesArr[key].descriptionArr);
                articlesArr[key].codeArr[keyKey] = JSON.parse(articlesArr[key].codeArr[keyKey]);
            }
        }

        //aufbereitung eine state.subchapter Object zu leichteren verarbeitung
        const articles2 = [];

        //ein artikel Object wird erstellt und in das articles2 array gepushed
        for (const key in articlesArr) {
            //mergen des descriptionsArr und CodeArr
            console.log()
            let articleElementsArr = [...articlesArr[key].descriptionArr, ...articlesArr[key].codeArr]
            articleElementsArr = sortArrayOfObjects(articleElementsArr, 'elementOrder');
            let article = {
                id: articlesArr[key].id,
                articleNumber: articlesArr[key].articleNumber,
                articleName: articlesArr[key].articleName,
                descriptionArr: articlesArr[key].descriptionArr,
                codeArr: articlesArr[key].codeArr,
                articleElementArr: articleElementsArr
            }
            articles2.push(article);

        }
        //ein subchapter wird erstellt
        state.subchapter =
            {
                subchapterName: data.subchapterName,
                articlesArr: articles2
            }
    } catch (e) {
        console.log(e.name);
        console.log(e.message);
        console.log(e.lineNumber);
        document.getElementById("console-error").innerHTML = e.message;
    }
}

export const createArticle = async (submitEvent) => {
    try {

        const formular = submitEvent.target;
        let formData = new FormData(formular);
        const descriptionsArr = [];
        const codeArr = [];
        for (const keys of formData.entries()) {
            if (keys[0].includes('description')) {
                let elementOrder = keys[0].split('_');
                let description = {};
                description.descriptionText = keys[1];
                description.elementOrder = elementOrder[1];
                descriptionsArr.push(description);

            }
            if (keys[0].includes('codeblock')) {
                let elementOrder = keys[0].split('_');
                let code = {};
                code.codeText = keys[1];
                code.elementOrder = elementOrder[1];
                codeArr.push(code);
            }
        }
        formData.append('action', 'createArticle');
        formData.append('descriptionsArr', JSON.stringify(descriptionsArr));
        formData.append('codeArr', JSON.stringify(codeArr));
        let data = await getJSONObj(formData);

    } catch ($e) {

    }
}


export const deleteArticle = async (id) => {
    try {
        console.log('edit this from db: ' + id);
        let formData = new FormData();
        formData.append('action', 'deleteArticle');
        formData.append('id',id);
        console.log('model sendet');
        let data = await getJSONObj(formData);
    } catch ($e) {
        console.log(e.name);
        console.log(e.message);
        console.log(e.lineNumber);
        document.getElementById("console-error").innerHTML = e.message;
    }
}

export const updateArticle = async (id) => {
    try {

    } catch ($e) {

    }
}


//sortiert ein Array mit Objekten nach einem vorgegebenem Attribut
const sortArrayOfObjects = (arr, propertyName, order = 'ascending') => {
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



