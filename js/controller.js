import navLeft from "./views/NavLeft.js";
import navHeader from "./views/NavHeader.js";
import articleView from "./views/ArticleView.js";
import form from "./views/Form.js";
import * as model from './model.js';
import {
    createSubchapter,
    deleteField,
    findChapterBySubchapter,
    initChapterSubchapterArr,
    loadAllCategories,
    loadAllChapters,
    loadChaptersByCategory,
    loadSubchapter,
    loadSubchapters,
    loadSubChaptersByChapter,
    resetState,
    setVariablesForForm,
    state, updateSubChapter,
    validateForm
} from "./model.js";


/**
 * Lädt das Formular für Create und Update
 * @param e
 */
export const loadForm = async function (e) {
    let actionForm = '';
    if (e.target.classList.contains('btn-insert')) actionForm = 'create';
    if (e.target.classList.contains('btn-update')) actionForm = 'update';
    await model.setVariablesForForm(actionForm, e);
    showForm();
}

/**
 * lädt im Formular die noch freien Artikelnummern beim klicken eines Unterkapitels
 * wird nichts ausgewählt wird die größte Zahl genommen
 * @param e
 * @returns {Promise<void>}
 */
export const loadArticleNumbers = async function (e) {
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++loadArticleNumbers',e)

    const subchapterId =e.target.options[e.target.options.selectedIndex].id;
    model.setFormDataForFocusSubChapter(e);
    // model.state.form.subchapterId=subchapterId;
    // model.state.form.subchapterName=e.target.options[e.target.options.selectedIndex].innerText;

    window.location.href = "#" + subchapterId;
    window.removeEventListener('hashchange', loadSubchapterById);
    await model.loadAllArticleNumbers(subchapterId);
    navLeft.setActiveClass(model.state.form.subchapterId);
    showForm();

}
const loadFormContent=function(e){

    model.setFormDataForFocusSubChapter();
}
const loadFormContentByChapter=async function(chapterName){
    if(model.state.editModeFlag===true){
        await model.loadSubChaptersByChapter(chapterName);
        showForm();
    }
}


/**
 * rendert das Formular für das Erstellen und Updaten von Artikel
 */
const showForm = function () {
    console.log('showform',model.state.form.subchapterName)
    form.render(model.state);

    form.addHandlerRenderSend(createAndUpdateArticles);
    form.addHandlerRenderArticleNumbers(loadArticleNumbers);
    form.addHandlerRenderChangeSubChapter(loadFormContent);
    form.addHandleRenderClose(closeForm);
    form.deleteHandleRenderFields(deleteFields);
    navLeft.addHandlerRender(loadSubchapterById);
}

/**
 * schließt das Formular, wenn auf den Close Button (das X oben rechts) gedrückt wird
 * @returns {Promise<void>}
 */
export const closeForm = async function () {
    await loadSubchapterById(model.state.form.subchapterId);
}

/**
 * Der Bearbeiten Button toggelt den Bearbeitungsmodus
 */
const loadEditMode = async function () {
    //toggled den bearbeiten button zwischen forumlar und anzeige des subchapters mit seinen artikelnlog
    console.log('laodEditMode');
    model.state.editModeFlag = (model.state.editModeFlag === true) ? false : true;
    console.log('editModeFlag',model.state.editModeFlag)
    navHeader.renderInsert(model.state.editModeFlag);
    navLeft.renderEditMode(model.state.editModeFlag);
    await loadSubchapter(state.form.subchapterId);
    //Todo:nicht wegmachen:ausschalten der kategorielinks im editmode
    // if(model.state.editModeFlag===true)
    // {
    //     navHeader.removeEventListenerFromLinks(loadChapterByCategory)
    // }else{
    //      navHeader.addHandlerRenderLoadSubchapter(loadChapterByCategory)
    //     navHeader.setEventListerForActiveClass();
    // }


    // model.state.editModeFlag ? navLeft.removeHandlerRender(loadSubchapterById):navLeft.addHandlerRender(loadSubchapterById);
    showArticleView();
}


/**
 * Intialsiert das Erstellen und Ändern eines Artikel Eintrages
 * Wird über den Submit Button des Formulars aufgerufen.
 * Gilt für beide Modi Einfügen, Ändern
 *
 * @param submitEvent
 * @returns {Promise<void>}
 */
const createAndUpdateArticles = async function (submitEvent) {
    console.log('createAndUpdateArticles')
    console.log('state.form.actionForm',state.form.actionForm)
    if(state.form.actionForm === 'focus')state.form.actionForm='create';
    submitEvent.preventDefault();
    let valide = await model.validateForm();
    if (valide) {
        await model.createAndUpdateArticle(submitEvent);
        await loadSubchapterById(model.state.form.subchapterId);

        if (state.form.actionForm === 'update') {
            await model.setVariablesForForm(model.state.form.subchapterId, 'update');
        } else if (state.form.actionForm === 'create' ) {
            await model.setVariablesForForm(model.state.form.subchapterId, 'create');
            console.log('vor reset')
             model.resetState();
        }
    } else {
        form.activateErrorMessage();
    }
}

/**
 * Initialisiert das Löschen eines Artikels
 * @param e
 * @returns {Promise<void>}
 */
const deleteArticles = async function (e) {
    let id = e.target.parentElement.parentElement.dataset.articleid;
    await model.deleteArticle(id, 'deleteArticle');
    await model.setVariablesForForm(model.state.form.subchapterId, 'create');
    await loadSubchapterById(model.state.form.subchapterId);
}

/**
 * löscht die im fromular hinzugefügeten felder
 * @param e
 * @returns {Promise<void>}
 */
const deleteFields = async function (e) {
    if (e.target.classList.contains("btn-delete")) {
        console.log(e.target)
        console.log(e.target.parentElement.parentElement.lastElementChild.className);
        let id = e.target.parentElement.parentElement.lastElementChild.dataset.id;
        let field = e.target.parentElement.parentElement.lastElementChild.className;
        field = field.charAt(0).toUpperCase() + field.slice(1);
        console.log(field)
        if (id !== 'noId') {
           await model.deleteField(id, field);
        }
    }
}
/**
 * Lädt ein gewähltes Unterkapitel mit seinen Artikel
 * @param element
 * @returns {Promise<void>}
 */
const loadSubchapterById = async function (element) {
    if (!(element instanceof Event)) element = Number(element);

    // Unterscheidung ob ich die url auslese oder ob ich aus dem Formular
    // beim anklicken eines Unterkapitels die Id übertrage
    if (element instanceof Event) {
        let id = window.location.hash.slice(1);
        model.state.form.subchapterId = id;
        await model.loadSubchapter(id);
    }
    if (typeof element === 'number') {
        model.state.form.subchapterId = element;
        await model.loadSubchapter(element);
    }

    await model.setVariablesForForm(model.state.form.subchapterId, 'create');
    showArticleView();
}

const loadCategory=async function(){
    await model.loadAllCategories();

}

const showArticleView = function () {

    articleView.render(model.state.form, model.state.editModeFlag);
    articleView.addHandlerDeleteArt(deleteArticles);
    articleView.addHandlerUpdateArt(loadForm);
    initializePrismScript();
}

const loadMobileMenu = function (e) {
    console.log(e.target)



        if (e.target.dataset.switch == "off") {
            e.target.dataset.switch = "on";
            navLeft.display(e);
            articleView.displayContentAll();
        } else {
            e.target.dataset.switch = "off";
            navLeft.display(e);
            articleView.displayContentAll();
        }

}

/**
 * Initialisiert die Libary prism2
 */
const initializePrismScript = function () {

    let prismScript = document.querySelector('.prismScript');
    if (prismScript != null) {
        let body = document.getElementsByTagName('body');
        let prismScript = document.querySelector('.prismScript');
        body[0].removeChild(prismScript);
    }

    let scriptElement = document.createElement("script");
    scriptElement.setAttribute('class', 'prismScript');
    scriptElement.setAttribute("src", "prism/prism.js");
    scriptElement.setAttribute("type", "text/javascript");
    scriptElement.setAttribute("async", true);
    document.body.appendChild(scriptElement);
}

/**
 * erzeugt ein subchapter anhand des ausgewählten Kapitels
 * @param submitEvent
 * @returns {Promise<void>}
 */
export const createAndEditSubchapter=async function(submitEvent,btn){
    console.log('hehehehehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',btn)
    console.log('submitEvent',submitEvent.target)
    console.log('submitEvent',submitEvent.target.querySelector('#create-subchapter-id').value);
    console.log('submitEvent',submitEvent.target.querySelector('#chapterEdit-id').innerText);
    console.log('button',submitEvent.target.querySelector('.btn-action').innerText);

    let subChapterName=submitEvent.target.querySelector('#create-subchapter-id').value;
    console.log('subChapterName');
    let chapterName=submitEvent.target.querySelector('#chapterEdit-id').innerText;
    let btnAction=submitEvent.target.querySelector('.btn-action').innerText;
    if(btn==='Erstellen'){
        await model.createSubchapter(chapterName,subChapterName);
        await refreshSubChapterList(chapterName,'refresh');
    }else if(btn==='Aktualisieren'){
        console.log('do the update now',)
        let updateId=model.state.form.updateSubchapterId
        await model.updateSubChapter(updateId,subChapterName);
        await refreshSubChapterList(chapterName,'refresh');

    } else if(btn==='Zurück zum Erstellen'){
        console.log('zurück zum erstellen')
        await refreshSubChapterList(chapterName,'refresh');
    }
}

/**
 * löscht ein einzelnes Subchapter oder edetiert
 * sucht in der db nach dem zu actualsierenden eintrag und holt den Namen des dazugehörigen Kapitels
 *
 * @param event
 * @returns {Promise<void>}
 */
export const deleteAndEditSubchapters=async function(event){

    if(event.target.classList.contains('trash')){

        console.log('delete this element',event.target.dataset.trash_id)
        await model.deleteSubChapter(event.target.dataset.trash_id);
        await refreshSubChapterList('','refresh');
    }else if(event.target.classList.contains('update')){
        console.log('do the update on',event.target.dataset)
        model.state.form.updateSubchapterId=event.target.dataset.update_id;
        console.log('updateid',event.target.dataset.update_id)
        const subChapterName=event.target.parentElement.previousSibling.firstChild.firstChild.textContent;
        console.log('such nach diesem text',subChapterName)
        let toUpdateChapterName=await findChapterBySubchapter(subChapterName);
        console.log(toUpdateChapterName)
        await refreshSubChapterList('','updateMode',subChapterName,toUpdateChapterName);

    }
}

/**
 * aktualsiert die subchapterListe
 * @param chapterName
 * @param modi
 * @returns {Promise<void>}
 */
const refreshSubChapterList=async function(chapterName,modi=null,subChapterName=null,toUpdateChapterName=null){
    console.log('chapterName',chapterName)
    let allCategories = await model.loadAllCategories();
    let allSubchapters=await model.loadSubchapters();
    let allChapters = await model.loadAllChapters();
    await navLeft.loadAllObjectsForEditMode(allCategories, allChapters, allSubchapters);
    await navLeft.loadAllChaptersForEditMode(chapterName,modi,subChapterName,toUpdateChapterName);
    navLeft.addHandlerNewSubchapter(createAndEditSubchapter);
    navLeft.addHandlerEditForSubchapter(deleteAndEditSubchapters);
}

export const loadSubchaptersForNav= async function(chapterName){
    return await model.loadSubChaptersByChapter(chapterName);
}

export const loadChapterForNav= async function(categoryName){
    return await model.loadChaptersByCategory(categoryName);
}
export const laodAllCategoriesForNav=async  function(){
    return await model.loadAllCategories();
}
export const laodAllChaptersForNav=async function(){
    return await model.loadAllChapters();
}
export const laodAllSubChaptersForNav=async function(){

    return await model.loadSubchapters();
}

/**
 * wird vom nav-header aufgerufen
 * @param e
 * @returns {Promise<void>}
 */
export const loadChapterByCategory=async function(e){
    await model.loadChaptersByCategory(e.target.dataset.categoryname);
    if(model.state.form.chapterByCategorieName.length===0)showArticleView();
    await navLeft.renderChapterDropDown(model.state.form.chapterByCategorieName);
}


/**
 * initialisiert alles
 * @returns {Promise<void>}
 */
const init = async function () {
    window.location.href = "#";

    await initChapterSubchapterArr();
    await loadSubchapterById(1);

    const chapters=await model.loadChaptersByCategory('Javascript');
    await navLeft.render('init',chapters,model.state.editModeFlag);

    await loadCategory();

    navHeader.render('init',state.form.categoryNames);
    navHeader.addHandlerRenderLoadSubchapter(loadChapterByCategory);

    navLeft.addHandlerRenderChangeChapter(loadFormContentByChapter);
    navLeft.addHandlerRender(loadSubchapterById);

    let allCategories = await model.loadAllCategories();
    let allSubchapters=await model.loadSubchapters();
    let allChapters = await model.loadAllChapters();
    await navLeft.loadAllObjectsForEditMode(allCategories, allChapters, allSubchapters)
    await navLeft.loadAllChaptersForEditMode();

    navLeft.addHandlerRenderChangeSubChapter();
    navLeft.addHandlerNewSubchapter(createAndEditSubchapter);
    navLeft.addHandlerEditForSubchapter(deleteAndEditSubchapters);
    navHeader.addHandlerEdit(loadEditMode);
    navHeader.addHandlerInsert(loadForm);
    navHeader.addHandlerMobileMenu(loadMobileMenu);

    articleView.addHandlerBookletOverlay(loadMobileMenu);
    window.addEventListener("dblclick", (event) => {
        console.log('keeee')
        console.log(window.getSelection().toString())
        console.log(window.getSelection())

    });
}
await init();

