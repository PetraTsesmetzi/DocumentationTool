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

        this.#clear();
        console.log('aktuelles',state);
        console.log('aktuelles f',state.form);

        console.log('subchapterByChapterName',state.form.subchapterByChapterName);
        console.log('subchapterId',state.form.subchapterId);
        console.log('subchapterName',state.form.subchapterName);

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
     * @param form
     * @returns {string}
     */
    // #generateMarkup(form) {
    //     console.log('form',form)
    //     console.log('generateMarkup',form.subchapterByChapterName)
    //    // ***************************** Überschrift und form  *************************************
    //     let htmlObj = `
    //     <div class="form-container">
    //         <div class="form-header">
    //              ${form.actionForm === 'update' ? '<h1>Artikel ändern</h1>' : '<h1>Artikel hinzufügen</h1>'}
    //             <ion-icon class="close-outline" name="close-outline"></ion-icon>
    //         </div>
    //     <form action="#" method="post" id="createAndUpdateObjects">
    //
    //     <!--  ***************************** Artikelname ************************************** -->
    //       <div class="input-container">
    //             <div class="inputFields artikel" >
    //             <label for="articleTitel">Artikel<span class="requiredAsterisk">*</span></label>
    //             <input list="articleTitels" type="text" id="articleTitel" name="articleTitel" class="overlayHeadings" value="${form.actionForm === 'update' ? form.articleName : form.actionForm === 'focus' ? form.articleName:''}" required>
    //         </div>`;
    //     //  ***************************** Artikelnr bei create Selectfeld /ArtikelId bei update **************************************
    //     if(form.actionForm === 'create'|| form.actionForm === 'focus') {
    //         htmlObj += `
    //                 <div class="inputFields artikelnr">
    //                 <label for="articleNr">Artikelnr.</label>
    //                 <select id="articleNr" name="articleNr">`;
    //         // if (form.actionForm === 'update') htmlObj += `<option class="overlayNumbers" >${form.articleId}</option>`;
    //         for (let i = form.freeArticleNumbers.length - 1; i >= 0; i--) {
    //             htmlObj += `<option class="overlayNumbers" value=${form.freeArticleNumbers[i]}>${form.freeArticleNumbers[i]}</option>`;
    //         }
    //     }else{
    //         htmlObj += `
    //                 <div class="inputFields ">`;
    //     }
    //
    //     //  ***************************** Unterkapitel -Selectfeld  **************************************
    //         htmlObj += `
    //                </select>
    //                </div>
    //                <div class="inputFields unterkapitel">
    //                <label for="subChapterTitel">Unterkapitel</label>
    //                <select name="subChapterTitel" id="subChapterTitels" class="overlayContainer">`;
    //      let starterId=form.subchapterByChapterName[0].id
    //
    //         for (let i = 0; i < form.subchapterByChapterName.length; i++) {
    //
    //
    //             // htmlObj += `<option class="overlayContainer" id=${form.subchapterByChapterName[i].id} value="${form.subchapterByChapterName[i].subchapterName}"  ${(form.subchapterId - starterId) === i ? 'selected' : ''  } ${form.actionForm === 'update'?'disabled':''}>${form.subchapterByChapterName[i].subchapterName}</option>`;
    //             htmlObj += `<option class="overlayContainer" id=${form.subchapterByChapterName[i].id} value="${form.subchapterByChapterName[i].subchapterName}"   ${(form.subchapterName) === form.subchapterByChapterName[i].subchapterName ? 'selected' : ''  } ${form.actionForm === 'update'?'disabled':''}>${form.subchapterByChapterName[i].subchapterName}</option>`;
    //
    //         }
    //
    //     console.log('generateMarkupform',form)
    //     // ********************************** Errormessage ****************************************************************************
    //     htmlObj += `</select></div></div>
    //     <div class="errorMessage">Artikel ist schon vergeben, wähle einen anderen Bezeichner</div>`;
    //
    //     //********************************* Pflicht Code und Beschreibungsfelder Create ***********************************************
    //     if (form.actionForm === 'create' ) {
    //         htmlObj += `
    //         <div class="addTextAreaFields">
    //             <div data-id="0" class="addedDescription">
    //                 <label for="description">Beschreibung<span class="requiredAsterisk">*</span></label>
    //                 <textarea id="description_0" name="description_0" data-elementOrder="0" data-id="" class="description" required>${(form.articleElementArr.length>0)?form.articleElementArr[0].descriptionText:''}</textarea>
    //             </div>
    //             <div data-id="1" class="addedCode">
    //                 <label for="code">Code<span class="requiredAsterisk">*</span></label>
    //                 <textarea id="code_1"  name="codeblock_1" data-elementOrder="1" data-id="" class="code" required>${(form.articleElementArr.length>0)?form.articleElementArr[1].codeText:''}</textarea>
    //             </div>
    //         </div>`;
    //
    //         this.#addedBlockCounter=1;
    //
    //         //********************************* Alle Code und Beschreibungsfelder Update ***********************************************
    //     } else if (form.actionForm === 'update'||form.actionForm==='focus') {
    //
    //         htmlObj += `<div class="addTextAreaFields">`;
    //
    //         //******************* Ausgabe der zu ändernden Blöcke ***************************************************************************
    //         for (let i = 0; i < form.articleElementArr.length; i++) {
    //
    //             if (form.articleElementArr[i].hasOwnProperty('descriptionText')) {
    //                 htmlObj += this.#generateBlocks(form.articleElementArr,i,'description');
    //
    //             } else if (form.articleElementArr[i].hasOwnProperty('codeText')) {
    //                 htmlObj += this.#generateBlocks(form.articleElementArr,i,'code');
    //             }
    //         }
    //         htmlObj += `</div>`;
    //         this.#addedBlockCounter=form.articleElementArr.length-1;
    //     }
    //     //******************* Code hizufügen und Beschreibung hinzufügen Button *********************************************
    //     htmlObj += `
    //     <div class="addTextAreaFields"></div>
    //     <div class="addTextArea-container">
    //         <div class="addTextAreas">
    //             <button type="button" class="btn-add addCodeArea">Code hinzufügen</button>
    //             <button type="button" class="btn-add addDescArea">Beschreibung hinzufügen</button>
    //         </div>
    //     </div>
    //     <!-- ****************** Reset und Submit Button *********************************************-->
    //     <div class="btn-form-container">
    //         <button type="reset" class="btn-form btn-reset"  value="Zurücksetzen">Zurücksetzen</button>
    //         <button type="submit" class="btn-form btn-send"  value="Absenden">Absenden</button>
    //     </div>
    // </form>
    // </div>`;
    //     return htmlObj;
    //
    // }
    #generateMarkup(form) {
        console.log('form',form)
        console.log('generateMarkup',form.subchapterByChapterName)
        // ***************************** Überschrift und form  *************************************
        let htmlObj = `
        <div class="form-container">
            <div class="form-header">
                 ${form.actionForm === 'update' ? '<h1>Artikel ändern</h1>' : '<h1>Artikel hinzufügen</h1>'}
                <ion-icon class="close-outline" name="close-outline"></ion-icon>
            </div>
        <form action="#" method="post" id="createAndUpdateObjects">`;



        htmlObj += ` <div class="input-container">`;
        // //  ***************************** Kategory -Selectfeld  **************************************

        htmlObj += `<div class="inputFields kategorie">
                   <label for="categoryTitel">Kategorie</label>
                   <select name="categoryTitel" id="categoryTitels" class="overlayContainer">`;
        // let starterId=form.subchapterByChapterName[0].id

        for (let i = 0; i < form.categoryNames.length; i++) {


            // htmlObj += `<option class="overlayContainer" id=${form.subchapterByChapterName[i].id} value="${form.subchapterByChapterName[i].subchapterName}"  ${(form.subchapterId - starterId) === i ? 'selected' : ''  } ${form.actionForm === 'update'?'disabled':''}>${form.subchapterByChapterName[i].subchapterName}</option>`;
            htmlObj += `<option class="overlayContainer" id=${form.categoryNames[i].id} value="${form.categoryNames[i].categoryName}"   ${(form.categoryName) === form.categoryNames[i].categoryName ? 'selected' : ''  } ${form.actionForm === 'update'?'disabled':''}>${form.categoryNames[i].categoryName}</option>`;

        }

        console.log('generateMarkupform',form)

        htmlObj += `</select></div>`;

        //  ***************************** Kapitel -Selectfeld  **************************************

        htmlObj += `<div class="inputFields kapitel">
                   <label for="chapterTitel">Kapitel</label>
                   <select name="chapterTitel" id="chapterTitels" class="overlayContainer">`;
        // let starterId=form.subchapterByChapterName[0].id
        console.log(form.chapterExists);
        // if(form.chapterExists){
        for (let i = 0; i < form.chapterByCategorieName.length; i++) {
            // htmlObj += `<option class="overlayContainer" id=${form.subchapterByChapterName[i].id} value="${form.subchapterByChapterName[i].subchapterName}"  ${(form.subchapterId - starterId) === i ? 'selected' : ''  } ${form.actionForm === 'update'?'disabled':''}>${form.subchapterByChapterName[i].subchapterName}</option>`;
            htmlObj += `<option class="overlayContainer" id=${form.chapterByCategorieName[i].id} value="${form.chapterByCategorieName[i].chapterName}"   ${(form.chapterName) === form.chapterByCategorieName[i].chapterName ? 'selected' : ''} ${form.actionForm === 'update' ? 'disabled' : ''}>${form.chapterByCategorieName[i].chapterName}</option>`;
        }
            //  }else{
        //     htmlObj += `<option class="overlayContainer" id='keinKapitel' value="-"   selected   ${form.actionForm === 'update'?'disabled':''}>Erstelle ein Kapitel</option>`;
        // }

        console.log('generateMarkupform',form)

        htmlObj += `</select></div>`;
        //  ***************************** Unterkapitel -Selectfeld  **************************************

        htmlObj += `<div class="inputFields unterkapitel">
                   <label for="subChapterTitel">Unterkapitel</label>
                   <select name="subChapterTitel" id="subChapterTitels" class="overlayContainer">`;
        // let starterId=form.subchapterByChapterName[0].id
        console.log(form.subExists);
        // if(form.subExists){
        for (let i = 0; i < form.subchapterByChapterName.length; i++) {
            // htmlObj += `<option class="overlayContainer" id=${form.subchapterByChapterName[i].id} value="${form.subchapterByChapterName[i].subchapterName}"  ${(form.subchapterId - starterId) === i ? 'selected' : ''  } ${form.actionForm === 'update'?'disabled':''}>${form.subchapterByChapterName[i].subchapterName}</option>`;
            htmlObj += `<option class="overlayContainer" id=${form.subchapterByChapterName[i].id} value="${form.subchapterByChapterName[i].subchapterName}"   ${(form.subchapterName) === form.subchapterByChapterName[i].subchapterName ? 'selected' : ''  } ${form.actionForm === 'update'?'disabled':''}>${form.subchapterByChapterName[i].subchapterName}</option>`;
        }
        // }else{
        //     htmlObj += `<option class="overlayContainer" id='keinUnterkapitel' value="-"   selected   ${form.actionForm === 'update'?'disabled':''}>Erstelle ein  Unterkapitel</option>`;
        // }

        console.log('generateMarkupform',form)

        htmlObj += `</select></div>`;
        // ***************************** Artikelname **************************************
        htmlObj += `  <div class=article-wrapper>
                <div class="inputFields artikel" >
                    <label for="articleTitel">Artikel<span class="requiredAsterisk">*</span></label>
                    <input list="articleTitels" type="text" id="articleTitel" name="articleTitel" class="overlayHeadings" value="${form.actionForm === 'update' ? form.articleName : form.actionForm === 'focus' ? form.articleName:''}" required>
                </div> `;
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
        htmlObj += `</select></div></div>`;

        // ********************************** Errormessage ****************************************************************************
        htmlObj +=  `</div><div class="errorMessage">Artikel ist schon vergeben, wähle einen anderen Bezeichner</div>`;

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