import navLeft from "./views/NavLeft.js";
import navHeader from "./views/NavHeader.js";
import articleView from "./views/ArticleView.js";
import form from "./views/Form.js";
import * as model from './model.js';
import {deleteField, loadSubchapter, resetState, setVariablesForForm, state, validateForm} from "./model.js";


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
    const subchapterId = e.target.options.selectedIndex + 1;
    window.location.href = "#" + subchapterId;
    window.removeEventListener('hashchange', loadSubchapterById);
    await model.loadAllArticleNumbers(subchapterId);
    navLeft.setActiveClass(model.state.form.subchapterId);


    showForm();

}
const loadFormContent=function(e){
   model.setFormDataForFocusSubChapter();
}
/**
 * rendert das Formular für das Erstellen und Updaten von Artikel
 */
const showForm = function () {
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
    //toggled den bearbeiten button zwischen forumlar und anzeige des subchapters mit seinen artikeln
    model.state.editModeFlag = (model.state.editModeFlag === true) ? false : true;
    navHeader.renderInsert(model.state.editModeFlag);
    await loadSubchapter(state.form.subchapterId);

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

const deleteFields = async function (e) {
    if (e.target.classList.contains("btn-delete")) {
        console.log(e.target)
        console.log(e.target.parentElement.parentElement.lastElementChild.className);
        let id = e.target.parentElement.parentElement.lastElementChild.dataset.id;
        let field = e.target.parentElement.parentElement.lastElementChild.className;
        field = field.charAt(0).toUpperCase() + field.slice(1);
        console.log(field)
        if (id !== 'noId') {
            model.deleteField(id, field);
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
 * startet alles
 */
const init = async function () {
    window.location.href = "#";
    await loadSubchapterById(1);
    navLeft.render('init');
    navHeader.render('init');
    navLeft.addHandlerRender(loadSubchapterById);
    navHeader.addHandlerEdit(loadEditMode);
    navHeader.addHandlerInsert(loadForm);
    navHeader.addHandlerMobileMenu(loadMobileMenu);
    articleView.addHandlerBookletOverlay(loadMobileMenu);

}
await init();

