import navLeft from "./views/NavLeft.js";
import navHeader from "./views/NavHeader.js";
import * as model from './model.js';



navLeft.render();
navHeader.render();

const controlArticles=function(e){
    console.log(e.target.parentElement);
    const id=parseInt(e.target.parentElement.dataset.articleid);

     model.loadArticle2(id);
}

const navLeftLinks=navLeft.getParentElement();
navLeftLinks.addEventListener('click',controlArticles.bind(this));

