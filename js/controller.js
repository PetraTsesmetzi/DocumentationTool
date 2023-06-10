import navLeft from "./views/NavLeft.js";
import navHeader from "./views/NavHeader.js";
import articleView from "./views/ArticleView.js";
import form from "./views/Form.js";
import * as model from './model.js';
import {loadSubchapter, setVariablesForForm, state, validateForm} from "./model.js";




/**
 * lädt das Formular
 * @param e
 */
export const loadForm= async function(e){
    console.log('*******************************************************************loadForm');
    console.log(e)
    let actionForm='';
    if(e.target.classList.contains('btn-insert'))  actionForm='create';
    if(e.target.classList.contains('btn-update'))   actionForm='update';
    console.log(actionForm)
    await model.setVariablesForForm(state.form.subchapterId,actionForm);
    console.log(model.state)
    form.render(model.state);
    form.addHandlerRenderSend(createArticles);
    form.addHandlerRenderArticleNumbers(loadArticleNumbers);

}

/**
 * lädt articlenummer beim klicken eines Unterkapitels
 * @param e
 * @returns {Promise<void>}
 */
export const loadArticleNumbers=async function(e){
    console.log('###############################loadArticleNumbers')
    const subchapterId=(e.target.options.selectedIndex)+1;
    console.log(subchapterId)

    await model.loadAllArticleNumbers(subchapterId);
    // console.log('actionform: '+state.form.actionForm)
    // await model.setVariablesForForm(id,state.form.actionForm);
    navLeft.setActiveClass(model.state.form.subchapterId);
    form.render(model.state);
    form.addHandlerRenderSend(createArticles);
    form.addHandlerRenderArticleNumbers(loadArticleNumbers);
    form.addHandleRenderClose(closeForm);
    // await loadForm();
}
export const closeForm=function(){
    console.log('close')
    //todo weitermachen
}

/**
 * lädt den bearbeitungsmodus
 */
const loadEditMode= async function(){
    console.log('#################### loadEditMode')
    console.log( model.state.form.subchapterId)
    console.log('editflag',model.state.editModeFlag)
    //toggled den bearbeiten button zwischen forumlar und anzeige des subchapters mit seinen artikeln
    model.state.editModeFlag=(model.state.editModeFlag === true) ? false : true;
    // if(!model.state.editModeFlag){
    //     await loadSubchapterById(model.state.form.subchapterId);
    // }
    console.log('editflag',model.state.editModeFlag)
    navHeader.renderInsert(model.state.editModeFlag)
    refreshArtikelView();
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
    if(valide){
        // let formdata=new FormData(submitEvent.target);
        await model.createArticle(submitEvent);
        await loadSubchapterById(model.state.form.subchapterId);
        await model.setVariablesForForm(model.state.form.subchapterId,'create');
    }else{
        form.activateErrorMessage();
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
    await model.setVariablesForForm(model.state.form.subchapterId,'create');
    await loadSubchapterById(model.state.form.subchapterId);


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
    await model.setVariablesForForm(id,'update');
    // await loadForm();

}


/**
 * lädt ein vollständiges subchpter mit seinen artikel bei übergebener id
 * @param id
 * @returns {Promise<void>}
 */
const loadSubchapterById=async function(element){
    console.log('loadSubchapterById')
    if(!(element instanceof Event)) element=Number(element);

    if(element instanceof Event){
        let id=window.location.hash.slice(1);
        console.log(id);
        model.state.form.subchapterId=id;
        await model.loadSubchapter(id);
    }
    if(typeof element=='number'){
        model.state.form.subchapterId=element;
        await model.loadSubchapter(element);
    }
    refreshArtikelView();
    console.log('model.state.form.subchapterId',model.state.form.subchapterId)
    await model.setVariablesForForm(model.state.form.subchapterId,'create');
    if(model.state.editModeFlag===true)await loadEditMode();


}


const refreshArtikelView=function(){
    articleView.render(model.state.subchapter,model.state.editModeFlag);
    articleView.addHandlerDeleteArt(deleteArticles);
    articleView.addHandlerUpdateArt(loadForm);
    initializePrismScript();
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
const init=  async function() {
    console.log('init')
    window.location.href = "#";
    await loadSubchapterById(1);
    navLeft.render('init');
    navHeader.render('init');

     // loadAllElementsForInputs();

    // navLeft.addHandlerRender(loadArticles);
    navLeft.addHandlerRender(loadSubchapterById);
    navHeader.addHandlerEdit(loadEditMode);
    navHeader.addHandlerInsert(loadForm);

}
  await init();

