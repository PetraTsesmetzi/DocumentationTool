import {
    createAndEditSubchapter,
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
    #navLeft;
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
            console.log('render: ')

            // this.setActiveClass(2);
            this.#setEventOnLinks('render');

            this.#activateCustomDropdown('.chapterNorm-dropdown', '.chapterNorm-container', '.chapterNorm-selected', '.chapterNorm-options');


        }
    }

    /**
     * markup subchapter -normal mode
     * @returns {string}
     */
    #generateMarkup(subChapterObjects) {
        this.#htmlObj = `<ul id="nav-left-subchapter">`;
        for (let i = 0; i < subChapterObjects.length; i++) {
            if (subChapterObjects.id === 1) {
                this.#htmlObj += `<li  class="nav-left-links-subchapter" data-subchapterid=${subChapterObjects[i].id}><span id="startLink" class="nav-span-subchapter"><a data-linkid=${subChapterObjects[i].id} class='nav-link-subchapter' href="#${subChapterObjects[i].id}">${subChapterObjects[i].subchapterName}</a></span></li>`;
            } else {
                this.#htmlObj += `<li  class="nav-left-links-subchapter" data-subchapterid=${subChapterObjects[i].id}><span class="nav-left-link-container-subchapters "><span class="nav-left-link-box-subchapter"><span class="nav-span-subchapter"><a data-linkid=${subChapterObjects[i].id} class='nav-link-subchapter' href="#${subChapterObjects[i].id}">${subChapterObjects[i].subchapterName}</a></span></span><span class="edit-box-subchapter edit-section"><ion-icon class="trash" name="trash-outline"></ion-icon><ion-icon class="update" name="create-outline"></ion-icon></span></li>`;
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
        if (chapterName !=='Kein Kapitel vorhanden') {
            this.#activateCustomDropdown('.chapterNorm-dropdown', '.chapterNorm-container', '.chapterNorm-selected', '.chapterNorm-options');
        }


        await this.#changeSubChaptersByChapter(chapterName);

    }

    /**
     * erzeugt das markup für das kapitel dropdown menu
     * @returns {string}
     */
    #generateMarkupDropDownChapter(className, mode, chapterType, obj, name = '', modi = null, updateValueOverlay = null) {
        // console.log('generateMarkupDropDownChapter.............className..........',className);
        // console.log('generateMarkupDropDownChapter.............mode................',mode)
        // console.log('generateMarkupDropDownChapter.............chapterType..........',chapterType)
        // console.log('generateMarkupDropDownChapter.............obj..................',obj)
        // console.log('generateMarkupDropDownChapter.............name.................',name)
        // console.log('generateMarkupDropDownChapter.............modi..................',modi)
        // console.log('generateMarkupDropDownChapter.............updateValueOverlay....',updateValueOverlay)


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
            } else if(modi === 'refresh' || modi===null) {

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
            this.#htmlObj = `<h1 class="error">${chaptername}</h1>`
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


            markup = `<section id="nav-left-box-subchapters"><h1 class="nav-editmode-header-subchapter edit-section">Unterkapitel Berarbeiten</h1><h1 class="error">Kein Unterkapitel vorhanden</h1><ul id="nav-left-subchapter"></ul></section>`;
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
        this.#btnChapter.addEventListener('submit', function(event) {
            console.log('kapitel erstellen',event)
            event.preventDefault();
            let whichBtnWasPressed=event.submitter.innerText;
            createAndEditChapter.call(this,event, whichBtnWasPressed);
        }.bind(this));
    }

    /**
     * Eventhandler auf submit für createSubchapter(Erstellen)
     * @param createAndEditSubchapter
     */
    addHandlerNewSubchapter(createAndEditSubchapter) {

        this.#btnSubchapter = document.getElementById('subchapter-form');
        this.#btnSubchapter.addEventListener('submit', function(event) {
            event.preventDefault();
            let whichBtnWasPressed=event.submitter.innerText;
            createAndEditSubchapter.call(this,event, whichBtnWasPressed);
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
        console.log('changesub');
        this.#navLeft.addEventListener('click', (e) => {

            if (typeof e != 'number' && e.target.dataset.linkid !== undefined) {
                e = Number(e.target.dataset.linkid);
                console.log('e',e)
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
    async loadAllChaptersForEditMode( name = '', modi,subChapterName=null,toUpdateChapterName=null) {

        let wrapper = document.getElementById('edit-section-wrapper');
        wrapper.innerHTML = '';
        if (modi === 'refresh') {

            this.#btnSubchapter.removeEventListener('submit', createAndEditSubchapter);
            this.#subchaptersUl.removeEventListener('submit', createAndEditSubchapter);
            // this.#btnChapter.removeEventListener('submit', createAndEditSubchapter);
            // this.#chaptersUl.removeEventListener('submit', createAndEditSubchapter);
        }
        // if (modi === 'updateMode') {
        //     modi = 'updateMode';
        //     updateValue = subChapterName;
        //     updateValueOverlay = toUpdateChapterName;
        // }
        let markup = `
            ${this.#generateMarkupChapterTypeEdit("chapter", this.#chapters, name, modi, subChapterName, toUpdateChapterName)}
            ${this.#generateMarkupChapterTypeEdit("subchapter", this.#subchapters, name, modi, subChapterName, toUpdateChapterName)}`;


        wrapper.insertAdjacentHTML('beforeend', markup);


        this.#activateCustomDropdown('.categories-dropdown', '.categories-container', '.categories-selected', '.categories-options');
        this.#activateCustomDropdown('.chapterEdit-dropdown', '.chapterEdit-container', '.chapterEdit-selected', '.chapterEdit-options');
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
        this.#htmlObj = `<section class="create-chapter-wrapper "><section id="nav-left-box-chapters">
      
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
        console.log('event: ',event)
        this.#navLeft = document.getElementById('nav-left-subchapter');

        let firstLink = this.#navLeft.firstChild.dataset.subchapterid;

        this.setActiveClass(firstLink)
    }


    /**
     * färbt nav links blau bein anklicken
     * @param element
     */
    setActiveClass(element) {
        console.log('element: ',element)
        this.#removeAttributeActiveOnLink();
        window.location.href = "#" + element;
        const links = document.getElementsByClassName('nav-link-subchapter');

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

    /**
     * entfernt blauen gefärbten bereich vom nav link
     */
    #removeAttributeActiveOnLink() {
        const allLinks = document.querySelectorAll('.nav-left-links-subchapter');
        // console.log('allLinks',allLinks)
        for (let i = 0; i < allLinks.length; i++) {
            console.log('allLinks',allLinks[i])
            const navLink = document.getElementsByClassName('nav-link-subchapter');
            // console.log('navLinks',navLink.length)
            navLink[i].style.color = "#444444FF";
            const navSpan = document.getElementsByClassName('nav-span-subchapter');
            // console.log('navSpan',navSpan.length)
            // console.log('span',navSpan[i])
            // if (navSpan[i].classList.contains('active')) {
            //     navSpan[i].classList.remove('active');
            // }
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