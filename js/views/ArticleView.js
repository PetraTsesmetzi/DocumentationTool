/**
 * Autorin: Petra Tsesmetzi
 * Datum: 12.06.2023
 *
 * Die Klasse ArtikelView generiert das Markup für die Artikel eines Unterkapitels
 * und hängt diese in den "content-container" ein
 *
 */

class ArticleView {

    #contentContainer = document.querySelector('.content-container');
    #bookletOverlay = document.querySelector('.booklet-overlay');
    #subchapterName;
    #subcapterArticles;
    #editmode = false;
    #chapterByCategorieName;
    #subchapterByChapterName;

    /**
     * initialisiert das Markup
     * data-Objekt mit subchapterName und articlesArr
     * editmode- flag ob editmode an oder aus ist
     * @param data
     * @param editmode
     */
    render(data, editmode) {
        // console.log('data',data)
        this.#editmode = editmode;
        this.#subchapterName = data.subchapterName;
        this.#subcapterArticles = data.articles;

        this.#chapterByCategorieName=data.chapterByCategorieName;
        this.#subchapterByChapterName=data.subchapterByChapterName;
        this.#clear();
        const markup = this.#generateMarkup();
        this.#contentContainer.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * löscht den Inhalt des content-container
     */
    #clear() {
        this.#contentContainer.innerHTML = '';
    }

    /**
     * Eventhandler für den Delete Button an jedem Artikel
     * @param deleteArticles
     */
    addHandlerDeleteArt(deleteArticles) {
        const buttonDel = document.querySelectorAll('.btn-delete');
        for (let i = 0; i < buttonDel.length; i++) {
            buttonDel[i].addEventListener('click', deleteArticles.bind(this));
        }
    }

    /**
     * eventhandler für den Ändern Button an jedem Artikel
     * @param loadForm
     */
    addHandlerUpdateArt(loadForm) {
        const buttonUp = document.querySelectorAll('.btn-update');
        for (let i = 0; i < buttonUp.length; i++) {
            buttonUp[i].addEventListener('click', loadForm.bind(this));
        }
    }
    addHandlerBookletOverlay(loadMobileMenu){
         this.#bookletOverlay.addEventListener('click',loadMobileMenu.bind(this));
    }

    /**
     * erstellt das htmlObj als String für alle Artikel
     * @returns {string}
     */
    #generateMarkup() {
        let htmlObj=''
        if((this.#chapterByCategorieName.length>0 || this.#subchapterByChapterName.length>0)){
         htmlObj += `<h1>${this.#subchapterName!==undefined ?this.#subchapterName:''}</h1>`;

        for (const key in this.#subcapterArticles) {

            htmlObj += `<article>
                        <div class="article-header" data-articleid="${this.#subcapterArticles[key].id}"><h2>${this.#subcapterArticles[key]['articleName']}</h2>
                            <div class="button-container">
                            <button class="btn ${(this.#editmode === true) ? '' : 'btn-hide'} btn-delete">Löschen</button>
                            <button class="btn ${(this.#editmode === true) ? '' : 'btn-hide'} btn-update">Ändern</button>
                            </div>
                        </div>`;
            let articleElementArr = this.#subcapterArticles[key]['articleElementArr'];
            // console.log('articleElementArr',articleElementArr)
            // console.log('articleElementArr.length',articleElementArr.length)
            for (let i = 0; i < articleElementArr.length; i++) {

                if (articleElementArr[i].hasOwnProperty('descriptionText')) {

                    htmlObj += `<p data-descriptionid="${articleElementArr[i].id}">${articleElementArr[i]['descriptionText']}</p>`;
                }
                if (articleElementArr[i].hasOwnProperty('codeText')) {

                    htmlObj += `<pre class="line-numbers">
                               
                    <code data-codeid="${articleElementArr[i].id}" class="language-javascript">${articleElementArr[i]['codeText']}</code>
                           
                    </pre>`;
                }
            }
            htmlObj += `</article>`;
        }
        }else{
            htmlObj += `<h1>Keine Artikel vorhanden</h1>`;
        }
        return htmlObj;
    }

    displayContentAll() {
        this.#bookletOverlay.classList.toggle('showBlock');
    }

}

export default new ArticleView();