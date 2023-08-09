import {
    loadSubchaptersForNav,
    loadChapterForNav,
    laodAllChaptersForNav,
    laodAllSubChaptersForNav
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
            console.log('render-editmode', editmode)
            this.#editMode = editmode;
            //dropdowwn einhängen
            const markUpChapter = this.#generateMarkupDropDownChapter('chapter',chapters);
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

    // renderEditMode(editmode) {
    //     this.#editMode = editmode;
    //     console.log('editmode', this.#editMode)
    //     this.#subchapterWrapper = document.querySelectorAll('.create-edit-wrapper');
    //     this.#subchapterHeading = document.querySelector('.nav-editmode-header-subchapter');
    //
    //
    //     this.#chapterWrapper = document.querySelector('.create-chapter-wrapper');
    //     this.#editBoxSubchapter = document.querySelectorAll('.edit-box-subchapter');
    //     this.#chapteDropdown = document.querySelector('.chapter-dropdown');
    //
    //     //Todo:nachheranschauen wie gut es funzt
    //     // this.#customDropdownWrapper=document.querySelector('.custom-dropdown-wrapper')
    //
    //     if (this.#editMode === true) {
    //         console.log('chapterWraper', this.#chapterWrapper)
    //         this.#chapterWrapper.classList.remove('edit-section');
    //
    //         this.#subchapterHeading.classList.remove('edit-section');
    //         this.#chapteDropdown.classList.add('edit-section');
    //         // this.#customDropdownWrapper.classList.add('edit-section');
    //         for (let i = 0; i < this.#subchapterWrapper.length; i++) {
    //             this.#subchapterWrapper[i].classList.remove('edit-section');
    //
    //         }
    //         this.#editBoxSubchapter.forEach(element => {
    //             element.classList.remove('edit-section');
    //         })
    //
    //     } else {
    //         this.#chapterWrapper.classList.add('edit-section');
    //         this.#subchapterHeading.classList.add('edit-section');
    //         this.#chapteDropdown.classList.remove('edit-section');
    //         // this.#customDropdownWrapper.classList.remove('edit-section');
    //         for (let i = 0; i < this.#subchapterWrapper.length; i++) {
    //             this.#subchapterWrapper[i].classList.add('edit-section');
    //         }
    //         this.#editBoxSubchapter.forEach(element => {
    //             element.classList.add('edit-section');
    //         })
    //     }
    //
    //
    // }
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
        console.log('renderChapterDropDown -kategoriewechsel',chapters)
        const customDropdownWrapper = document.querySelectorAll('.custom-dropdown-wrapper');
        //altes Dropdown löschen
        customDropdownWrapper[0].innerHTML = '';

        const markUpChapter = this.#generateMarkupDropDownChapter('chapter',chapters);

        customDropdownWrapper[0].insertAdjacentHTML('afterbegin', markUpChapter);
        console.log('customDropdownWrapper[0]', customDropdownWrapper[0])
        this.#activateCustomDropdown();

        //vom div anstatt von der variablen, 'damit kein kapitel vorhanden' mit abgedeckt wird
        const chapterName = chapters.length > 0 ? chapters[0].chapterName : 'Kein Kapitel vorhanden';

        console.log('chapterNameExists', chapterName)

        await this.#changeSubChaptersByChapter(chapterName);

    }


    #activateCustomDropdown() {
        let dropdowns = document.querySelectorAll('.custom-dropdown');

        dropdowns.forEach((dropdown, index) => {

            let containerSelect = dropdown.querySelector('.container-select');
            let selectedOption = dropdown.querySelector('.selected-option');
            let optionsList = dropdown.querySelector('.options');


            containerSelect.addEventListener('click', () => {
                optionsList.style.display = (optionsList.style.display === '' || optionsList.style.display === 'none') ? 'flex' : 'none';
            });


            optionsList.addEventListener('click', async (event) => {

                selectedOption.textContent = event.target.textContent;
                optionsList.style.display = 'none';

                if (index == 0) {
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

    async #changeSubChaptersByChapter(chapterName) {



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
        console.log(this.#categories)
        console.log(this.#chapters)
        console.log(this.#subchapters)
    }

    /**
     * lädt alle Kapitelfür den Editmode
     * @returns {Promise<void>}
     */
    async loadAllChaptersForEditMode() {
        this.#chapterObjects = await laodAllChaptersForNav();
        console.log('this.#chapterObjects ', this.#chapterObjects)

        let markup = `
            ${this.#generateMarkupChapterTypeEdit("chapter", this.#chapters)}
            ${this.#generateMarkupChapterTypeEdit("subchapter", this.#subchapters)}`;


        let wrapper=document.getElementById('edit-section-wrapper');
        wrapper.insertAdjacentHTML('beforeend',markup);
        this.#activateCustomDropdown();
    }

    /**
     * erstellt entweder ein Liste mit Chapter oder Subchapter
     * @param chapterType
     * @param obj
     * @returns {string}
     */
//todo: er findet den namen nicht deswegen undefined also wieder anpassen und achtung die methode wird ncoh von wo anders aufgerufen auch anpassen
    #generateMarkupChapterTypeEdit(chapterType, obj) {
        console.log('chapterType',chapterType)
        let objName = chapterType === "subchapter" ? 'subchapterName' : 'chapterName';
        console.log('objName',objName)
        let chapterHeading = chapterType === 'chapter' ? 'Kapitel Bearbeiten' : 'UnterKapiel Bearbeiten';
        console.log('generateMarkupChapterTypeEdit',this.#categories);
        console.log('generateMarkupChapterTypeEdit',this.#chapters);
        let dropDownObj=chapterType === "subchapter" ? this.#chapters : this.#categories;
        console.log('##############################################################dropDownObj',dropDownObj)
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
        console.log('chapterType',chapterType);
        console.log('dropDownObj',dropDownObj);
        this.#htmlObj+=this.#generateMarkupDropDownChapter(chapterType,dropDownObj);
        // this.#htmlObj += `</p><div class="custom-dropdown">
        //     <div class="container-select">
        //      <div id="chapter" class="selected-option">Javascript Fundamentals Part 1</div>
        //      <div class="container-arrow"><ion-icon name="caret-down-outline"></ion-icon></div>
        //     </div>
        //       <ul class="options">
        //        <li>Javascript Fundamentals Part 1</li>
        //        <li>Javascript Fundamentals Part 2</li>
        //       </ul>
        //     </div>`;
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
    #generateMarkupDropDownChapter(chapterType,obj) {
        console.log('----------------------------------chapterType',chapterType)
        console.log('---------------------------------obj',obj)
        let objName = chapterType === "subchapter" ? 'chapterName' : 'categoryName';
        let chaptername = obj.length > 0 ? obj[0].chapterName : 'Kein Kapitel vorhanden';
        console.log('---------------------------------obj-erstes',obj[0][objName])

        // let objName = chapterType === "subchapter" ? 'chapterName' : 'categoryName';
        if (obj.length > 0) {
            this.#htmlObj = `<div class="custom-dropdown">
            <div class="container-select">
             <div id="chapter" class="selected-option">${chaptername}</div> 
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

        return this.#htmlObj;

    }
    // #generateMarkupDropDownChapter(chapters) {
    //
    //     let chaptername = chapters.length > 0 ? chapters[0].chapterName : 'Kein Kapitel vorhanden';
    //
    //     if (chapters.length > 0) {
    //         this.#htmlObj = `<section class="custom-dropdown-wrapper"><div class="custom-dropdown chapter-dropdown">
    //         <div class="container-select">
    //          <div id="chapter" class="selected-option">${chaptername}</div>
    //          <div class="container-arrow"><ion-icon name="caret-down-outline"></ion-icon></div>
    //         </div>
    //           <ul class="options">`;
    //
    //         for (let i = 0; i < chapters.length; i++) {
    //             this.#htmlObj += `<li>${chapters[i].chapterName}</li>`;
    //         }
    //
    //         this.#htmlObj += `</ul>
    //         </div></section>`;
    //     } else {
    //         this.#htmlObj = `<h1 class="error">${chaptername}</h1>`
    //     }
    //     console.log('htmlobj',this.#htmlObj);
    //     return this.#htmlObj;
    //
    // }




    /**
     * markup subchapter -normal mode
     * @returns {string}
     */
    #generateMarkup(subChapterObjects) {
        console.log('+++++++++++++++++++++++++++++++++++++++++generateMarkup');
        this.#htmlObj = `<ul id="nav-left-subchapter">`;
        console.log('generateMarkup', this.#htmlObj);
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
        console.log('event', event)
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
        console.log('altes zeugs gelöscht')

    }
}

export default new NavLeft();