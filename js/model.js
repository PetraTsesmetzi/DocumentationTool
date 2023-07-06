import {findFreeArticleNumbers, getJSONObj, ifNotExistsElements, sortArrayOfObjects} from './helper.js';


export const state = {
    editModeFlag: 'false',
    form: {
        actionForm: '',
        articleId: '',
        articleNr: '',
        articleName: '',
        subchapters: [],
        freeArticleNumbers: [],
        articles: [],
        articleElementArr: [],
        articlesArr: [],
        subchapterId: 1,
        descriptionArr: [],
        codeArr: []
    }
}


/**
 * Holt alle Unterkapitel als Objekte aus der DB
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
 * Holt alle Artikel als Objekte aus der DB
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

/**
 * Holt einen Artikel mit gewählter ID
 * @param id
 * @returns {Promise<any>}
 */
export const loadArticleById = async (articleId) => {
    let formData = new FormData();
    formData.append('action', 'loadArticleById');
    formData.append('articleId', articleId);
    let article = await getJSONObj(formData);
    return JSON.parse(article);
}
/**
 *
 * Holt alle Artikel eines Unterkapitels aus der DB
 * @param id
 * @returns {Promise<void>}
 */
export const loadSubchapter = async (id) => {
    try {
        let formData = new FormData();
        formData.append('action', 'loadSubchapterById');
        formData.append('id', id);

        let dataRaw = await getJSONObj(formData);
        let data = JSON.parse(dataRaw);
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


        const articlesTemp = [];

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
            articlesTemp.push(article);

        }

        //ein state Object wird beschrieben
        state.form.subchapterName = data.subchapterName;
        state.form.articles = articlesTemp;
        state.form.subchapterId = id;


    } catch (e) {
        errorMessage(e);
    }
}

/**
 *setzt die stateAtribute für das Formular
 * @param actionForm
 * @param event
 * @returns {Promise<void>}
 */
export const setVariablesForForm = async (actionForm, event) => {
    try {
        if (actionForm === 'create') {
            state.form.actionForm = 'create';
            state.form.subchapters = [];
            state.form.freeArticleNumbers = [];
            state.form.articles = [];
            state.form.subchapters = await loadSubchapters();
            await loadAllArticleNumbers(state.form.subchapterId);

        } else if (actionForm === 'update' && event) {
            let articleId = event.target.parentElement.parentElement.dataset.articleid;
            let article = await loadArticleById(articleId);
            state.form.actionForm = 'update';
            state.form.articleId = articleId;
            state.form.articleName = article.articleName;
            state.form.articleNr = article.articleNumber;
            state.form.articleElementArr = sortArrayOfObjects([...article.descriptionArr, ...article.codeArr], 'elementOrder');
            state.form.descriptionArr = article.descriptionArr;
            state.form.codeArr = article.codeArr;
            state.form.subchapters = await loadSubchapters();
            state.form.subchapterId = state.form.subchapterId;
            console.log(state.form)
        }
    } catch (e) {
        errorMessage(e);
    }
}
/**
 * lädt alle Artikel Nummern aus der DB um anschließend die freien Nummer über die Helpermethode
 * findFreeArticleNumbers zu ermitteln
 * dient dazu Artikel in einer gewissen Reihenfolge zu platzieren
 * @param subchapterId
 * @returns {Promise<void>}
 */
export const loadAllArticleNumbers = async function (subchapterId) {
    //Fallunterscheidung beim starten des docutools und beim klicken eines Unterkapittels im formular
    let formDataArr = new FormData();
    formDataArr.append('action', 'loadArticleNumbers');
    if (subchapterId !== undefined) {
        formDataArr.append('id', subchapterId);
        state.form.subchapterId = subchapterId;
    } else {
        formDataArr.append('id', '1');
    }

    let dataArr = await getJSONObj(formDataArr);
    let takenArticleNumbers = [];
    for (let i = 0; i < dataArr.length; i++) {
        let subchapters = JSON.parse(dataArr[i]);

        for (let j = 0; j < subchapters.articleArr.length; j++) {

            state.form.articles[j] = JSON.parse(subchapters.articleArr[j]);

            let articleArr = JSON.parse(subchapters.articleArr[j]);

            takenArticleNumbers[j] = articleArr.articleNumber;
        }
    }
    state.form.freeArticleNumbers = findFreeArticleNumbers(takenArticleNumbers);
}


/**
 * Validiert das Formular
 * Schaut ein Artikelname existiert
 * Aussnahme stellt das Update eines Artikels
 * @returns {Promise<boolean>}
 */

export const validateForm = async () => {

    if (state.form.actionForm === 'create') {

        const searchStr = document.getElementById('articleTitel').value;
        state.form.articleName = searchStr;
        let articles = await loadArticles();
        return ifNotExistsElements('checkArtikels', articles, searchStr);

    } else if (state.form.actionForm === 'update') {
        const orginalStr = state.form.articleName;
        const searchStr = document.getElementById('articleTitel').value;
        if (orginalStr !== searchStr) {
            state.form.articleName = searchStr;
            let articles = await loadArticles();
            return ifNotExistsElements('checkArtikels', articles, searchStr);
        } else {
            return true;
        }
    }
}


export const createAndUpdateArticle = async (submitEvent) => {

    try {
        console.log(submitEvent)
        const form = submitEvent.target;
        console.log(form)
        let formData = new FormData(form);
        console.log('formData',formData)

        const descriptionsArr = [];
        const codeArr = [];
        const newDescriptionArr = [];
        const newCodeArr = [];
        let textareas = document.getElementsByTagName('textarea');

        for (let i = 0; i < textareas.length; i++) {
            console.log(textareas[i]);
            if (state.form.actionForm === 'create') {

                if (textareas[i].classList.contains('description')) {

                    let description = {};
                    description=createFieldObjects('containsId','description',textareas[i].value,textareas[i].dataset.elementorder,textareas[i].dataset.id);
                    descriptionsArr.push(description);
                }
                if (textareas[i].classList.contains('code')) {
                    let code = {};
                    code=createFieldObjects('containsId','code',textareas[i].value,textareas[i].dataset.elementorder,textareas[i].dataset.id);
                    codeArr.push(code);
                }

                formData.append('action', 'createArticle');
                formData.append('descriptionsArr', JSON.stringify(descriptionsArr));
                formData.append('codeArr', JSON.stringify(codeArr));
            }

            if (state.form.actionForm === 'update') {


                if (textareas[i].dataset.id !== 'noId') {
                    if (textareas[i].classList.contains('description')) {
                        let description = {};
                        description=createFieldObjects('containsId','description',textareas[i].value,textareas[i].dataset.elementorder,textareas[i].dataset.id);
                        descriptionsArr.push(description);

                    }
                    if (textareas[i].classList.contains('code')) {
                        let code = {};
                        code=createFieldObjects('containsId','code',textareas[i].value,textareas[i].dataset.elementorder,textareas[i].dataset.id);
                        codeArr.push(code);
                    }
                } else {

                    if (textareas[i].classList.contains('description')) {
                        let newDescObj = {};
                        newDescObj=createFieldObjects('noId','description',textareas[i].value,textareas[i].dataset.elementorder);
                        newDescriptionArr.push(newDescObj);
                    }
                    if (textareas[i].classList.contains('code')) {
                        let newCodeObj = {};
                        newCodeObj=createFieldObjects('noId','code',textareas[i].value,textareas[i].dataset.elementorder);
                        newCodeArr.push(newCodeObj);
                    }
                }
                formData.append('action', 'updateArticle');
                formData.append('subchapterId', state.form.subchapterId);
                formData.append('articleId', state.form.articleId);
                formData.append('articleNr', state.form.articleNr);
                formData.append('newDescObj', JSON.stringify(newDescriptionArr));
                formData.append('newCodeArr', JSON.stringify(newCodeArr));
                formData.append('descriptionsArr', JSON.stringify(descriptionsArr));
                formData.append('codeArr', JSON.stringify(codeArr));
            }
        }

        let data2 = await getJSONObj(formData);

    } catch (e) {
        errorMessage(e);
    }
}
const createFieldObjects=function(action,field,descText,elementOrder,id=null){

    const fieldObject={};
    if(action==='containsId'){
        fieldObject[field+'Id']=id;
    }
    fieldObject[field+'Text']=descText;
    fieldObject['elementOrder']=elementOrder;
    return fieldObject;
}
const cacheFormData=function(){

}

/**
 * löscht Artikel
 * @param id
 * @param action
 * @returns {Promise<void>}
 */
export const deleteArticle = async (id, action) => {
    try {
        let formData = new FormData();
        formData.append('action', 'deleteArticle')
        formData.append('id', id);
        let data = await getJSONObj(formData);
    } catch (e) {
        errorMessage(e);
    }
}

export const deleteField = async (id, field) => {
    console.log('in model')
    console.log(field)

    try {
        let formData = new FormData();
        formData.append('action', 'delete' + field)
        formData.append('id', id);
        let data = await getJSONObj(formData);
    } catch (e) {
        errorMessage(e)
;
    }
}


const errorMessage = function (e) {
    console.log(e.name);
    console.log(e.message);
    console.log(e.lineNumber);
    document.getElementById("console-error").innerHTML = e.message;
}



