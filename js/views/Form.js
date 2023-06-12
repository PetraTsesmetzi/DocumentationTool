import {loadArticleNumbers} from "../controller.js";
import {sortArrayOfObjects} from '../helper.js';

class Form {
    #updateFlag = false;
    #parentElement = document.querySelector('.content-container');
    #addTextAreaFields = "";
    #addedBlockCounter;

    #formular = document.querySelector('#createAndUpdateObjects');
    #selectField = document.querySelector('#subChapterTitels');
    #closeButton;

    /**
     * initialisiert das markup(hängt die htmlObjekte in die Container)
     * @param state
     */
    render(state) {
        console.log('inform');
        // console.log(state.form);
        this.#clear();
        const markup = this.#generateMarkup(state.form);
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);
        this.#addTextAreaFields = document.querySelector('.addTextAreaFields');
        this.#addHandlerRender();
    }

    #clear() {
        this.#parentElement.innerHTML = '';
        this.#addedBlockCounter = 1;
    }

    /**
     * eventhandler für code hinzufügen, beschreibung hinzufügen und lösche buttons
     * aufgurfen innerhalb des formulars
     */
    #addHandlerRender() {

        const addDescButton = document.querySelector('.addDescArea');
        addDescButton.addEventListener('click', this.#addElement.bind(this));
        //
        const addCodeButton = document.querySelector('.addCodeArea');
        addCodeButton.addEventListener('click', this.#addElement.bind(this));

        const deleteBtns = document.querySelector('.addTextAreaFields');
        deleteBtns.addEventListener('click', this.#deleteAddedElements.bind(this));

    }

    addHandlerRenderArticleNumbers(handler) {
        console.log('article numbers')
        this.#selectField = document.querySelector('#subChapterTitels');
        this.#selectField.addEventListener('change', handler);
    }

    /**
     * event handler für submit button vom formular
     * @param handler
     */
    addHandlerRenderSend(handler) {
        this.#formular = document.querySelector('#createAndUpdateObjects');
        this.#formular.addEventListener('submit', handler.bind(this));
    }

    addHandleRenderClose(handler) {
        console.log('renderclose')
        this.#closeButton = document.querySelector('.close-outline');
        this.#closeButton.addEventListener('click', handler.bind(this));
    }

    /**
     * intialsiert codeblckfeld oder beschreibungsblock feld
     * @param e
     */
    #addElement(e) {
        let toAdd = e.target;
        if (toAdd.classList.contains("addCodeArea")) {
            const codeMarkup = this.#generateCodeBlock();
            this.#addTextAreaFields.insertAdjacentHTML("beforeend", codeMarkup);

        }
        if (toAdd.classList.contains("addDescArea")) {
            const descMarkup = this.#generateDescriptionBlock();
            this.#addTextAreaFields.insertAdjacentHTML("beforeend", descMarkup);
        }

    }

    /**
     * löscht die hizugefügten code oder beschreibungsblöcke
     * @param e
     */
    #deleteAddedElements(e) {
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++dletetAddedElements');
        console.log(e.target);
        console.log();
        if(e.target.classList.contains("btn-delete")){
            let toDelete = e.target.parentElement.parentNode;
            // console.log(toDelete);
            if (toDelete.classList.contains("addedCode") || toDelete.classList.contains("addedDescription")) {
                toDelete.remove();
            }
        }

    }

    /**
     * html Objekt für beschreibungsblock
     * @returns {string}
     */
    #generateDescriptionBlock() {
        this.#addedBlockCounter++;
        return `<div data-id="${this.#addedBlockCounter}" class="addedDescription">
                <div class="label-container"><label for="description_${this.#addedBlockCounter}">beschreibung</label>
                <button data-btnid="${this.#addedBlockCounter}" class="btn btn-delete">Delete</button></div>
                <textarea id="description_${this.#addedBlockCounter}" name="description_${this.#addedBlockCounter}" data-elementOrder="${this.#addedBlockCounter}" class="description"></textarea>
               </div>`;
    }

    /**
     * html Objekt für codeblock
     * @returns {string}
     */
    #generateCodeBlock() {
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
    #generateMarkup(form) {
        console.log(form)
        console.log('form.actionForm', form.actionForm)


        let htmlObj = `<div class="form-container">
        <div class="form-header">
             ${form.actionForm === 'update' ? '<h1>Elemente ändern</h1>' : '<h1>Elemente hinzufügen</h1>'}
            <ion-icon class="close-outline" name="close-outline"></ion-icon>
        </div>
        <form action="#" method="post" id="createAndUpdateObjects">
        <!--  *****************************Artikelfeld (Artikel,Artikelnr,Unterkapitel************************************** -->
          <div class="input-container">
                <div class="inputFields">
                <label for="articleTitel">Artikel<span class="requiredAsterisk">*</span></label>
                <input list="articleTitels" type="text" id="articleTitel" name="articleTitel" class="overlayHeadings" value="${form.actionForm === 'update' ? form.articleName : ''}" required>
            </div>`;


            htmlObj += `<div class="inputFields">
         
                    <label for="articleNr">${form.actionForm === 'create'?'Artikelnr.':'Artikel_Id'}</label>
                    <select id="articleNr" name="articleNr" ${form.actionForm === 'update'?'disabled':''}>`;
            if (form.actionForm === 'update') htmlObj += `<option class="overlayNumbers" >${form.articleId}</option>`;
            for (let i = form.freeArticleNumbers.length - 1; i >= 0; i--) {
                htmlObj += `<option class="overlayNumbers" value=${form.freeArticleNumbers[i]}>${form.freeArticleNumbers[i]}</option>`;
            }

            htmlObj += `
                    </select>
                </div>
                <div class="inputFields">
                 <label for="subChapterTitel">Unterkapitel</label>
                 <select name="subChapterTitel" id="subChapterTitels" class="overlayContainer">`;
            for (let i = 0; i < form.subchapters.length; i++) {
                htmlObj += `<option class="overlayContainer" value="${form.subchapters[i].subchapterName}"  ${(form.subchapterId - 1) === i ? 'selected' : ''  } ${form.actionForm === 'update'?'disabled':''}>${form.subchapters[i].subchapterName}</option>`;
            }

        // **********************************errormessage****************************************************************************
        htmlObj += `</select></div></div>
        <div class="errorMessage">Artikel ist schon vergeben, wähle einen anderen Bezeichner</div>`;
        //*********************************code und beschreibungsblöcke**************************************************************
        if (form.actionForm === 'create') {
            htmlObj += ` <div class="addTextAreaFields">
            <div data-id="0" class="addedDescription">
                <label for="description">Beschreibung<span class="requiredAsterisk">*</span></label>
                <textarea id="description_0" name="description_0" data-elementOrder="0" class="description" required></textarea>
            </div>
            <div data-id="1" class="addedCode">
                <label for="code">Code<span class="requiredAsterisk">*</span></label>
                <textarea id="code_1"  name="codeblock_1" data-elementOrder="1" class="code" required></textarea>
            </div>
        </div>`;
            this.#addedBlockCounter=1;
        } else if (form.actionForm === 'update') {
            htmlObj += `<div class="addTextAreaFields">`;
            let articleElementArr = [];
            //arrayelemente(code und descriptionblöcke) parsen, dann sortieren und anschließend darstellen
            for (let i = 0; i < form.articleElementArr.length; i++) {
                articleElementArr[i] = JSON.parse(form.articleElementArr[i]);
            }
            let sortedArticleElementArr = sortArrayOfObjects(articleElementArr, 'elementOrder')
            console.log(sortedArticleElementArr)
            console.log(sortedArticleElementArr)
            //ausgabe der zu ändernden blöcke
            for (let i = 0; i < sortedArticleElementArr.length; i++) {

                if (sortedArticleElementArr[i].hasOwnProperty('descriptionText')) {
                    htmlObj += `<div data-id="${i}" class="addedDescription">
                    <div class="label-container"><label for="description_${i}">beschreibung ${(i===0 || i===1)?
                        '<span class="requiredAsterisk">*</span>':''}</label>
                    <button data-btnid="${i}" class="btn ${(i===0 || i===1)?'btn-hide':''} btn-delete">Delete</button></div>
                    <textarea id="description_${i}" name="description_${i}" data-elementOrder="${i}" class="description">${sortedArticleElementArr[i].descriptionText}</textarea></div>`;

                } else if (sortedArticleElementArr[i].hasOwnProperty('codeText')) {
                    htmlObj += `<div data-id="${i}" class="addedCode">
                        <div class="label-container"><label for="codeblock_${i}">Code${(i===0 || i===1)?
                        '<span class="requiredAsterisk">*</span>':''}</label>
                        <button data-btnid="${i}" class="btn ${(i===0 || i===1)?'btn-hide':''} btn-delete">Delete</button></div>
                        <textarea id="codeblock_${i}" name="codeblock_${i}" data-elementOrder="${i}" class="code">${sortedArticleElementArr[i].codeText}</textarea>
                    </div>`;
                }
            }
            htmlObj += `</div>`;
            this.#addedBlockCounter=sortedArticleElementArr.length-1;
        }


        htmlObj += `<div class="addTextAreaFields"></div>

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

    activateErrorMessage() {

        console.log('hello')
        // document.getElementById('articleTitel').value=state.form.articleName;
        document.getElementsByClassName('errorMessage')[0].classList.add('show');

    }
}

export default new Form();