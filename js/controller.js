import navLeft from "./views/NavLeft.js";
import navHeader from "./views/NavHeader.js";
import articleView from "./views/ArticleView.js";
import editMode from "./views/EditMode.js";
import form from "./views/Form.js";

import * as model from './model.js';
import { loadVariablesForForm, validateForm} from "./model.js";


let editButtons="";
let insertButton="";
let editModeFlag=false;


/**
 * lädt alle elemente für input, selectfelder des formulars
 * @returns {Promise<void>}
 */
const loadAllElementsForInputs=async function(){
    console.log('loadAllElementsForInputs')
    await model.loadVariablesForForm();
}

/**
 * lädt die gewählten artikel, je nachdem auf welchen link man in nav-lfet gedrückt hat
 * @param e
 * @returns {Promise<void>}
 */
const loadArticles = async function () {
    console.log('loadArticles')
    let id=window.location.hash.slice(1);
    model.state.form.subchapterId=id;
    console.log('id')
    console.log(id);
    if(!id) {
        id = 1;
        model.state.form.subchapterId=id;
    }

    await model.loadSubchapter(id);
    articleView.render(model.state.subchapter);
    initializePrismScript();
    await model.loadVariablesForForm(model.state.form.subchapterId);
    if(model.state.editModeFlag===true)loadEditMode();


}

/**
 * lädt den bearbeitungsmodus
 */
const loadEditMode=function(){
    console.log('loadEditMode')
    console.log(model.state)
    console.log(model.state.editModeFlag)
    //toggled den bearbeiten button
    model.state.editModeFlag=(model.state.editModeFlag === true) ? false : true;
    if(!model.state.editModeFlag){
        console.log(model.state.form.subchapterId)
        loadSubchapterById(model.state.form.subchapterId)
        // loadArticles();
    }
    editMode.render(model.state.editModeFlag);
    editMode.addHandlerRenderLoadForm(loadForm);
    editMode.addHandlerRenderDeleteArt(deleteArticles);
    editMode.addHandlerRenderUpdateArt(updateArticles);
    console.log(model.state)
    console.log(model.state.editModeFlag)

}
const refreshEditMode=function(){
    editMode.render(model.state.editModeFlag);
    editMode.addHandlerRenderLoadForm(loadForm);
    editMode.addHandlerRenderDeleteArt(deleteArticles);
    editMode.addHandlerRenderUpdateArt(updateArticles);
}

/**
 * lädt das Formular
 * @param e
 */
const loadForm= async function(e){
    console.log('loadForm')
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
    console.log('createArticles')
    submitEvent.preventDefault();
    let valide=await model.validateForm();
    console.log(valide)
    if(!valide){
        console.log('solnage nicht valide render the form')
        form.activateErrorMessage();
    }
    if(valide){
        let formdata=new FormData(submitEvent.target);
        await model.createArticle(submitEvent);
        console.log(model.state.form.subchapterId)
        await loadSubchapterById(model.state.form.subchapterId);
        await model.loadVariablesForForm(model.state.form.subchapterId);
        console.log(model.state)
        refreshEditMode();
    }



}

/**
 * initialisiert das löschen eines artikels
 * @param e
 * @returns {Promise<void>}
 */
const deleteArticles=async function(e){
    console.log('deleteArticles')
    let id=e.target.parentElement.parentElement.dataset.articleid;
    await model.deleteArticle(id);
    console.log(model.state.form.subchapterId);
    await model.loadVariablesForForm(model.state.form.subchapterId);
    await loadSubchapterById(model.state.form.subchapterId);
    refreshEditMode();
}

/**
 * initialisiert das updaten eines artikels
 * @param e
 * @returns {Promise<void>}
 */
const updateArticles=async function(e){
    console.log('updateArticles')
    let id=e.target.parentElement.parentElement.dataset.articleid;
    await model.updateArticle(id);
}

/**
 * lädt artikel bei übergebener id????????ist das notwendig
 * @param id
 * @returns {Promise<void>}
 */
const loadSubchapterById=async function(id){
    console.log(model.state)
    console.log('loadArticlesById')
    await model.loadSubchapter(id);

    articleView.render(model.state.subchapter);
    editMode.render(model.state.editModeFlag)
    initializePrismScript();
}

export const loadArticleNumbers=async function(e){
    console.log('loadArticleNumbers')
    const id=(e.target.options.selectedIndex)+1;
    await model.loadVariablesForForm(id);
    navLeft.setActiveClass(model.state.form.subchapterId);
    loadForm();

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
const init= function() {
    console.log('init')
    /**
     * navigationleisten einbinden
     */
    navLeft.render('init');
    navHeader.render('init');

    loadAllElementsForInputs();
    navLeft.addHandlerRender(loadArticles);
    editMode.addHandlerRenderEdit(loadEditMode);

}
await init();