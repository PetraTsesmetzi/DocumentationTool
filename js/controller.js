import navLeft from "./views/NavLeft.js";
import navHeader from "./views/NavHeader.js";
import articleView from "./views/ArticleView.js";
import form from "./views/Form.js";
import * as model from './model.js';
import {loadSubchapter, setVariablesForForm, state, validateForm} from "./model.js";


/**
 * Lädt das Formular für Create und Update
 * @param e
 */
export const loadForm= async function(e){
    let actionForm='';
    if(e.target.classList.contains('btn-insert'))  actionForm='create';
    if(e.target.classList.contains('btn-update'))   actionForm='update';
    await model.setVariablesForForm(actionForm,e);
    showForm();
}

/**
 * lädt im Formular die noch freien Artikelnummern beim klicken eines Unterkapitels
 * wird nichts ausgewählt wird die größte Zahl genommen
 * @param e
 * @returns {Promise<void>}
 */
export const loadArticleNumbers=async function(e){
    const subchapterId=e.target.options.selectedIndex+1;
    //todo:

    // window.location.href = "#"+subchapterId;
    // window.removeEventListener('hashchange', loadSubchapterById);
    console.log(subchapterId);

    await model.loadAllArticleNumbers(subchapterId);
    navLeft.setActiveClass(model.state.form.subchapterId);
    showForm();

}
/**
 * rendert das Formular für das Erstellen und Updaten von Artikel
 */
const showForm=function (){
    //todo:
    console.log('show form');

    form.render(model.state);
    form.addHandlerRenderSend(createAndUpdateArticles);
    form.addHandlerRenderArticleNumbers(loadArticleNumbers);
    form.addHandleRenderClose(closeForm);
   // navLeft.addHandlerRender(loadSubchapterById);


}

/**
 * schließt das Formular, wenn auf den Close Button (das X oben rechts) gedrückt wird
 * @returns {Promise<void>}
 */
export const closeForm= async function(){
    await loadSubchapterById(model.state.form.subchapterId);
}

/**
 * Der Bearbeiten Button toggelt den Bearbeitungsmodus
 */
const loadEditMode= async function(){
    //toggled den bearbeiten button zwischen forumlar und anzeige des subchapters mit seinen artikeln
    model.state.editModeFlag=(model.state.editModeFlag === true) ? false : true;
    // if(!model.state.editModeFlag){
    //     await loadSubchapterById(model.state.form.subchapterId);
    // }
    navHeader.renderInsert(model.state.editModeFlag)
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
const createAndUpdateArticles=async function(submitEvent){
    if(state.form.actionForm==='create') {
        submitEvent.preventDefault();
        let valide = await model.validateForm();
        if (valide) {
            await model.createAndUpdateArticle(submitEvent);
            await loadSubchapterById(model.state.form.subchapterId);
            await model.setVariablesForForm(model.state.form.subchapterId, 'create');
        } else {
            form.activateErrorMessage();
        }
    }else if(state.form.actionForm==='update'){
        submitEvent.preventDefault();
        let valide=await model.validateForm();
        if(valide){
            await model.createAndUpdateArticle(submitEvent);
            await loadSubchapterById(model.state.form.subchapterId);
            await model.setVariablesForForm(model.state.form.subchapterId, 'update');
        }else {
            form.activateErrorMessage();
        }
    }
}

/**
 * Initialisiert das Löschen eines Artikels
 * @param e
 * @returns {Promise<void>}
 */
const deleteArticles=async function(e){
    let id=e.target.parentElement.parentElement.dataset.articleid;
    await model.deleteArticle(id);
    await model.setVariablesForForm(model.state.form.subchapterId,'create');
    await loadSubchapterById(model.state.form.subchapterId);
}

// /**
//  * initialisiert das Updaten eines artikels
//  * @param e
//  * @returns {Promise<void>}
//  */
// const updateArticles=async function(e){
//     // console.log('##############################    updateArticles')
//     let id=e.target.parentElement.parentElement.dataset.articleid;
//     await model.updateArticle(id);
// }


/**
 * Lädt ein gewähltes Unterkapitel mit seinen Artikel
 * @param element
 * @returns {Promise<void>}
 */
const loadSubchapterById=async function(element){

    if(!(element instanceof Event)) element=Number(element);

    if(element instanceof Event){
        let id=window.location.hash.slice(1);
        model.state.form.subchapterId=id;
        await model.loadSubchapter(id);
    }
    if(typeof element=='number'){
        model.state.form.subchapterId=element;
        await model.loadSubchapter(element);
    }
    showArticleView();
    await model.setVariablesForForm(model.state.form.subchapterId,'create');
 }

const showArticleView=function(){
    articleView.render(model.state.subchapter,model.state.editModeFlag);
    articleView.addHandlerDeleteArt(deleteArticles);
    articleView.addHandlerUpdateArt(loadForm);
    initializePrismScript();
}


/**
 * Initialisiert die Libary prism
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
const init=  async function() {
    window.location.href = "#";
    await loadSubchapterById(1);
    navLeft.render('init');
    navHeader.render('init');

    navLeft.addHandlerRender(loadSubchapterById);
    navHeader.addHandlerEdit(loadEditMode);
    navHeader.addHandlerInsert(loadForm);

}
  await init();

