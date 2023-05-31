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
                      <div class="subtitel"><h2>${this.#subcapterArticles[key]['articleName']}</h2></div>`;
            let articleElementArr=this.#subcapterArticles[key]['articleElementArr'];

            for (let i = 0; i <articleElementArr.length ; i++) {
                // console.log(articleElementArr.length);
                if(articleElementArr[i].hasOwnProperty('descriptionText')){

                    htmlObj+=`<p>${articleElementArr[i]['descriptionText']}</p>`;
                } if(articleElementArr[i].hasOwnProperty('codeText')){

                    htmlObj+=`<pre class="line-numbers">
                                <code class="language-javascript">${articleElementArr[i]['codeText']}</code>
                              </pre>`;
                }
            }
            htmlObj +=`</article>`;

        }

        return htmlObj;
    }

}
export default new ArticleView();