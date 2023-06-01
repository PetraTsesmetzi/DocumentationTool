import navLeft from "./views/NavLeft.js";
import navHeader from "./views/NavHeader.js";
import articleView from "./views/ArticleView.js";
import editMode from "./views/EditMode.js";

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
    //toggle the editbutton
    editModeFlag=(editModeFlag === true) ? false : true;

    editMode.render(editModeFlag);
    editButtons=editMode.parentElement;

    for (let i = 0; i <editButtons.length; i++) {
        //console.log(editButtons[i].children[0]);
        editButtons[i].children[0].addEventListener('click',deleteArticles.bind(this));
        editButtons[i].children[1].addEventListener('click',editArticles.bind(this));
    }
    console.log(editMode.parentElementInsert);
    insertButton=editMode.parentElementInsert;
    insertButton.addEventListener('click',loadForm.bind(this));
}



const deleteArticles=async function(e){
    console.log(e.target.parentElement.parentElement);
    let id=e.target.parentElement.parentElement.dataset.articleid;
    model.deleteArticle(id);
}

const editArticles=async function(e){
    console.log(e.target.parentElement.parentElement);
    let id=e.target.parentElement.parentElement.dataset.articleid;
    model.editArticle(id);
}

const loadForm= function(e){
    console.log(e.target.parentElement.parentElement);


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
// const deleteButton=document.querySelector('.content-container');
// console.log('jkfjjfj');
// deleteButton.addEventListener('click',deleteArticle.bind(this));
