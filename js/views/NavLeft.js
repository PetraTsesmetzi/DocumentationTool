import {
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

    #chapterObjects;
    #subchapterWrapper;
    #chapterWrapper;
    #subchapterHeading;
    #chapteDropdown;
    #editBoxSubchapter;
    #editMode;
    #categories;
    #chapters;
    #subchapters;
  #counter=0;


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
            const markUpChapter =`<section class="custom-dropdown-wrapper">`+ this.#generateMarkupDropDownChapter('nonEdit','chapter',chapters)+`</section>`;
            this.#nonEditWrapper.insertAdjacentHTML('beforeend', markUpChapter);


            //intiale subchapter laden anhand des chapters
            const chapter = document.getElementById('chapter');
            this.subChapterObjects = await loadSubchaptersForNav(chapter.textContent);


            //subchapters als liste einhängen
            const markupBox = `<section id="nav-left-box-subchapters"></section>`;
            this.#nonEditWrapper.insertAdjacentHTML('beforeend', markupBox);
            let navLeftBox = document.getElementById('nav-left-box-subchapters');
            const markup = this.#generateMarkup(this.subChapterObjects);
            navLeftBox.insertAdjacentHTML('beforeend', markup);


            this.setActiveClass(1);
            this.#setEventOnLinks('render');

            // let editSection = this.#generateMarkupForEditMode('subchapter', this.#chapterObjects);
            // this.#nonEditWrapper.insertAdjacentHTML('beforeend', editSection);

        }
    }


    renderEditMode(editmode) {
        this.#editMode = editmode;
        console.log('render-editmode', editmode)
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


    /**
     * löscht altes Dropdown Menü wenn man auf ein Kaptegorie link drückt
     * @param chapters
     */
    async renderChapterDropDown(chapters) {
        console.log('renderChapterDropDown')
        console.log('renderChapterDropDown -kategoriewechsel',chapters)
        const customDropdownWrapper = document.querySelectorAll('.custom-dropdown-wrapper');
        //altes Dropdown löschen
        customDropdownWrapper[0].innerHTML = '';

        const markUpChapter = this.#generateMarkupDropDownChapter('nonEdit','chapter',chapters);

        customDropdownWrapper[0].insertAdjacentHTML('afterbegin', markUpChapter);
        console.log('customDropdownWrapper[0]', customDropdownWrapper[0])

        this.#activateCustomDropdown();

        //vom div anstatt von der variablen, 'damit kein kapitel vorhanden' mit abgedeckt wird
        const chapterName = chapters.length > 0 ? chapters[0].chapterName : 'Kein Kapitel vorhanden';

        console.log('chapterNameExists', chapterName)

        await this.#changeSubChaptersByChapter(chapterName);

    }


    #activateCustomDropdown() {
        console.log('activate')
        let dropdowns = document.querySelectorAll('.custom-dropdown');

        dropdowns.forEach((dropdown, index) => {

            let containerSelect = dropdown.querySelector('.container-select');
            let selectedOption = dropdown.querySelector('.selected-option');
            let optionsList = dropdown.querySelector('.options');



            // containerSelect.addEventListener('click', () => {
            //     console.log('vor optionsList.style.display',optionsList.style.display)
            //     optionsList.style.display = (optionsList.style.display === '' || optionsList.style.display === 'none') ? 'block' : 'none';
            //     console.log('nach optionsList.style.display',optionsList.style.display)
            // });
            containerSelect.addEventListener('click',this.#openDropDown);


            optionsList.addEventListener('click', async (event) => {

                selectedOption.textContent = event.target.textContent;
                optionsList.style.display = 'none';

                if (index == 0) {
                    console.log('nur wenn index 0', index)
                    await this.#changeSubChaptersByChapter(selectedOption.textContent);
                    // this.subChapterObjects = await loadSubchaptersForNav(selectedOption.textContent);
                    // console.log('imdropi',this.subChapterObjects)
                    // this.#clear();
                    // const markup = this.#generateMarkup(this.subChapterObjects);
                    //
                    // let box = document.querySelector('#nav-left-box-subchapters');
                    // box.insertAdjacentHTML('beforeend', markup);
                    // this.#setEventOnLinks('dropdown');
                }
                this.addHandlerRenderChangeSubChapter();
            });

            window.addEventListener('click', (event) => {
                let clickedDropdown = event.target.closest('.custom-dropdown');
                if (!clickedDropdown) {
                    optionsList.style.display = 'none';

                }
            });
        });


    }
    #openDropDown(){
        let optionsList = document.querySelector('.options');
        console.log('vor optionsList.style.display',optionsList.style.display)
        optionsList.style.display = (optionsList.style.display === '' || optionsList.style.display === 'none') ? 'block' : 'none';
        console.log('nach optionsList.style.display',optionsList.style.display)
    }

    async #changeSubChaptersByChapter(chapterName) {

        console.log('chapterName: ',chapterName)

        this.#clear(chapterName);
        let markup = '';
        if (chapterName === 'Kein Kapitel vorhanden') {
            console.log('keen kapitel')

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
        console.log('loadAllChaptersForEditMode')
        // this.#chapterObjects = await laodAllChaptersForNav();


        let markup = `
            ${this.#generateMarkupChapterTypeEdit("chapter", this.#chapters)}
            ${this.#generateMarkupChapterTypeEdit("subchapter", this.#subchapters)}`;


        let wrapper=document.getElementById('edit-section-wrapper');
        wrapper.insertAdjacentHTML('beforeend',markup);

        //evenlister löschen, da ihm edit modus er 2 mal aufgerufen wurde
        let containerSelect = document.querySelector('.container-select');
        containerSelect.removeEventListener('click',this.#openDropDown);
        this.#activateCustomDropdown();
    }

    /**
     * erstellt entweder ein Liste mit Chapter oder Subchapter
     * @param chapterType
     * @param obj
     * @returns {string}
     */

    #generateMarkupChapterTypeEdit(chapterType, obj) {

        let objName = chapterType === "subchapter" ? 'subchapterName' : 'chapterName';

        let chapterHeading = chapterType === 'chapter' ? 'Kapitel Bearbeiten' : 'UnterKapiel Bearbeiten';

        let dropDownObj=chapterType === "subchapter" ? this.#chapters : this.#categories;

        this.#htmlObj = `<section class="create-chapter-wrapper "><section id="nav-left-box-chapters">
      
        <h1 class="nav-editmode-header">${chapterHeading}</h1>
        <ul id="nav-left-chapter">`;
        for (let i = 0; i < obj.length; i++) {
            this.#htmlObj += `<li  class="nav-left-links-chapters" data-chapterid=${obj[i].id}><span class="nav-left-link-container-chapters"><span class="nav-left-link-box-chapter"><span class="nav-span-chapter"><span data-linkid=${obj[i].id} class='nav-link-chapter' ${obj[i].id}">${obj[i][objName]}</span></span></span><span class="edit-box-chapter nav-editmode"><ion-icon class="trash" name="trash-outline"></ion-icon><ion-icon class="update" name="create-outline"></ion-icon></span></li>`;
        }

        this.#htmlObj += ` </ul></section>`;
        this.#htmlObj += `<section class="create-edit-wrapper ">
                         <h1>Neu erstellen</h1>
                         <div class="create-subchapter-box">
                         <p>`;
        this.#htmlObj += chapterType === 'chapter' ? "Kapitel eingeben:" : "Unterkapitel eingeben:"
        this.#htmlObj += `</p>
                         <input class="create-subchapter" type="text">
                         </div>`;
        this.#htmlObj += ` <p>`;
        this.#htmlObj += chapterType === 'chapter' ? "Kategorie auswählen:" : "Kapitel auswählen:"

        this.#htmlObj+=this.#generateMarkupDropDownChapter('editMode',chapterType,dropDownObj);

        this.#htmlObj += `<div class="create-buttons">
                             <button class="btn btn-nav-reset">Zurücksetzen</button>
                             <button class="btn btn-nav-send">Absenden</button>
                         </div>
                         <div>
                             <button class="btn btn-neu">neu</button>
                         </div>
                         </section> </section>`;
        return this.#htmlObj;
    }



    /**
     * erzeugt das markup für das kapitel dropdown menu
     * @returns {string}
     */
    #generateMarkupDropDownChapter(mode,chapterType,obj) {

        let objName;
        let chaptername;
        if(mode==='nonEdit'){

            objName ='chapterName';
            chaptername = obj.length > 0 ? obj[0].chapterName : 'Kein Kapitel vorhanden';

        }

        if(mode==='editMode'){
            objName = chapterType === "subchapter" ? 'chapterName' : 'categoryName';
            chaptername = obj.length > 0 ? obj[0][objName]: 'Kein Kapitel vorhanden';
        }


        // let objName = chapterType === "subchapter" ? 'chapterName' : 'categoryName';
        if (obj.length > 0) {
            this.#htmlObj = `<div class="custom-dropdown">
            <div class="container-select">`;

            this.#htmlObj += ` <div id="chapter" class="selected-option">${chaptername}</div> 
             <div class="container-arrow"><ion-icon name="caret-down-outline"></ion-icon></div>
            </div>
              <ul class="options">`;

            for (let i = 0; i < obj.length; i++) {
                this.#htmlObj += `<li>${obj[i][objName]}</li>`;
            }

            this.#htmlObj += `</ul>
            </div>`;
        } else {
            this.#htmlObj = `<h1 class="error">${chaptername}</h1>`
        }
        console.log('generateMarkupDropDownChapter')
        // this.#activateCustomDropdown();
        return this.#htmlObj;

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


    /**
     * setzt eventhandle auf navigations links
     * @param event
     */
    #setEventOnLinks(event = null) {

        this.#navLeft = document.getElementById('nav-left-subchapter');

        let firstLink = this.#navLeft.firstChild.dataset.subchapterid;

        this.setActiveClass(firstLink)
    }


    /**
     * färbt nav links blau bein anklicken
     * @param element
     */
    setActiveClass(element) {

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
        for (let i = 0; i < allLinks.length; i++) {
            const navLink = document.getElementsByClassName('nav-link-subchapter');

            navLink[i].style.color = "#444444FF";
            const navSpan = document.getElementsByClassName('nav-span-subchapter');

            if (navSpan[i].classList.contains('active')) {
                navSpan[i].classList.remove('active');
            }
        }

    }

    display(e) {
        this.#navLeftContainer.classList.toggle('showBlock');
    }

    //löscht den die nav-left-box
    #clear(chapterName = '') {
        console.log('chaptername', chapterName)
        let box = document.querySelector('#nav-left-box-subchapters');
        box.innerHTML = '';
        let box2 = document.querySelector('#nav-left-box-subchapters');
        console.log('die box sollte leer sein box2',box2)
        console.log('altes zeugs gelöscht')

    }
}

export default new NavLeft();