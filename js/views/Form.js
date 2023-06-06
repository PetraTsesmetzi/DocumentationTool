import {loadArticleNumbers} from "../controller.js";
class Form{
    #updateFlag=false;
    #parentElement = document.querySelector('.content-container');
    #addTextAreaFields="";
    #addedBlockCounter;


    /**
     * initialisiert das markup(hängt die htmlObjekte in die Container)
      * @param state
     */
    render(state){
        this.#clear();
        const markup=this.#generateMarkup(state);
        this.#parentElement.insertAdjacentHTML('afterbegin',markup);
        this.#addTextAreaFields=document.querySelector('.addTextAreaFields');
        this.#addHandlerRender();

    }
    #clear(){
        this.#parentElement.innerHTML='';
        this.#addedBlockCounter=1;
    }

    /**
     * eventhandler für code hinzufügen, beschreibung hinzufügen und lösche buttons
     * aufgurfen innerhalb des formulars
     */
    #addHandlerRender(){

        const addDescButton=document.querySelector('.addDescArea');
        addDescButton.addEventListener('click',this.#addElement.bind(this));
        //
        const addCodeButton=document.querySelector('.addCodeArea');
        addCodeButton.addEventListener('click',this.#addElement.bind(this));

        const deleteBtns=document.querySelector('.addTextAreaFields');
        deleteBtns.addEventListener('click',this.#deleteAddedElements.bind(this));

        const selectField= document.querySelector('#subChapterTitels');
        // selectField.addEventListener('change',function(e){
        //     console.log(e.target.options.selectedIndex);
        // })
        ///hier anpassen
        selectField.addEventListener('change',loadArticleNumbers.bind(this));

    }

    /**
     * event handler für submit button vom formular
     * @param handler
     */
    addHandlerRenderSend(handler){
        const formular=document.querySelector('#createNewObjects');
        formular.addEventListener('submit',handler.bind(this));
    }

    /**
     * intialsiert codeblckfeld oder beschreibungsblock feld
     * @param e
     */
    #addElement(e){
        let toAdd=e.target;
        if(toAdd.classList.contains("addCodeArea")){
            const codeMarkup=this.#generateCodeBlock();
            this.#addTextAreaFields.insertAdjacentHTML("beforeend", codeMarkup);

        }
        if(toAdd.classList.contains("addDescArea")) {
            const descMarkup = this.#generateDescriptionBlock();
            this.#addTextAreaFields.insertAdjacentHTML("beforeend", descMarkup);
        }

    }

    /**
     * löscht die hizugefügten code oder beschreibungsblöcke
     * @param e
     */
    #deleteAddedElements(e){
        console.log(e.target);
        let toDelete=e.target.parentElement.parentNode;
        // console.log(toDelete);
        if(toDelete.classList.contains("addedCode") ||toDelete.classList.contains("addedDescription")){
            toDelete.remove();
        }
    }

    /**
     * html Objekt für beschreibungsblock
     * @returns {string}
     */
    #generateDescriptionBlock(){
        this.#addedBlockCounter++;
        return`<div data-id="${this.#addedBlockCounter}" class="addedDescription">
                <div class="label-container"><label for="description_${this.#addedBlockCounter}">beschreibung</label>
                <button data-btnid="${this.#addedBlockCounter}" class="btn btn-delete">Delete</button></div>
                <textarea id="description_${this.#addedBlockCounter}" name="description_${this.#addedBlockCounter}" data-elementOrder="${this.#addedBlockCounter}" class="description"></textarea>
               </div>`;
    }

    /**
     * html Objekt für codeblock
     * @returns {string}
     */
    #generateCodeBlock(){
        this.#addedBlockCounter++;
        return `<div data-id="${this.#addedBlockCounter}" class="addedCode">
                <div class="label-container"><label for="codeblock_${this.#addedBlockCounter}">Code</label>
                <button data-btnid="${this.#addedBlockCounter}" class="btn btn-delete">Delete</button></div>
                <textarea id="codeblock_${this.#addedBlockCounter}" name="codeblock_${this.#addedBlockCounter}" data-elementOrder="${this.#addedBlockCounter}" class="code"></textarea>
                </div>`;
    }

    /**
     * html Objekt für das gesamte formular
     * @param state
     * @returns {string}
     */
    #generateMarkup(state) {
        console.log('in form')
        console.log(state)
        let htmlObj = `<div class="form-container">
        <h1>Elemente hinzufügen</h1>
        <form action="#" method="post" id="createNewObjects">
            <div class="input-container">
<!--            <div class="inputFields">-->
<!--                <label for="chapterTitle">Kapitel</label>-->
<!--       -->
<!--                <input list="chapterTitles" type="text" id="chapterTitle" name="chapterTitle" autocomplete="off">-->
<!--                <datalist id="chapterTitles">-->
<!--                    <option value="Javascript Fundamentals Part 1">-->
<!--                    <option value="Javascript Fundamentals Part 2">-->
<!--                </datalist>-->
<!--            </div>-->
<!--            <div class="inputFields">-->
<!--                <label for="chapters">Kapitelnr.</label>-->
<!--                <select id="chapters" name="chapters">-->
<!--                    <option value="10">10</option>-->
<!--                    <option value="1">1</option>-->
<!--                    <option value="2">2</option>-->
<!--                    <option value="4">4</option>-->
<!--                </select>-->
<!--            </div>-->
        </div>
      
      
        <div class="input-container">
            
                <div class="inputFields">
                <label for="articleTitel">Artikel</label>
                <input list="articleTitels" type="text" id="articleTitel" name="articleTitel" class="overlayHeadings" autocomplete="off">
<!--                <datalist id="articleTitels">-->
<!--                    <option value="Values">-->
<!--                    <option value="Variables">-->
<!--                </datalist>-->
            </div>
            <div class="inputFields">
                <label for="articleNr">Artikelnr.</label>
                <select id="articleNr" name="articleNr">`;

                for (let i = state.deletedArticles.length-1; i >=0 ; i--) {
                    htmlObj+=`<option class="overlayNumbers" value=${state.deletedArticles[i]}>${state.deletedArticles[i]}</option>`;
                }

              htmlObj+=`
                </select>
            </div>
        
            <div class="inputFields">
<!--                <label for="subChapterTitel">Unterkapitel</label>-->
<!--                <input list="subChapterTitels" type="text" id="subChapterTitel" name="subChapterTitel"-->
<!--                       autocomplete="off">-->
<!--                <datalist id="subChapterTitels">-->
<!--                    <option value="Values and Variables">-->
<!--                    <option value="Basic Operators & Math Operators">-->
<!--                </datalist>-->
             <label for="subChapterTitel">Unterkapitel</label>
             <select name="subChapterTitel" id="subChapterTitels" class="overlayContainer">`;
                for (let i = 0; i < state.subchapters.length; i++) {

                    console.log('in form')
                    console.log(state.subchapters[i]);
                    htmlObj+=`<option class="overlayContainer" selected=`; (state.id==i+1)?'selected':'';
                        htmlObj+=`>${state.subchapters[i].subchapterName}</option>`;
                }

        htmlObj+=`</select></div></div>
     
        <div class="textAreaFields">
            <div class="textAreaFieldsDescription">
                <label for="description">Beschreibung</label>
                <textarea id="description_0" name="description_0" data-elementOrder="0" class="description"></textarea>
            </div>
            <div class="textAreaFieldsCode">
                <label for="code">Code</label>
                <textarea id="code_0"  name="codeblock_1" data-elementOrder="1" class="code"></textarea>
            </div>
        </div>
        <div class="addTextAreaFields">`;


        htmlObj+=`</div>

        <div class="addTextArea-container">
            <div class="addTextAreas">
                <button type="button" class="btn-add addCodeArea">Code hinzufügen</button>
                <button type="button" class="btn-add addDescArea">Beschreibung hinzufügen</button>
            </div>
            
        </div>

        <div class="btn-form-container">
<!--            <button type="reset" class="btn-form btn-reset">Zurücksetzen</button>-->
             <button type="reset" class="btn-form btn-reset"  value="Zurücksetzen">Zurücksetzen</button>
            <button type="submit" class="btn-form btn-send"  value="Absenden">Absenden</button>
        </div>
    </form>
    </div>`;
        return htmlObj;

    }

}
export default new Form();