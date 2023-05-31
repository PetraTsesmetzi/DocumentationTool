import navLeft from "./views/NavLeft.js";
import navHeader from "./views/NavHeader.js";
import articleView from "./views/ArticleView.js";
import editMode from "./views/EditMode.js";

import * as model from './model.js';


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
    console.log(id)
    await model.loadArticle2(id);
    articleView.render(model.state.subchapter);
    initializePrismScript();
}
const loadEditMode=function(){

    editMode.render('true');
}

const deleteArticle=function(e){
    console.log('jfhdjdjdsdjkdjk')
    console.log(e)
}

const initializePrismScript=function(){
    let scriptElement = document.createElement("script");
    scriptElement.setAttribute("src", "prism/prism.js");
    scriptElement.setAttribute("type", "text/javascript");
    scriptElement.setAttribute("async", true);
    document.body.appendChild(scriptElement);
}
/**
 * eventlistener
 */
window.addEventListener('hashchange',loadArticles);
window.addEventListener('load',loadArticles);
const editBtn=document.querySelector('.btn-edit');
editBtn.addEventListener('click',loadEditMode)
const deleteButton=document.querySelector('.content-container');
console.log('jkfjjfj');
deleteButton.addEventListener('click',deleteArticle.bind(this));
