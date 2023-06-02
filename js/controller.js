import navLeft from "./views/NavLeft.js";
import navHeader from "./views/NavHeader.js";
import articleView from "./views/ArticleView.js";
import editMode from "./views/EditMode.js";
import form from "./views/Form.js";


import * as model from './model.js';


let editButtons="";
let insertButton="";
let editModeFlag=false;
/**
 * navigationleisten einbinden
 */
navLeft.render();
navHeader.render();

/**
 * 
 * @param e
 * @returns {Promise<void>}
 */
const loadArticles = async function (e) {

    let id=window.location.hash.slice(1);
    if(!id) id=1;
    // console.log(id)
    await model.loadArticle2(id);
    articleView.render(model.state.subchapter);
    initializePrismScript();
}
const loadEditMode=function(){
    //toggled den bearbeiten button
    editModeFlag=(editModeFlag === true) ? false : true;
    if(!editModeFlag)loadArticles();
    editMode.render(editModeFlag);
    editMode.addHandlerRenderLoadForm(loadForm);
    editMode.addHandlerRenderDeleteArt(deleteArticles);
    editMode.addHandlerRenderUpdateArt(updateArticles);
}



const deleteArticles=async function(e){
   // console.log(e.target.parentElement.parentElement);
    let id=e.target.parentElement.parentElement.dataset.articleid;
   await model.deleteArticle(id);
}

const updateArticles=async function(e){
    //console.log(e.target.parentElement.parentElement);
    let id=e.target.parentElement.parentElement.dataset.articleid;
    await model.updateArticle(id);
}

const loadForm= function(e){
   // console.log(e.target.parentElement.parentElement);
    form.render();

}



const initializePrismScript=function(){
    let scriptElement = document.createElement("script");
    scriptElement.setAttribute("src", "prism/prism.js");
    scriptElement.setAttribute("type", "text/javascript");
    scriptElement.setAttribute("async", true);
    document.body.appendChild(scriptElement);
}






const init=function(){
    navLeft.addHandlerRender(loadArticles);
    editMode.addHandlerRenderEdit(loadEditMode);

}
init();