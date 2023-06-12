/**
 * Autorin: Petra Tsesmetzi
 * Datum: 12.06.2023
 *
 * Die Klasse ArtikelView generiert das Markup für die Artikel eines Unterkapitels
 * und hängt diese in den "content-container" ein
 *
 */

class ArticleView {

    #parentElement = document.querySelector('.content-container');
    #subchapterName;
    #subcapterArticles;
    #editmode = false;

    /**
     * initialisiert das Markup
     * data-Objekt mit subchapterName und articlesArr
     * editmode- flag ob editmode an oder aus ist
     * @param data
     * @param editmode
     */
    render(data, editmode) {
        this.#editmode = editmode;
        this.#subchapterName = data.subchapterName;
        this.#subcapterArticles = data.articlesArr;
        this.#clear();
        const markup = this.#generateMarkup();
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * löscht den Inhalt des content-container
     */
    #clear() {
        this.#parentElement.innerHTML = '';
    }

    /**
     * Eventhandler für den Delete Button an jedem Artikel
     * @param handler
     */
    addHandlerDeleteArt(handler) {
        const buttonDel = document.querySelectorAll('.btn-delete');
        for (let i = 0; i < buttonDel.length; i++) {
            buttonDel[i].addEventListener('click', handler.bind(this));
        }
    }

    /**
     * eventhandler für den Ändern Button an jedem Artikel
     * @param handler
     */
    addHandlerUpdateArt(handler) {
        const buttonUp = document.querySelectorAll('.btn-update');
        for (let i = 0; i < buttonUp.length; i++) {
            buttonUp[i].addEventListener('click', handler.bind(this));
        }
    }

    /**
     * erstellt das htmlObj als String für alle Artikel
     * @returns {string}
     */
    #generateMarkup() {
        let htmlObj = `<h1>${this.#subchapterName}</h1>`;
        for (const key in this.#subcapterArticles) {

            htmlObj += `<article>
                        <div class="article-header" data-articleid="${this.#subcapterArticles[key].id}"><h2>${this.#subcapterArticles[key]['articleName']}</h2>
                            <div class="button-container">
                            <button class="btn ${(this.#editmode === true) ? '' : 'btn-hide'} btn-delete">Löschen</button>
                            <button class="btn ${(this.#editmode === true) ? '' : 'btn-hide'} btn-update">Ändern</button>
                            </div>
                        </div>`;
            let articleElementArr = this.#subcapterArticles[key]['articleElementArr'];

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
        return htmlObj;
    }
}

export default new ArticleView();