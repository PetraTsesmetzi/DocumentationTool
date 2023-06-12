import {findFreeArticleNumbers, getJSONObj, ifNotExistsElements,sortArrayOfObjects } from './helper.js';

export const state = {
    subchapter: {
        subchapterName: '',
        articlesArr: []
    },
    editModeFlag: 'false',
    form: {
        actionForm: '',
        articleId:'',
        articleNr:'',
        articleName: '',
        subchapters: [],
        freeArticleNumbers: [],
        articles: [],
        articleElementArr: [],
        subchapterId: 1
    }
}


/**
 * holt alle Subchapters als objekte aus der db
 * @returns {Promise<*[]>}
 */
export const loadSubchapters = async () => {
    //alle subchapters
    const subchapters = [];
    let formData = new FormData();
    formData.append('action', 'loadElements');
    let data = await getJSONObj(formData);
    for (let i = 0; i < data.length; i++) {
        // let subchapter = JSON.parse(data[i]);
        subchapters[i] = JSON.parse(data[i]);
    }
    return subchapters;
}
/**
 * holt alle artikel als objekte aus der db
 * @returns {Promise<*[]>}
 */
export const loadArticles = async () => {

    const articles = [];
    let formData = new FormData();

    formData.append('action', 'loadArticles');
    let data = await getJSONObj(formData);
    for (let i = 0; i < data.length; i++) {
        // let article = JSON.parse(data[i]);
        articles[i] = JSON.parse(data[i]);
    }
    return articles;
}

export const loadArticleById = async (id) => {
    console.log('loadArticleById',id)
    //const article={};
    let formData = new FormData();

    formData.append('action', 'loadArticleById');
    formData.append('id', id);
    let article = await getJSONObj(formData);
    return JSON.parse(article);
}
/**
 *
 * holt article nach id übergabe-id von subchapter
 * @param id
 * @returns {Promise<void>}
 */
export const loadSubchapter = async (id) => {
    try {
        // console.log('################loadsupchapter with his articles in model')
        // erstelle ein formdata object
        let formData = new FormData();
        formData.append('action', 'loadSubchapterById');
        formData.append('id', id);

        //hole JSONObj aus DB über helper-methode
        let dataRaw = await getJSONObj(formData);
        let data = JSON.parse(dataRaw);
        //dataObject wird geparsed
        const articlesArr = data.articleArr;

        for (const key in articlesArr) {
            articlesArr[key] = JSON.parse(articlesArr[key]);
            for (const keyKey in articlesArr[key].descriptionArr) {
                articlesArr[key].descriptionArr[keyKey] = JSON.parse(articlesArr[key].descriptionArr[keyKey]);
            }
            for (const keyKey in articlesArr[key].codeArr) {
                articlesArr[key].codeArr[keyKey] = JSON.parse(articlesArr[key].codeArr[keyKey]);
            }
        }

        //aufbereitung eine state.subchapter Object zu leichteren verarbeitung
        const articles2 = [];

        //ein artikel Object wird erstellt und in das articles2 array gepushed
        for (const key in articlesArr) {
            //mergen des descriptionsArr und CodeArr

            let articleElementsArr = [...articlesArr[key].descriptionArr, ...articlesArr[key].codeArr]
            articleElementsArr = sortArrayOfObjects(articleElementsArr, 'elementOrder');

            let article = {};
            article.id = articlesArr[key].id;
            article.articleNumber = articlesArr[key].articleNumber;
            article.articleName = articlesArr[key].articleName;
            article.descriptionArr = articlesArr[key].descriptionArr;
            article.codeArr = articlesArr[key].codeArr;
            article.articleElementArr = articleElementsArr;

            articles2.push(article);

        }

        //ein subchapter wird erstellt
        state.subchapter.subchapterName = data.subchapterName;
        state.subchapter.articlesArr = articles2;

    } catch (e) {
        errorMessage(e);
    }
}

/**
 *
 * @param actionForm
 * @param event
 * @returns {Promise<void>}
 */
export const setVariablesForForm = async (actionForm,event) => {
    console.log('#############  setVariablesForForm for form')
    console.log( state.form.subchapterId)
    try {
        if (actionForm === 'create') {

            state.form.actionForm = 'create';
            state.form.subchapters = [];
            state.form.freeArticleNumbers = [];
            state.form.articles = [];
            state.form.subchapters = await loadSubchapters();
            await loadAllArticleNumbers( state.form.subchapterId);


        } else if (actionForm === 'update' && event) {
            console.log('****************************************event.target',event.target)
            console.log('****************************************actionForm: ',actionForm)
            console.log('++++++++++++++++++++model.state.form.subchapterId:',event.target.parentElement.parentElement.dataset.articleid)
            let articleId=event.target.parentElement.parentElement.dataset.articleid;
            let article = await loadArticleById(articleId);
            state.form.actionForm = 'update';
            state.form.articleId=articleId;
            state.form.articleName = article.articleName;
            state.form.articleNr=article.articleNumber;
            state.form.articleElementArr = sortArrayOfObjects([...article.descriptionArr, ...article.codeArr], 'elementOrder');
            state.form.subchapters = await loadSubchapters();
            state.form.subchapterId=state.form.subchapterId;
            //beim verschieben von artikeln wirds wichtig
            //await loadAllArticleNumbers( state.form.subchapterId);
        }
    } catch (e) {
        errorMessage(e);
    }
}

export const loadAllArticleNumbers = async function (subchapterId) {
    //Fallunterscheidung beim starten des docutools und beim klicken eines Unterkapittels im formular
    // console.log('#############  loadAllArticleNumbers for form')
    // console.log(subchapterId)

    let formDataArr = new FormData();
    formDataArr.append('action', 'loadArticleNumbers');
    if (subchapterId !== undefined) {
        formDataArr.append('id', subchapterId);
        state.form.subchapterId = subchapterId;
    } else {
        formDataArr.append('id', '1');
    }
    // console.log('fordata',formDataArr.get('id'))
    let dataArr = await getJSONObj(formDataArr);
    let takenArticleNumbers=[];
    for (let i = 0; i < dataArr.length; i++) {
        let subchapters = JSON.parse(dataArr[i]);
        //state.subchapters[i]=subchapters;

        for (let j = 0; j < subchapters.articleArr.length; j++) {

            state.form.articles[j] = JSON.parse(subchapters.articleArr[j]);

            let articleArr = JSON.parse(subchapters.articleArr[j]);

            takenArticleNumbers[j] = articleArr.articleNumber;
        }
    }
    state.form.freeArticleNumbers = findFreeArticleNumbers(takenArticleNumbers);
}




export const validateForm = async () => {
    console.log('validateForm')
    if(state.form.actionForm==='create'){
        const searchStr = document.getElementById('articleTitel').value;
        state.form.articleName = searchStr;
        let articles = await loadArticles();
        return ifNotExistsElements('checkArtikels', articles, searchStr);
    }else if(state.form.actionForm==='update'){
        const orginalStr=state.form.articleName;
        console.log(orginalStr)
        const searchStr = document.getElementById('articleTitel').value;
        if(orginalStr!==searchStr){
            console.log('validate')
            console.log(orginalStr)
            console.log(searchStr)
            state.form.articleName = searchStr;
            let articles = await loadArticles();
            return ifNotExistsElements('checkArtikels', articles, searchStr);
        }else{
            return true;
        }

    }
}

export const createAndUpdateArticle = async (submitEvent) => {
    console.log('in create')
    try {
        const form = submitEvent.target;
        let formData = new FormData(form);
        const descriptionsArr = [];
        const codeArr = [];
        //daten vom formular aufbereiten
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
        console.log('modelCreateUpdate')
        console.log(state.form.actionForm);
        if(state.form.actionForm==='create') formData.append('action', 'createArticle');
        if(state.form.actionForm==='update') {
            formData.append('action', 'updateArticle');
            // formData.append('articleName',state.form.articleName);
            formData.append('subchapterId',state.form.subchapterId);
            formData.append('articleId',state.form.articleId);
            formData.append('articleNr',state.form.articleNr);
            // formData.append('articleNumber',state.form.articleNumber);
        }
        formData.append('descriptionsArr', JSON.stringify(descriptionsArr));
        formData.append('codeArr', JSON.stringify(codeArr));

        let data = await getJSONObj(formData);


    } catch (e) {
        errorMessage(e);
    }
}
export const deleteArticle = async (id) => {
    try {
        let formData = new FormData();
        formData.append('action', 'deleteArticle');
        formData.append('id', id);
        let data = await getJSONObj(formData);
    } catch (e) {
        errorMessage(e);
    }
}

export const updateArticle = async (submitEvent) => {
    console.log(submitEvent.target)
    console.log('update modell')
    try {
        const form = submitEvent.target;
        let formData = new FormData(form);
        const descriptionsArr = [];
        const codeArr = [];
        //daten vom formular aufbereiten
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
        formData.append('action', 'updateArticle');
        formData.append('descriptionsArr', JSON.stringify(descriptionsArr));
        formData.append('codeArr', JSON.stringify(codeArr));

        let data = await getJSONObj(formData);
        console.log(data);

    } catch (e) {
        errorMessage(e);
    }
}


const errorMessage = function (e) {
    console.log(e.name);
    console.log(e.message);
    console.log(e.lineNumber);
    document.getElementById("console-error").innerHTML = e.message;
}



