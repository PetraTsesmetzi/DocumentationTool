import navLeft from "./views/NavLeft.js";
import navHeader from "./views/NavHeader.js";
import articleView from "./views/ArticleView.js";
import * as model from './model.js';
import {state} from "./model.js";


navLeft.render();
navHeader.render();

const controlArticles = async function (e) {


    // const id = parseInt(e.target.parentElement.dataset.articleid);
    // await model.loadArticle2(id);
    const id=window.location.hash.slice(1);
    if(!id) return;
    console.log(id)
    await model.loadArticle2(id);
    articleView.render(model.state.subchapter);
    initializePrismScript();
}

// const navLeftLinks = navLeft.getParentElement();
// navLeftLinks.addEventListener('click', controlArticles.bind(this));

const initializePrismScript=function(){
    let scriptElement = document.createElement("script");
    scriptElement.setAttribute("src", "prism/prism.js");
    scriptElement.setAttribute("type", "text/javascript");
    scriptElement.setAttribute("async", true);
    document.body.appendChild(scriptElement);
}

window.addEventListener('hashchange',controlArticles);
window.addEventListener('load',controlArticles);