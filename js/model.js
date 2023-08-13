import {findFreeArticleNumbers, getJSONObj, ifNotExistsElements, sortArrayOfObjects} from './helper.js';


export const state = {
    editModeFlag: 'false',
    form: {
        actionForm: '',
        articleId: '',
        articleNr: '',
        articleName: '',
        subchapters: [],
        subchapterByChapterName:[],
        chapterByCategorieName:[],
        freeArticleNumbers: [],
        articles: [],
        articleElementArr: [],
        articlesArr: [],
        subchapterId: 1,
        descriptionArr: [],
        codeArr: [],
        chapterId:'',
        chapterName:'',
        noData:false
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
 * lädt alle Subchapters anhand des Chapternames
 * @param chapterName
 * @returns {Promise<*[]>}
 */
export const loadSubChaptersByChapter = async (chapterName) => {

    const subchapterByChapterName = [];
    let formData = new FormData();
    formData.append('action', 'loadSubChapterByChapter');
    formData.append('chapterName', chapterName);
    let data = await getJSONObj(formData);
    data.map(subchapter=> {
        subchapterByChapterName.push(JSON.parse(subchapter))

    })

    state.form.subchapterByChapterName=subchapterByChapterName;
    state.form.subchapterId= state.form.subchapterByChapterName[0].id;
    state.form.subchapterName= state.form.subchapterByChapterName[0].subchapterName;
    return subchapterByChapterName;
}
/**
 * lädt alle chapters anhand des categorynames
 * @param categoryName
 * @returns {Promise<*[]>}
 */
export const loadChaptersByCategory = async (categoryName) => {

    const chapterByCategorieName = [];
    let formData = new FormData();
    formData.append('action', 'loadChapterByCategory');
    formData.append('categoryName', categoryName);
    let data = await getJSONObj(formData);
    data.map(chapter=> {
        chapterByCategorieName.push(JSON.parse(chapter))

    })

    state.form.chapterByCategorieName=chapterByCategorieName;
    if(chapterByCategorieName.length>0){
        state.form.chapterId= state.form.chapterByCategorieName[0].id;
        state.form.chapterName= state.form.chapterByCategorieName[0].chapterName;
    }
    if(chapterByCategorieName.length===0)
        state.form.subchapterByChapterName=[];


    return chapterByCategorieName;
}
/**
 * intialsiert die erste Seite
 * @returns {Promise<void>}
 */
export const initChapterSubchapterArr=async ()=>{
    await loadChaptersByCategory('Javascript');
    // await loadSubChaptersByChapter('Javascript Fundamentals Part 1');
}
/**
 * lädt alle categories
 * @returns {Promise<*[]>}
 */
export const loadAllCategories=async()=>{
    const categoryNames = [];
    let formData = new FormData();
    formData.append('action', 'loadCategory');
    let data = await getJSONObj(formData);
    data.map(chapter=> {
        categoryNames.push(JSON.parse(chapter))

    })
    state.form.categoryNames=categoryNames;
    // state.form.categoryId= state.form.categoryNames[0].id;
    return categoryNames;
}
/**
 * lädt alle subchapter
 * @returns {Promise<*[]>}
 */
export const loadAllChapters=async()=>{
    const chapterNames = [];
    let formData = new FormData();
    formData.append('action', 'loadChapters');
    let data = await getJSONObj(formData);
    data.map(chapter=> {
        chapterNames.push(JSON.parse(chapter))

    })
    state.form.chapterNames=chapterNames;
    // state.form.categoryId= state.form.categoryNames[0].id;
    return chapterNames;
}
/**
 * gibt den chapternamen be gegebenen subchapternamen zurück
 * @param subChapterName
 * @returns {Promise<any>}
 */
export const findChapterBySubchapter=async(subChapterName)=>{
    state.form.oldSubchapterName=subChapterName;
    let formData = new FormData();
    formData.append('action', 'findChapterBySubchapter');
    formData.append('subChapterName', subChapterName);
    let chapterName = await getJSONObj(formData);
    return JSON.parse(chapterName);
}

export const findCategoryByChapter=async(chapterName)=>{
    state.form.oldChapterName=chapterName;
    let formData = new FormData();
    formData.append('action', 'findCategoryByChapter');
    formData.append('chapterName', chapterName);
    let categoryName = await getJSONObj(formData);

    return JSON.parse(categoryName);
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
        // if (data.length === 0) {await loadSubchapter(id+1); return}
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
        // }
        // state.form.noData=true;

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
            resetState();
            state.form.subchapters = await loadSubchapters();
            await loadAllArticleNumbers(state.form.subchapterId);

        } else if (actionForm === 'update' && event) {
            let articleId = event.target.parentElement.parentElement.dataset.articleid;
            let article = await loadArticleById(articleId);
            state.form.actionForm = 'update';
            state.form.articleId = articleId;
            state.form.articleName = article.articleName;
            state.form.articleNr = article.articleNumber;
            state.form.descriptionArr = article.descriptionArr;
            state.form.codeArr = article.codeArr;
            state.form.articleElementArr = [...article.descriptionArr, ...article.codeArr];
            state.form.articleElementArr = state.form.articleElementArr.map(element => JSON.parse(element));
            state.form.articleElementArr = sortArrayOfObjects(state.form.articleElementArr, 'elementOrder');
            state.form.subchapters = await loadSubchapters();
            state.form.subchapterId = state.form.subchapterId;

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
export const createSubchapter=async (chapterName,subChapterName)=>{

    let formDataArr = new FormData();
    formDataArr.append('action', 'createSubChapter');
    formDataArr.append('chapterName', chapterName);
    formDataArr.append('subChapterName', subChapterName);
    let data = await getJSONObj(formDataArr);

}
export const createChapter=async (categoryName,chapterName)=>{

    let formDataArr = new FormData();
    formDataArr.append('action', 'createChapter');
    formDataArr.append('categoryName', categoryName);
    formDataArr.append('chapterName', chapterName);
    let data = await getJSONObj(formDataArr);

}

export const createAndUpdateArticle = async (submitEvent) => {

    try {

        const form = submitEvent.target;

        let formData = new FormData(form);


        const descriptionsArr = [];
        const codeArr = [];
        const newDescriptionArr = [];
        const newCodeArr = [];
        let textareas = document.getElementsByTagName('textarea');

        for (let i = 0; i < textareas.length; i++) {

            if (state.form.actionForm === 'create') {

                if (textareas[i].classList.contains('description')) {

                    let description = {};
                    description = createFieldObjects('containsId', 'description', textareas[i].value, textareas[i].dataset.elementorder, textareas[i].dataset.id);
                    descriptionsArr.push(description);
                }
                if (textareas[i].classList.contains('code')) {
                    let code = {};
                    code = createFieldObjects('containsId', 'code', textareas[i].value, textareas[i].dataset.elementorder, textareas[i].dataset.id);
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
                        description = createFieldObjects('containsId', 'description', textareas[i].value, textareas[i].dataset.elementorder, textareas[i].dataset.id);
                        descriptionsArr.push(description);

                    }
                    if (textareas[i].classList.contains('code')) {
                        let code = {};
                        code = createFieldObjects('containsId', 'code', textareas[i].value, textareas[i].dataset.elementorder, textareas[i].dataset.id);
                        codeArr.push(code);
                    }
                } else {

                    if (textareas[i].classList.contains('description')) {
                        let newDescObj = {};
                        newDescObj = createFieldObjects('noId', 'description', textareas[i].value, textareas[i].dataset.elementorder);
                        newDescriptionArr.push(newDescObj);
                    }
                    if (textareas[i].classList.contains('code')) {
                        let newCodeObj = {};
                        newCodeObj = createFieldObjects('noId', 'code', textareas[i].value, textareas[i].dataset.elementorder);
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
const createFieldObjects = function (action, field, descText, elementOrder, id = null) {

    const fieldObject = {};
    if (action === 'containsId') {
        fieldObject[field + 'Id'] = id;
    }
    fieldObject[field + 'Text'] = descText;
    fieldObject['elementOrder'] = elementOrder;
    return fieldObject;
}
const cacheFormData = function () {

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
export const deleteSubChapter=async(id)=>{
    try{
        let formData=new FormData();
        formData.append('action','deleteSubChapter');
        formData.append('id',id);
        let data=await getJSONObj(formData);
    }catch(e){
        errorMessage(e);
    }
}
export const deleteChapter=async(id)=>{
    try{
        let formData=new FormData();
        formData.append('action','deleteChapter');
        formData.append('id',id);
        let data=await getJSONObj(formData);
    }catch(e){
        errorMessage(e);
    }
}
/**
 * aktualsiert subchapter
 * @param updateSubchapterId
 * @param subChapterName
 * @returns {Promise<void>}
 */
export const updateSubChapter=async(updateSubchapterId,subChapterName)=>{
    try{

        let formData=new FormData();
        formData.append('action','updateSubChapter');
        formData.append('updateSubchapterId',updateSubchapterId);
        formData.append('subChapterName',subChapterName);
        let data=await getJSONObj(formData);

    }catch(e){
        errorMessage(e);
    }
}

export const updateChapter=async(updateChapterId,chapterName)=>{
    try{

        let formData=new FormData();
        formData.append('action','updateChapter');
        formData.append('updateChapterId',updateChapterId);
        formData.append('chapterName',chapterName);
        let data=await getJSONObj(formData);

    }catch(e){
        errorMessage(e);
    }
}



export const deleteField = async (id, field) => {

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
export const setFormDataForFocusSubChapter = function (e=null) {

    const articleName = document.querySelector('#articleTitel');
    const descriptionArr = document.querySelectorAll('.description');
    const descArr = [...descriptionArr].map((desc) => {
        return {
            "data-id": desc.dataset.id,
            "descriptionText": desc.value,
            "article_Id": '',
            "elementOrder": desc.dataset.elementorder

        }
    });
    const codeArray = document.querySelectorAll('.code');
    const codeArr = [...codeArray].map((code) => {
        return {
            "data-id": code.dataset.id,
            "codeText": code.value,
            "article_Id": '',
            "elementOrder": code.dataset.elementorder
        }
    });


    state.form.actionForm = 'focus';
    state.form.articleName = articleName.value;
    state.form.articleElementArr = sortArrayOfObjects([...descArr, ...codeArr], 'elementOrder');
    state.form.descriptionArr = descArr;
    state.form.codeArr = codeArr;
    if(e) {
        let subchapterId =e.target.options[e.target.options.selectedIndex].id;
        state.form.subchapterId=subchapterId;
        state.form.subchapterName=e.target.options[e.target.options.selectedIndex].innerText;
    }

}

const errorMessage = function (e) {
    console.log(e.name);
    console.log(e.message);
    console.log(e.lineNumber);
    document.getElementById("console-error").innerHTML = e.message;
}

/**
 * setzt das state obj zurück
 *
 */
export const resetState = function () {
    state.form.articleId = '';
    state.form.articleNr = '';
    state.form.articleName = '';
    state.form.freeArticleNumbers = [];
    state.form.articles = [];
    state.form.articleElementArr = [];
    state.form.articlesArr = [];
    state.form.descriptionArr = [];
    state.form.codeArr = [];


}


