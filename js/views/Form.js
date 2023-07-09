import {loadArticleNumbers, loadForm} from "../controller.js";
import {sortArrayOfObjects} from '../helper.js';

/**
 * Autorin: Petra Tsesmetzi
 * Datum: 12.06.2023
 *
 * Die Klasse FormView generiert das Markup für das Formular
 * durch Flags wird hier zwischen Create und Update unterschieden
 *
 */

class Form {
    // #updateFlag = false;
    #parentElement = document.querySelector('.content-container');
    #addTextAreaFields = "";
    #addedBlockCounter;

    #formular = document.querySelector('#createAndUpdateObjects');
    #selectField = document.querySelector('#subChapterTitels');
    #closeButton;
    #deleteBtns;

    /**
     * initialisiert das Markup(hängt die htmlObjekte in die Container)
     * @param state
     */
    render(state) {
        // console.log('in form',state);
        this.#clear();
        console.log(state.form);
        const markup = this.#generateMarkup(state.form);
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);
        this.#addTextAreaFields = document.querySelector('.addTextAreaFields');
         this.#deleteBtns = document.querySelector('.addTextAreaFields');
        this.#addHandlerRender();
    }

    #clear() {
        this.#parentElement.innerHTML = '';
        this.#addedBlockCounter = 1;
    }

    /**
     * Eventhandler für Code hinzufügen, Beschreibung hinzufügen und Lösche buttons
     */
    #addHandlerRender() {

        const addDescButton = document.querySelector('.addDescArea');
        addDescButton.addEventListener('click', this.#addElement.bind(this));
        //
        const addCodeButton = document.querySelector('.addCodeArea');
        addCodeButton.addEventListener('click', this.#addElement.bind(this));

        // const deleteBtns = document.querySelector('.addTextAreaFields');
        this.#deleteBtns.addEventListener('click', this.#deleteAddedElements.bind(this));

    }

    /**
     * Eventhandler für Artikelnummer
     * lädt die richtigen artikelnummern je nachdem auf welches Unterkapitel man geklickt hat
     * @param loadArticleNumbers
     */

    /**
     * lädt artikelnummer bei wechseln des subchapters
     * @param loadArticleNumbers
     */
    addHandlerRenderArticleNumbers(loadArticleNumbers) {
        this.#selectField = document.querySelector('#subChapterTitels');
        this.#selectField.addEventListener('change', loadArticleNumbers);

    }

    /**
     * lädt die vorher eingetragenen werte der inputfelder beim wechseln des subchapters
     * @param loadFormContent
     */
    addHandlerRenderChangeSubChapter(loadFormContent){
        this.#selectField.addEventListener('focus', loadFormContent);
      }

    /**
     * Eventhandler für submit Button
     * @param createAndUpdateArticles
     */
    addHandlerRenderSend(createAndUpdateArticles) {
        this.#formular = document.querySelector('#createAndUpdateObjects');
        this.#formular.addEventListener('submit', createAndUpdateArticles.bind(this));
    }

    /**
     * Eventhandler für den Close Button
     * @param closeForm
     */
    addHandleRenderClose(closeForm) {
        this.#closeButton = document.querySelector('.close-outline');
        this.#closeButton.addEventListener('click', closeForm.bind(this));
    }

    deleteHandleRenderFields(deleteFields){
        this.#deleteBtns.addEventListener('click',deleteFields.bind(this));
    }
    /**
     * fügt nach einem Click auf den jeweiligen Button einen  Code-Feld oder Beschreibung-Feld hinzu
     */
    #addElement(e) {
        let toAdd = e.target;
        if (toAdd.classList.contains("addCodeArea")) {

            const codeMarkup = this.#generateBlock('code');
            this.#addTextAreaFields.insertAdjacentHTML("beforeend", codeMarkup);
        }
        if (toAdd.classList.contains("addDescArea")) {
            const descMarkup = this.#generateBlock('description');
            this.#addTextAreaFields.insertAdjacentHTML("beforeend", descMarkup);
        }
    }

    /**
     * Löscht die hinzugefügten Code -und Beschreibungsfelder
     * @param e
     */
    #deleteAddedElements(e) {
        if(e.target.classList.contains("btn-delete")){
            let toDelete = e.target.parentElement.parentNode;

            if (toDelete.classList.contains("addedCode") || toDelete.classList.contains("addedDescription")) {
                toDelete.remove();
            }
        }
    }

    /**
     * markup für leere code oder beschreibungsfeld welches dynamisch zur laufzeit generiert wird
     * @param type
     * @returns {string}
     */
    #generateBlock(type) {
        this.#addedBlockCounter++;
        const blockType = type === 'description' ? 'addedDescription' : 'addedCode';
        const blockLabel = type === 'description' ? 'Beschreibung' : 'Code';

        return `
        <div data-id="${this.#addedBlockCounter}" class="${blockType}">
          <div class="label-container">
            <label for="${type}_${this.#addedBlockCounter}">${blockLabel}</label>
            <button data-btnid="${this.#addedBlockCounter}" class="btn btn-delete">Delete</button>
          </div>
          <textarea id="${type}_${this.#addedBlockCounter}" name="${type}_${this.#addedBlockCounter}" data-elementOrder="${this.#addedBlockCounter}" data-id="noId" class="${type}"></textarea>
        </div>
  `;
    }

    /**
     * markup für code und beschreibungsfelder die beim update oder bei focus über ein array ausgelesen werden
     * @param arr
     * @param i
     * @param type
     * @returns {string}
     */
    #generateBlocks(arr,i,type){
        const blockType = type === 'description' ? 'addedDescription' : 'addedCode';
        const blockLabel = type === 'description' ? 'Beschreibung' : 'Code';
        let htmlObj='';
        htmlObj += `<div data-id="${i}" class="${blockType}">
                        <div class="label-container"><label for="${type}_${i}">${blockLabel} ${(i===0 || i===1)?
                        '<span class="requiredAsterisk">*</span>':''}</label>
                        <button data-btnid="${i}" class="btn ${(i===0 || i===1)?'btn-hide':''} btn-delete">Delete</button></div>
                        <textarea id="${type}_${i}" name="${type}_${i}" data-elementOrder="${i}" data-id="${arr[i].id}" class="${type}">${arr[i][type+'Text']}</textarea></div>`;

        return htmlObj;
        }


    /**
     * html Objekt für das gesamte formular
     * @param state
     * @returns {string}
     */
    #generateMarkup(form) {
       // ***************************** Überschrift und form  *************************************
        let htmlObj = `
        <div class="form-container">
            <div class="form-header">
                 ${form.actionForm === 'update' ? '<h1>Elemente ändern</h1>' : '<h1>Elemente hinzufügen</h1>'}
                <ion-icon class="close-outline" name="close-outline"></ion-icon>
            </div>
        <form action="#" method="post" id="createAndUpdateObjects">
        
        <!--  ***************************** Artikelname ************************************** -->
          <div class="input-container">
                <div class="inputFields artikel" >
                <label for="articleTitel">Artikel<span class="requiredAsterisk">*</span></label>
                <input list="articleTitels" type="text" id="articleTitel" name="articleTitel" class="overlayHeadings" value="${form.actionForm === 'update' ? form.articleName : form.actionForm === 'focus' ? form.articleName:''}" required>
            </div>`;
        //  ***************************** Artikelnr bei create Selectfeld /ArtikelId bei update **************************************
        if(form.actionForm === 'create'|| form.actionForm === 'focus') {
            htmlObj += `
                    <div class="inputFields artikelnr">
                    <label for="articleNr">Artikelnr.</label>
                    <select id="articleNr" name="articleNr">`;
            // if (form.actionForm === 'update') htmlObj += `<option class="overlayNumbers" >${form.articleId}</option>`;
            for (let i = form.freeArticleNumbers.length - 1; i >= 0; i--) {
                htmlObj += `<option class="overlayNumbers" value=${form.freeArticleNumbers[i]}>${form.freeArticleNumbers[i]}</option>`;
            }
        }else{
            htmlObj += `
                    <div class="inputFields ">`;
        }

        //  ***************************** Unterkapitel -Selectfeld  **************************************
            htmlObj += `
                   </select>
                   </div>
                   <div class="inputFields unterkapitel">
                   <label for="subChapterTitel">Unterkapitel</label>
                   <select name="subChapterTitel" id="subChapterTitels" class="overlayContainer">`;
            for (let i = 0; i < form.subchapters.length; i++) {
                htmlObj += `<option class="overlayContainer" value="${form.subchapters[i].subchapterName}"  ${(form.subchapterId - 1) === i ? 'selected' : ''  } ${form.actionForm === 'update'?'disabled':''}>${form.subchapters[i].subchapterName}</option>`;
            }

        // ********************************** Errormessage ****************************************************************************
        htmlObj += `</select></div></div>
        <div class="errorMessage">Artikel ist schon vergeben, wähle einen anderen Bezeichner</div>`;

        //********************************* Pflicht Code und Beschreibungsfelder Create ***********************************************
        if (form.actionForm === 'create' ) {
            htmlObj += ` 
            <div class="addTextAreaFields">
                <div data-id="0" class="addedDescription">
                    <label for="description">Beschreibung<span class="requiredAsterisk">*</span></label>
                    <textarea id="description_0" name="description_0" data-elementOrder="0" data-id="" class="description" required>${(form.articleElementArr.length>0)?form.articleElementArr[0].descriptionText:''}</textarea>
                </div>
                <div data-id="1" class="addedCode">
                    <label for="code">Code<span class="requiredAsterisk">*</span></label>
                    <textarea id="code_1"  name="codeblock_1" data-elementOrder="1" data-id="" class="code" required>${(form.articleElementArr.length>0)?form.articleElementArr[1].codeText:''}</textarea>
                </div>
            </div>`;

            this.#addedBlockCounter=1;

            //********************************* Alle Code und Beschreibungsfelder Update ***********************************************
        } else if (form.actionForm === 'update'||form.actionForm==='focus') {

            htmlObj += `<div class="addTextAreaFields">`;

            //******************* Ausgabe der zu ändernden Blöcke ***************************************************************************
            for (let i = 0; i < form.articleElementArr.length; i++) {
                console.log('forschleife',form.articleElementArr.length);
                if (form.articleElementArr[i].hasOwnProperty('descriptionText')) {
                    htmlObj += this.#generateBlocks(form.articleElementArr,i,'description');

                } else if (form.articleElementArr[i].hasOwnProperty('codeText')) {
                    htmlObj += this.#generateBlocks(form.articleElementArr,i,'code');
                }
            }
            htmlObj += `</div>`;
            this.#addedBlockCounter=form.articleElementArr.length-1;
        }
        //******************* Code hizufügen und Beschreibung hinzufügen Button *********************************************
        htmlObj += `
        <div class="addTextAreaFields"></div>
        <div class="addTextArea-container">
            <div class="addTextAreas">
                <button type="button" class="btn-add addCodeArea">Code hinzufügen</button>
                <button type="button" class="btn-add addDescArea">Beschreibung hinzufügen</button>
            </div>
        </div>
        <!-- ****************** Reset und Submit Button *********************************************-->
        <div class="btn-form-container">
            <button type="reset" class="btn-form btn-reset"  value="Zurücksetzen">Zurücksetzen</button>
            <button type="submit" class="btn-form btn-send"  value="Absenden">Absenden</button>
        </div>
    </form>
    </div>`;
        return htmlObj;

    }

    /**
     * Nachricht wird angezeigt wenn Artikelname schon vergeben ist
     */
    activateErrorMessage() {
        document.getElementsByClassName('errorMessage')[0].classList.add('showMessage');

    }
}

export default new Form();