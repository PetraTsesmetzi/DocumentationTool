import navLeft from "./views/NavLeft.js";
import navHeader from "./views/NavHeader.js";
import articleView from "./views/ArticleView.js";
import editMode from "./views/EditMode.js";
import form from "./views/Form.js";

import * as model from './model.js';
import {loadArticle, loadArticleNumbersFromSub, loadElements} from "./model.js";


let editButtons="";
let insertButton="";
let editModeFlag=false;

/**
 * navigationleisten einbinden
 */
navLeft.render();
navHeader.render();

/**
 * lädt alle elemente für input, selectfelder des formulars
 * @returns {Promise<void>}
 */
const loadAllElementsForInputs=async function(){
    await model.loadElements();
}

/**
 * lädt die gewählten artikel, je nachdem auf welchen link man in nav-lfet gedrückt hat
 * @param e
 * @returns {Promise<void>}
 */
const loadArticles = async function (e) {
    let id=window.location.hash.slice(1);
    if(!id) id=1;
    // console.log(id)
    await model.loadArticle(id);
    articleView.render(model.state.subchapter);
    initializePrismScript();
    if(editModeFlag===true)loadEditMode();
}

/**
 * lädt den bearbeitungsmodus
 */
const loadEditMode=function(){
    //toggled den bearbeiten button
    editModeFlag=(editModeFlag === true) ? false : true;
    if(!editModeFlag)loadArticles();
    editMode.render(editModeFlag);
    editMode.addHandlerRenderLoadForm(loadForm);
    editMode.addHandlerRenderDeleteArt(deleteArticles);
    editMode.addHandlerRenderUpdateArt(updateArticles);
}

/**
 * lädt das Formular
 * @param e
 */
const loadForm= function(e){

    console.log(model.state.deletedArticles)
    form.render(model.state);
    form.addHandlerRenderSend(createArticles);
}

/**
 * initialisiert die erstellung der neuen artikels
 * @param submitEvent
 * @returns {Promise<void>}
 */
const createArticles=async function(submitEvent){
    submitEvent.preventDefault();
    console.log(submitEvent.target);
    await model.createArticle(submitEvent);
}

/**
 * initialisiert das löschen eines artikels
 * @param e
 * @returns {Promise<void>}
 */
const deleteArticles=async function(e){
   // console.log(e.target.parentElement.parentElement);
    let id=e.target.parentElement.parentElement.dataset.articleid;
   await model.deleteArticle(id);
   await loadArticlesById(3);
}

/**
 * initialisiert das updaten eines artikels
 * @param e
 * @returns {Promise<void>}
 */
const updateArticles=async function(e){
    //console.log(e.target.parentElement.parentElement);
    let id=e.target.parentElement.parentElement.dataset.articleid;
    await model.updateArticle(id);
}

/**
 * lädt artikel bei übergebener id????????ist das notwendig
 * @param id
 * @returns {Promise<void>}
 */
const loadArticlesById=async function(id){
    console.log(id)
    await model.loadArticle(id);
    articleView.render(model.state.subchapter);
    initializePrismScript();
}
export const loadArticleNumbers=async function(e){
    console.log(e);
    console.log('loadArticleNumbers')
    console.log(e.target.options.selectedIndex);
    const id=(e.target.options.selectedIndex)+1;
    await model.loadArticleNumbersFromSub(id);
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
     loadAllElementsForInputs();
    navLeft.addHandlerRender(loadArticles);
    editMode.addHandlerRenderEdit(loadEditMode);

}
await init();