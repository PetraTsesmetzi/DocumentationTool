class EditMode {

    #parentElement;
    #parentElementInsert;

    #editmode=false;



    render(edit) {
        //flag
        this.#editmode=edit;

        //für den einfügebutton
        this.#parentElementInsert=document.querySelector('.button-container-right');
        // this.#clearInsert();
        this.#clear();
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
    //-------------Eventhandlers Bearbeiten,Einfügen, Löschen und Ändern------------------------
    addHandlerRenderEdit(handler){
        const editBtn=document.querySelector('.btn-edit');
        editBtn.addEventListener('click',handler);
    }

    addHandlerRenderLoadForm(handler){
        const insertButton=document.querySelector('.button-container-right');
        insertButton.addEventListener('click',handler.bind(this));
    }
    addHandlerRenderDeleteArt(handler){
        console.log(this.#parentElement);
        for (let i = 0; i <this.#parentElement.length; i++) {
            this.#parentElement[i].children[0].addEventListener('click',handler.bind(this));
        }
    }
    addHandlerRenderUpdateArt(handler){
        console.log(this.#parentElement);
        for (let i = 0; i <this.#parentElement.length; i++) {
            this.#parentElement[i].children[1].addEventListener('click',handler.bind(this));
        }
    }

    #clear(i=null){
        if(i!=null){
            this.#parentElement[i].innerHTML='';
        }else{
            this.#parentElementInsert.innerHTML='';
        }
    }


    #generateMarkupDelEd() {
        return ` <button class="btn ${(this.#editmode===true) ?'':'btn-hide'} btn-delete">Löschen</button>
                 <button class="btn ${(this.#editmode===true) ?'':'btn-hide'} btn-update">Ändern</button>`;

    }

    #generateMarkupInsert() {
        return `<button class="btn ${(this.#editmode===true) ?'':'btn-hide'} btn-insert">Einfügen</button>`;
    }

}
export default new EditMode();