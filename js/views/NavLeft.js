import {
    createAndEditSubchapter, deleteAndEditChapters, deleteAndEditSubchapters, createAndEditChapter,
    loadSubchaptersForNav,

} from "../controller.js";



/**
 * Autorin: Petra Tsesmetzi
 * Datum: 12.06.2023
 *
 * Die Klasse NavLeft generiert das Markup für die linksgerichtete Navigationsleiste
 *
 *
 */

class NavLeft {


    #nonEditWrapper = document.querySelector('#non-edit-section-wrapper');
    #navLeftContainer = document.querySelector('.nav-left-container');
    #navHeaderLinks;

    #navLeft = document.getElementById('nav-left-subchapter');
    #htmlObj = '';
    #id;
    subChapterObjects;


    #editMode;
    #categories;
    #chapters;
    #subchapters;
    #counter = 0;
    #btnSubchapter;
    #btnChapter;
    #subchaptersUl;
    #chaptersUl;

    /**
     * initialisiert das Markup (hängt die htmlObjekte in die Container)
     * und setzt ein EventListener für das Markieren der Links in blau
     * @param start
     * @param chapters
     * @param editmode
     * @returns {Promise<void>}
     */
    async render(start, chapters, editmode) {
        if (start === 'init') {

            this.#editMode = editmode;

            //dropdowwn einhängen
            const markUpChapter = `<section class="custom-dropdown-wrapper">` + this.#generateMarkupDropDownChapter('chapterNorm', 'nonEdit', 'chapter', chapters) + `</section>`;
            this.#nonEditWrapper.insertAdjacentHTML('beforeend', markUpChapter);


            //chapter aus dem dropdown rauslesen und deren subchapters anzeigenlassen
            const chapter = document.getElementById('chapterNorm-id');
            this.subChapterObjects = await loadSubchaptersForNav(chapter.textContent);


            //subchapters als liste einhängen
            const markupBox = `<section id="nav-left-box-subchapters"></section>`;
            this.#nonEditWrapper.insertAdjacentHTML('beforeend', markupBox);
            let navLeftBox = document.getElementById('nav-left-box-subchapters');
            const markup = this.#generateMarkup(this.subChapterObjects);
            navLeftBox.insertAdjacentHTML('beforeend', markup);


            this.setActiveClass(1);
            this.#setEventOnLinks('render');

            this.#activateCustomDropdown('.chapterNorm-dropdown', '.chapterNorm-container', '.chapterNorm-selected', '.chapterNorm-options');


        }
    }

    /**
     * markup subchapter -normal mode
     * @returns {string}
     */
    #generateMarkup(subChapterObjects) {
        let hash=window.location.hash.split('/');
        hash.pop();
        hash=hash.join('/')
        console.log('generateMarkup------category2',hash);

        this.#htmlObj = `<ul id="nav-left-subchapter">`;
        for (let i = 0; i < subChapterObjects.length; i++) {
            let link=hash+'/'+subChapterObjects[i].id;
            if (subChapterObjects.id === 1) {
                this.#htmlObj += `<li  class="nav-left-links-subchapter" data-subchapterid=${subChapterObjects[i].id}><span id="startLink" class="nav-span-subchapter"><a data-linkid=${subChapterObjects[i].id} class='nav-link-subchapter' href="${hash}${subChapterObjects[i].id}">${subChapterObjects[i].subchapterName}</a></span></li>`;
            } else {
                // this.#htmlObj += `<li  class="nav-left-links-subchapter" data-subchapterid=${subChapterObjects[i].id}><span class="nav-left-link-container-subchapters "><span class="nav-left-link-box-subchapter"><span class="nav-span-subchapter"><a data-linkid=${subChapterObjects[i].id} class='nav-link-subchapter' href="#${subChapterObjects[i].id}">${subChapterObjects[i].subchapterName}</a></span></span><span class="edit-box-subchapter edit-section"><ion-icon class="trash" name="trash-outline"></ion-icon><ion-icon class="update" name="create-outline"></ion-icon></span></li>`;
                this.#htmlObj += `<li  class="nav-left-links-subchapter-normMode" data-subchapterid=${subChapterObjects[i].id}><span class="nav-left-link-container-subchapters-normMode "><span class="nav-left-link-box-subchapter-normMode"><span class="nav-span-subchapter-normMode"><a data-linkid=${subChapterObjects[i].id} class='nav-link-subchapter-normMode' href="${link}">${subChapterObjects[i].subchapterName}</a></span></span></span></li>`;
            }
        }
        this.#htmlObj += ` </ul>`;
        return this.#htmlObj;

    }


    renderEditMode(editmode) {
        this.#editMode = editmode;
        const editSectionWrapper = document.getElementById('edit-section-wrapper');
        const nonEditSectionWrapper = document.getElementById('non-edit-section-wrapper');

        if (this.#editMode === true) {
            editSectionWrapper.classList.remove('edit-section');
            nonEditSectionWrapper.classList.add('edit-section');
        } else {
            editSectionWrapper.classList.add('edit-section');
            nonEditSectionWrapper.classList.remove('edit-section');
        }

    }

    // renderCreatedNewSubChapter() {
    //
    //     this.#activateCustomDropdown('.chapterEdit-dropdown', '.chapterEdit-container', '.chapterEdit-selected', '.chapterEdit-options');
    // }

    /**
     * löscht altes Dropdown Menü wenn man auf ein Kaptegorie link drückt
     * @param chapters
     */
    async renderChapterDropDown(chapters) {

        const customDropdownWrapper = document.querySelectorAll('.custom-dropdown-wrapper');
        //altes Dropdown löschen
        customDropdownWrapper[0].innerHTML = '';

        const markUpChapter = this.#generateMarkupDropDownChapter('chapterNorm', 'nonEdit', 'chapter', chapters);

        customDropdownWrapper[0].insertAdjacentHTML('afterbegin', markUpChapter);


        //vom div anstatt von der variablen, 'damit kein kapitel vorhanden' mit abgedeckt wird
        const chapterName = chapters.length > 0 ? chapters[0].chapterName : 'Kein Kapitel vorhanden';
        if (chapterName !== 'Kein Kapitel vorhanden') {
            this.#activateCustomDropdown('.chapterNorm-dropdown', '.chapterNorm-container', '.chapterNorm-selected', '.chapterNorm-options');
        }


        await this.#changeSubChaptersByChapter(chapterName);

    }

    /**
     * erzeugt das markup für das kapitel dropdown menu
     * @returns {string}
     */
    #generateMarkupDropDownChapter(className, mode, chapterType, obj, name = '', modi = null, updateValueOverlay = null) {

        let objName;
        let chaptername;
        if (mode === 'nonEdit') {

            objName = 'chapterName';
            chaptername = obj.length > 0 ? obj[0].chapterName : 'Kein Kapitel vorhanden';

        }

        if (mode === 'editMode') {
            objName = chapterType === "subchapter" ? 'chapterName' : 'categoryName';
            chaptername = obj.length > 0 ? obj[0][objName] : 'Kein Kapitel vorhanden';
        }


        // let objName = chapterType === "subchapter" ? 'chapterName' : 'categoryName';
        if (obj.length > 0) {
            this.#htmlObj = `<div  class="custom-dropdown ${className}-dropdown">`;


            if (modi === 'updateMode') {
                this.#htmlObj += ` <div class="container-select  ${className}-container ${className}-selected-update" style="pointer-events: none;">`;
                this.#htmlObj += ` <div id="${className}-id" class="selected-option ${className}-selected">${updateValueOverlay}</div>`;
            } else if (modi === 'refresh' || modi === null) {

                this.#htmlObj += ` <div class="container-select  ${className}-container">`;
                this.#htmlObj += ` <div id="${className}-id" class="selected-option ${className}-selected"">${chaptername}</div>`;
            }


            this.#htmlObj += `<div  class="container-arrow" ><ion-icon class='arrow' name="caret-down-outline"></ion-icon></div>
            </div>
              <ul class="options ${className}-options"">`;

            for (let i = 0; i < obj.length; i++) {
                this.#htmlObj += `<li>${obj[i][objName]}</li>`;
            }

            this.#htmlObj += `</ul>
            </div>`;
        } else {
            this.#htmlObj = `<h1 class="error-chapter">${chaptername}</h1>`
        }


        return this.#htmlObj;

    }

    #activateCustomDropdown(dropdownSelector, containerSelector, selectedOptionSelector, optionsListSelector) {
        const dropdown = document.querySelector(dropdownSelector);
        const containerSelect = document.querySelector(containerSelector);
        const selectedOption = dropdown.querySelector(selectedOptionSelector);
        const optionsList = dropdown.querySelector(optionsListSelector);

        const toggleOptionsListDisplay = () => {
            optionsList.style.display = optionsList.style.display === '' || optionsList.style.display === 'none' ? 'block' : 'none';
        };

        containerSelect.addEventListener('click', toggleOptionsListDisplay);

        optionsList.addEventListener('click', async (event) => {
            selectedOption.textContent = event.target.textContent;
            optionsList.style.display = 'none';
            if (dropdownSelector === '.chapterNorm-dropdown') {
                if (selectedOption.textContent !== '') {
                    await this.#changeSubChaptersByChapter(selectedOption.textContent);
                    this.addHandlerRenderChangeSubChapter();
                }

            }

        });

        window.addEventListener('click', (event) => {
            const clickedDropdown = event.target.closest('.custom-dropdown');
            if (!clickedDropdown) {
                optionsList.style.display = 'none';
            }
        });
    }


    async #changeSubChaptersByChapter(chapterName) {


        this.#clear(chapterName);
        let markup = '';
        if (chapterName === 'Kein Kapitel vorhanden') {


            markup = `<section id="nav-left-box-subchapters"><h1 class="nav-editmode-header-subchapter edit-section">Unterkapitel Berarbeiten</h1><h1 class="error-subchapter">Kein Unterkapitel vorhanden</h1><ul id="nav-left-subchapter"></ul></section>`;
            let box = document.querySelector('#nav-left-box-subchapters');
            box.insertAdjacentHTML('beforeend', markup);

        } else {

            this.subChapterObjects = await loadSubchaptersForNav(chapterName);

            markup = this.#generateMarkup(this.subChapterObjects);

            let box = document.querySelector('#nav-left-box-subchapters');
            box.insertAdjacentHTML('beforeend', markup);
        }


        if (chapterName !== 'Kein Kapitel vorhanden') {
            this.#setEventOnLinks('dropdown');
            this.addHandlerRenderChangeSubChapter();
        }

    }


    /**
     * eventlistener um die subchapters anhand der kapitel zu laden
     * @param loadFormContentByChapter
     */
    addHandlerRenderChangeChapter(loadFormContentByChapter) {
        let optionsList = document.querySelector('.options');

        optionsList.addEventListener('click', function (e) {

            loadFormContentByChapter(e.target.innerText)
        });
    }

    /**
     * Eventhandler auf submit für createChapter(Erstellen)
     * @param createAndEditChapter
     */
    addHandlerNewChapter(createAndEditChapter) {
        this.#btnChapter = document.getElementById('chapter-form');
        this.#btnChapter.addEventListener('submit', function (event) {
            event.preventDefault();
            let whichBtnWasPressed = event.submitter.innerText;
            createAndEditChapter.call(this, event, whichBtnWasPressed);
        }.bind(this));
    }

    /**
     * Eventhandler auf submit für createSubchapter(Erstellen)
     * @param createAndEditSubchapter
     */
    addHandlerNewSubchapter(createAndEditSubchapter) {

        this.#btnSubchapter = document.getElementById('subchapter-form');

        this.#btnSubchapter.addEventListener('submit', function (event) {
            event.preventDefault();
            let btnPressed = event.submitter.innerText;
            createAndEditSubchapter.call(this, event, btnPressed);
        }.bind(this));
    }

    /**
     * eventhandler für delete and edit subchapters (für trash und edit button der liste)
     * @param deleteAndEditSubchapters
     */
    addHandlerEditForSubchapter(deleteAndEditSubchapters) {

        this.#subchaptersUl = document.querySelector('.nav-left-subchapter');
        this.#subchaptersUl.addEventListener('click', deleteAndEditSubchapters);
    }

    addHandlerEditForChapter(deleteAndEditChapters) {
        this.#chaptersUl = document.querySelector('.nav-left-chapter');
        this.#chaptersUl.addEventListener('click', deleteAndEditChapters);
    }


    /**
     * eventlister auf subchapter Links
     */
    addHandlerRenderChangeSubChapter() {
        this.#navLeft.addEventListener('click', (e) => {
            if (typeof e != 'number' && e.target.dataset.linkid !== undefined) {
                e = Number(e.target.dataset.linkid);
                this.setActiveClass(e);
            }
        });
    }

    /**
     * lädt alle Daten
     * @param categories
     * @param chapters
     * @param subchapters
     * @returns {Promise<void>}
     */
    async loadAllObjectsForEditMode(categories, chapters, subchapters) {
        this.#categories = categories;
        this.#chapters = chapters;
        this.#subchapters = subchapters;
    }

    /**
     * lädt alle Kapitelfür den Editmode
     * @returns {Promise<void>}
     */
    async loadAllChaptersForEditMode() {

        let wrapper = document.getElementById('edit-section-wrapper');
        wrapper.innerHTML = '';
        let markup = `
            ${this.#generateMarkupChapterTypeEdit("chapter", this.#chapters, name)}
            ${this.#generateMarkupChapterTypeEdit("subchapter", this.#subchapters, name)}`;
        wrapper.insertAdjacentHTML('beforeend', markup);

        this.#activateCustomDropdown('.categories-dropdown', '.categories-container', '.categories-selected', '.categories-options');
        this.#activateCustomDropdown('.chapterEdit-dropdown', '.chapterEdit-container', '.chapterEdit-selected', '.chapterEdit-options');
    }




    async refreshSubChapterForEditMode(element, name = '', modi, linkName = null, selectName = null) {
        const wrapper = document.getElementById('edit-section-wrapper');
        const removeElements = (selector) => {
            const elementsToRemove = document.querySelectorAll(selector);
            elementsToRemove.forEach(element => {
                element.remove();
            });
        };

        if (element === 'subchapter') {
            removeElements('.create-subchapter-wrapper');

            if (modi === 'refresh') {
                this.#btnSubchapter.removeEventListener('submit', createAndEditSubchapter);
                this.#subchaptersUl.removeEventListener('submit', createAndEditSubchapter);
            }

            wrapper.insertAdjacentHTML('beforeend', `${this.#generateMarkupChapterTypeEdit("subchapter", this.#subchapters, name, modi, linkName, selectName)}`);
            this.#activateCustomDropdown('.chapterEdit-dropdown', '.chapterEdit-container', '.chapterEdit-selected', '.chapterEdit-options');
            this.addHandlerNewSubchapter(createAndEditSubchapter);
            this.addHandlerEditForSubchapter(deleteAndEditSubchapters);
        }

        if (element === 'chapter') {
            removeElements('.create-chapter-wrapper');

            if (modi === 'refresh') {
                this.#btnChapter.removeEventListener('submit', createAndEditChapter);
                this.#chaptersUl.removeEventListener('click', deleteAndEditChapters);
            }

            wrapper.insertAdjacentHTML('afterbegin', `${this.#generateMarkupChapterTypeEdit("chapter", this.#chapters, name, modi, linkName, selectName)}`);
            this.#activateCustomDropdown('.chapterEdit-dropdown', '.chapterEdit-container', '.chapterEdit-selected', '.chapterEdit-options');
            this.addHandlerNewChapter(createAndEditChapter);
            this.addHandlerEditForChapter(deleteAndEditChapters);
        }
    }



    /**
     * erstellt entweder ein Liste mit Chapter oder Subchapter (oder aktualisiert sie bei benutztung des editmodes)
     * @param chapterType
     * @param obj
     * @param name
     * @param modi
     * @param updateValue
     * @param updateValueOverlay
     * @returns {string}
     */

    #generateMarkupChapterTypeEdit(chapterType, obj, name, modi = null, updateValue = null, updateValueOverlay = null) {


        let objName = chapterType === "subchapter" ? 'subchapterName' : 'chapterName';

        let chapterHeading = chapterType === 'chapter' ? 'Kapitel' : 'UnterKapitel';


        let dropDownObj = chapterType === "subchapter" ? this.#chapters : this.#categories;
        let className = chapterType === "subchapter" ? 'chapterEdit' : 'categories'
        this.#htmlObj = `<section class="create-${chapterType}-wrapper "><section id="nav-left-box-chapters">
      
        <h1 class="nav-editmode-header">${chapterHeading} Bearbeiten</h1>
        <ul class="nav-left-${chapterType}">`;
        for (let i = 0; i < obj.length; i++) {

            this.#htmlObj += `<li  class="nav-left-links-${chapterType}" data-chapterid=${obj[i].id}><span class="nav-left-link-container-chapters"><span class="nav-left-link-box-chapter"><span class="nav-span-chapter"><span data-linkid=${obj[i].id} class='nav-link-${chapterType}' ${obj[i].id}">${obj[i][objName]}</span></span></span><span class="edit-box-chapter nav-editmode"><ion-icon data-trash_id=${obj[i].id} class="trash" name="trash-outline"></ion-icon><ion-icon data-update_id=${obj[i].id} class="update" name="create-outline"></ion-icon></span></li>`;
        }

        this.#htmlObj += ` </ul>`;
        this.#htmlObj += `</section><section class="create-edit-wrapper ">
                         <h1 class="nav-editmode-header">${chapterHeading} Erstellen</h1>
                         <div class="create-${chapterType}-container"><form id="${chapterType}-form">
                         <div class="create-${chapterType}-box">
                         <p>`;
        this.#htmlObj += chapterType === 'chapter' ? "Kapitel eingeben:" : "Unterkapitel eingeben:"
        this.#htmlObj += `</p>
                         <input id="create-${chapterType}-id" class="create-${chapterType}" type="text" value="${modi === 'updateMode' ? updateValue : ''}">
                         </div>`;

        this.#htmlObj += ` <p>`;
        this.#htmlObj += chapterType === 'chapter' ? "Kategorie auswählen:" : "Kapitel auswählen:"
        this.#htmlObj += `</p>`;
        this.#htmlObj += this.#generateMarkupDropDownChapter(className, 'editMode', chapterType, dropDownObj, name, modi, updateValueOverlay);

        this.#htmlObj += `<div class="create-buttons"><div class="create-buttons-box">
                            <button type="reset" id="btn-reset-${chapterType}" class="btn btn-nav-reset" >Zurücksetzen</button>`;

        if (modi === 'updateMode') {

            this.#htmlObj += `<button type="submit" id="btn-update-${chapterType}" class="btn btn-nav-update btn-action">Aktualisieren</button></div>`;
            this.#htmlObj += `<button type="submit" id="btn-back-${chapterType}" class="btn btn-nav-back btn-action ">Zurück zum Erstellen</button>`;


        } else {
            this.#htmlObj += `<button type="submit" id="btn-send-${chapterType}" class="btn btn-nav-send btn-action">Erstellen</button></div>`;
        }


        this.#htmlObj += `</div>
                         </form></div>
                         </section> </section>`;
        return this.#htmlObj;
    }


    /**
     * setzt eventhandle auf navigations links
     * @param event
     */
    #setEventOnLinks(event = null) {
        this.#navLeft = document.getElementById('nav-left-subchapter');
        if(this.#navLeft.children.length>0){
            let firstLink = this.#navLeft.firstChild.dataset.subchapterid;
            this.setActiveClass(firstLink);
        }

    }


    /**
     * färbt nav links blau bein anklicken
     * @param element
     */
    setActiveClass(element) {

        this.#removeAttributeActiveOnLink();
        // console.log(window.location.hash)
        // window.location.href = "#" + element;
        const links = document.getElementsByClassName('nav-link-subchapter-normMode');

        //beim wechseln von kapitel
        let start = Number(links[0].dataset.linkid) - 1;

        if (start !== 1) {
            element = element - start;
            start = 1;
        }
        for (let i = start - 1; i < links.length; i++) {

            if (element === i + 1) {
                links[i].style.color = 'white';
                links[i].parentElement.classList.add('active');
            }
        }
    }

    /**
     * Evetnhandler für die links in nav-left. hier wird allerdings auf veränderung in der url gehorcht
     * @param loadSubchapterById
     */
    addHandlerRender(loadSubchapterById) {
        window.addEventListener('hashchange', loadSubchapterById);
        window.addEventListener('load', loadSubchapterById);
    }

    //Todo :hier weitermachen aber vorher hochladen und emails verschicken
    // addHandlerRender(loadSubchapterById) {
    //     let subchaptersUL=document.getElementById('nav-left-subchapter')
    //     let listElements=subchaptersUL.getElementsByTagName('li');
    //     console.log('listelements',listElements.length)
    //     for (let i = 0; i <listElements.length ; i++) {
    //         listElements[i].addEventListener('click',loadSubchapterById)
    //     }
    // }


    /**
     * entfernt blauen gefärbten bereich vom nav link
     */
    #removeAttributeActiveOnLink() {
        const allLinks = document.querySelectorAll('.nav-left-links-subchapter-normMode');

        for (let i = 0; i < allLinks.length; i++) {

            const navLink = document.getElementsByClassName('nav-link-subchapter-normMode');

            navLink[i].style.color = "#444444FF";
            const navSpan = document.getElementsByClassName('nav-span-subchapter-normMode');

            if (navSpan[i].classList.contains('active')) {
                navSpan[i].classList.remove('active');
            }
        }

    }

    //togglet das anzeigen des navLeftContainers
    display(e) {
        this.#navLeftContainer.classList.toggle('showBlock');
    }

    //löscht den die nav-left-box
    #clear(chapterName = '') {

        let box = document.querySelector('#nav-left-box-subchapters');
        box.innerHTML = '';
        let box2 = document.querySelector('#nav-left-box-subchapters');


    }
}

export default new NavLeft();