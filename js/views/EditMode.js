class EditMode {

    #parentElement;
    #parentElementInsert;

    #editmode=false;


    /**
     * initialisiert das markup(hängt die htmlObjekte in die Container)
     * @param edit
     */
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
    /**
     * eventhandler für den bearbeiten button
     * @param handler
     */
    addHandlerRenderEdit(handler){
        const editBtn=document.querySelector('.btn-edit');
        editBtn.addEventListener('click',handler);
    }

    /**
     * evetnhandler für den einfüge button
     * @param handler
     */
    addHandlerRenderLoadForm(handler){
        const insertButton=document.querySelector('.button-container-right');
        insertButton.addEventListener('click',handler.bind(this));
    }

    /**
     * eventhandler für löschen button an jedem artikel
     * @param handler
     */
    addHandlerRenderDeleteArt(handler){

        for (let i = 0; i <this.#parentElement.length; i++) {
            this.#parentElement[i].children[0].addEventListener('click',handler.bind(this));
        }
    }

    /**
     * eventhandler für ändern button an jedem artikel
     * @param handler
     */
    addHandlerRenderUpdateArt(handler){

        for (let i = 0; i <this.#parentElement.length; i++) {
            this.#parentElement[i].children[1].addEventListener('click',handler.bind(this));
        }
    }

    /**
     * löscht den Inhalt aus den containern
     * @param i
     */
    #clear(i=null){
        if(i!=null){
            this.#parentElement[i].innerHTML='';
        }else{
            this.#parentElementInsert.innerHTML='';
        }
    }

    /**
     * html Objekt für löschen und ändern buttons
     * @returns {string}
     */
    #generateMarkupDelEd() {
        return ` <button class="btn ${(this.#editmode===true) ?'':'btn-hide'} btn-delete">Löschen</button>
                 <button class="btn ${(this.#editmode===true) ?'':'btn-hide'} btn-update">Ändern</button>`;

    }

    /**
     * html Objekt für einfüge button
     * @returns {string}
     */
    #generateMarkupInsert() {
        return `<button class="btn ${(this.#editmode===true) ?'':'btn-hide'} btn-insert">Einfügen</button>`;
    }

}
export default new EditMode();