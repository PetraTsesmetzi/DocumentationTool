class ArticleView {

    #parentElement = document.querySelector('.content-container');
    #subchapterName;
    #subcapterArticles;

    render(data) {
        this.#subchapterName=data.subchapterName;
        this.#subcapterArticles=data.articlesArr;
        this.#clear();
        const markup=this.#generateMarkup();
        this.#parentElement.insertAdjacentHTML('afterbegin',markup);
    }

    #clear(){
        this.#parentElement.innerHTML='';
    }

    #generateMarkup() {
        let htmlObj = `<h1>${ this.#subchapterName}</h1>`;
        for (const key in this.#subcapterArticles) {

            htmlObj+=`<article>
                      <div class="article-header" data-articleid="${this.#subcapterArticles[key].id}"><h2>${this.#subcapterArticles[key]['articleName']}</h2>
                        <div class="button-container"></div></div>`;
            let articleElementArr=this.#subcapterArticles[key]['articleElementArr'];

            for (let i = 0; i <articleElementArr.length ; i++) {
                // console.log(articleElementArr.length);
                if(articleElementArr[i].hasOwnProperty('descriptionText')){

                    htmlObj+=`<p data-descriptionid="${articleElementArr[i].id}">${articleElementArr[i]['descriptionText']}</p>`;
                } if(articleElementArr[i].hasOwnProperty('codeText')){

                    htmlObj+=`<pre class="line-numbers">
                                <code data-codeid="${articleElementArr[i].id}" class="language-javascript">${articleElementArr[i]['codeText']}</code>
                              </pre>`;
                }
            }
            htmlObj +=`</article>`;

        }

        return htmlObj;
    }

}
export default new ArticleView();