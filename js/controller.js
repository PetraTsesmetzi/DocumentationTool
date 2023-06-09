import navLeft from "./views/NavLeft.js";
import navHeader from "./views/NavHeader.js";
import articleView from "./views/ArticleView.js";
import editMode from "./views/EditMode.js";
import form from "./views/Form.js";

import * as model from './model.js';
import {loadVariablesForForm, state, validateForm} from "./model.js";





/**
 * lädt alle elemente für input, selectfelder des formulars
 * @returns {Promise<void>}
 */
const loadAllElementsForInputs=async function(){
    console.log('###################### loadAllElementsForInputs')
    await model.loadVariablesForForm('create');
}

/**
 * lädt die gewählten artikel, je nachdem auf welchen link man in nav-lfet gedrückt hat
 * @param e
 * @returns {Promise<void>}
 */
const loadArticles = async function () {
    console.log('####################### loadArticles')
    let id=window.location.hash.slice(1);
    model.state.form.subchapterId=id;
    if(!id) {
        id = 1;
        model.state.form.subchapterId=id;
    }
    await model.loadSubchapter(id);
    articleView.render(model.state.subchapter);
    initializePrismScript();
    await model.loadVariablesForForm(model.state.form.subchapterId,'create');
    if(model.state.editModeFlag===true)loadEditMode();


}

/**
 * lädt den bearbeitungsmodus
 */
const loadEditMode=function(){
    console.log('#################### loadEditMode')

    //toggled den bearbeiten button zwischen forumlar und anzeige des subchapters mit seinen artikeln
    model.state.editModeFlag=(model.state.editModeFlag === true) ? false : true;
    if(!model.state.editModeFlag){

        loadSubchapterById(model.state.form.subchapterId);
    }


    // refreshEditMode();
    editMode.render(model.state.editModeFlag);

}
const refreshEditMode=function(){
    editMode.render(model.state.editModeFlag);
}

/**
 * lädt das Formular
 * @param e
 */
 export const loadForm= async function(e){
    console.log('############################ loadForm');
    console.log('delet event lister');
    // editMode.removeHandlerLoadForm(loadForm);
    //hier vom insert button
    console.log('stöst das rendern des form s an');
    await model.loadVariablesForForm(state.form.subchapterId,'create');
    form.render(model.state);
    form.addHandlerRenderSend(createArticles);
    form.addHandlerRenderArticleNumbers(loadArticleNumbers);
}

/**
 * initialisiert die erstellung der neuen artikels
 * @param submitEvent
 * @returns {Promise<void>}
 */
const createArticles=async function(submitEvent){
    console.log('############################## createArticles')
    submitEvent.preventDefault();
    let valide=await model.validateForm();

    if(!valide){
        form.activateErrorMessage();
    }
    if(valide){
        // let formdata=new FormData(submitEvent.target);
        await model.createArticle(submitEvent);
        await loadSubchapterById(model.state.form.subchapterId);
        await model.loadVariablesForForm(model.state.form.subchapterId,'create');
        // refreshEditMode();
        editMode.render(model.state.editModeFlag);
    }



}

/**
 * initialisiert das löschen eines artikels
 * @param e
 * @returns {Promise<void>}
 */
const deleteArticles=async function(e){
    console.log('######################## deleteArticles')
    let id=e.target.parentElement.parentElement.dataset.articleid;
    await model.deleteArticle(id);

    await model.loadVariablesForForm(model.state.form.subchapterId,'create');
    await loadSubchapterById(model.state.form.subchapterId);
    // refreshEditMode();
    editMode.render(model.state.editModeFlag);
}

/**
 * initialisiert das updaten eines artikels
 * @param e
 * @returns {Promise<void>}
 */
const updateArticles=async function(e){
    console.log('##############################    updateArticles')
    let id=e.target.parentElement.parentElement.dataset.articleid;
    await model.updateArticle(id);
    await model.loadVariablesForForm(id,'update');


    await loadForm();
}

/**
 * lädt artikel bei übergebener id????????ist das notwendig
 * @param id
 * @returns {Promise<void>}
 */
const loadSubchapterById=async function(id){

    console.log('##############      loadArticlesById')
    await model.loadSubchapter(id);

    articleView.render(model.state.subchapter);
    editMode.render(model.state.editModeFlag)
    initializePrismScript();
}

export const loadArticleNumbers=async function(e){
    console.log('#############     loadArticleNumbers')
    const id=(e.target.options.selectedIndex)+1;
    await model.loadVariablesForForm(id,'create');
    navLeft.setActiveClass(model.state.form.subchapterId);

    await loadForm();
s
}

/**
 * initialisiert die libary prism
 */
const initializePrismScript=function(){
    let scriptElement = document.createElement("script");
    scriptElement.setAttribute("src", "prism/prism.js");
    scriptElement.setAttribute("type", "text/javascript");
    scriptElement.setAttribute("async", true);
    document.body.appendChild(scriptElement);
}


/**
 * startet alles
 */
const init=  function() {
    console.log('init')

    /**
     * navigationleisten einbinden
     */
    navLeft.render('init');
    navHeader.render('init');

     loadAllElementsForInputs();

    navLeft.addHandlerRender(loadArticles);
    editMode.addHandlerRenderEdit(loadEditMode);
    editMode.addHandlerRenderLoadForm(loadForm);

}
  init();