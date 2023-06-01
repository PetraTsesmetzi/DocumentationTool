class EditMode {

    #parentElement;
    #parentElementInsert=document.querySelector('.button-container-right');
    #editmode=false;


    render(edit) {

        this.#editmode=edit;
        this.#clearInsert();
        //für den einfügebutton
        const markupInsert= this.#generateMarkupInsert();
        this.#parentElementInsert.insertAdjacentHTML('beforeend', markupInsert);

        //für löschen und ändern buttons
        this.#parentElement=document.querySelectorAll('.button-container');
        for (let i = 0; i <this.#parentElement.length; i++) {
            this.#clear(i);
            const markup = this.#generateMarkupDelEd();
            this.#parentElement[i].insertAdjacentHTML('beforeend', markup);
        }

    }
    #clear(i){
        this.#parentElement[i].innerHTML='';
    }
    #clearInsert(){
        this.#parentElementInsert.innerHTML='';
    }

    #generateMarkupDelEd() {
        console.log(this.#editmode)
        return ` <button class="btn ${(this.#editmode===true) ?'':'btn-hide'} btn-delete">Löschen</button>
                 <button class="btn ${(this.#editmode===true) ?'':'btn-hide'} btn-update">Ändern</button>`;

    }

    #generateMarkupInsert() {
        console.log(this.#editmode)
        return `<button class="btn ${(this.#editmode===true) ?'':'btn-hide'} btn-insert">Einfügen</button>`;

    }

    get parentElement() {
        return this.#parentElement;
    }
    get parentElementInsert() {
        return this.#parentElementInsert;
    }
}
export default new EditMode();