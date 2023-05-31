class EditMode {

    #parentElement = document.querySelector('.article-header');
    #parentElement2 = document.querySelector('.button-nav-container');
    #editmode=false;


    render(edit) {
        this.#editmode=edit;
        this.#parentElement=document.querySelectorAll('.button-container');

        for (let i = 0; i <this.#parentElement.length; i++) {
            this.#clear(i);
            const markup = this.#generateMarkup();
            this.#parentElement[i].insertAdjacentHTML('beforeend', markup);

        }

    }
    #clear(i){
        this.#parentElement[i].innerHTML='';
    }

    #generateMarkup() {

        return ` <button class="btn ${(this.#editmode==="true") ?'':'btn-hide'} btn-delete">Löschen</button>
                 <button class="btn ${(this.#editmode==="true") ?'':'btn-hide'} btn-update">Ändern</button>`;

    }
}
export default new EditMode();