import {loadSubchaptersForNav, loadChapterForNav} from "../controller.js";

/**
 * Autorin: Petra Tsesmetzi
 * Datum: 12.06.2023
 *
 * Die Klasse NavLeft generiert das Markup für die linksgerichtete Navigationsleiste
 *
 *
 */

class NavLeft {

    #navLeftWrapper = document.querySelector('#nav-left-wrapper');
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

    /**
     * initialisiert das Markup (hängt die htmlObjekte in die Container)
     * und setzt ein EventListener für das Markieren der Links in blau
     * @param start
     */
    async render(start) {
        if (start === 'init') {
            const markUpChapter = this.#generateMarkupDropDownChapter();
            this.#navLeftWrapper.insertAdjacentHTML('afterbegin', markUpChapter);
            // this.#activateCustomDropdown();

            const chapter = document.getElementById('chapter');
            this.subChapterObjects = await loadSubchaptersForNav(chapter.textContent);



            const markupBox = this.#generateMarkupBox();
            this.#navLeftWrapper.insertAdjacentHTML('beforeend', markupBox);
            let navLeftBox = document.getElementById('nav-left-box-subchapters');
            const markup = this.#generateMarkup(this.subChapterObjects);
            navLeftBox.insertAdjacentHTML('beforeend', markup);


            // const startLink = document.querySelector('#startLink');
            this.setActiveClass(1);
            this.#setEventOnLinks();



            let editSection = this.#generateMarkupForEditMode();
            this.#navLeftWrapper.insertAdjacentHTML('beforeend', editSection);

        }
    }
    renderInsert(editmode){

        this.#subchapterWrapper=document.querySelectorAll('.create-subchapter-wrapper');
        this.#subchapterHeading=document.querySelector('.nav-editmode-header-subchapter');
        this.#chapteDropdown=document.querySelector('.chapter-dropdown');
        console.log(  this.#subchapterHeading);
        this.#chapterWrapper=document.querySelector('.create-chapter-wrapper');
        console.log(this.#subchapterWrapper)
        if(editmode===true){
            console.log('ime editmode')
            this.#chapterWrapper.classList.remove('edit-section');
            this.#subchapterHeading.classList.remove('edit-section');
            this.#chapteDropdown.classList.add('edit-section');
            for (let i = 0; i < this.#subchapterWrapper.length; i++) {
                this.#subchapterWrapper[i].classList.remove('edit-section')
            }

        }else{
            this.#chapterWrapper.classList.add('edit-section');
            this.#subchapterHeading.classList.add('edit-section');
            this.#chapteDropdown.classList.remove('edit-section');
            for (let i = 0; i < this.#subchapterWrapper.length; i++) {
                this.#subchapterWrapper[i].classList.add('edit-section')
            }
        }


    }
    /**
     * setzt eventhandle auf navigations links
     * @param event
     */
    #setEventOnLinks(event = null) {
        console.log('setEventOnLinks',event)
        this.#navLeft = document.getElementById('nav-left-subchapter');
        let firstLink = this.#navLeft.firstChild.dataset.subchapterid;
        console.log('firstLink', firstLink)
        this.setActiveClass(firstLink)
    }



    #activateCustomDropdown() {
        let dropdowns = document.querySelectorAll('.custom-dropdown');
        console.log('dropdowns',dropdowns)
        dropdowns.forEach((dropdown, index) => {
            console.log('index',index)
            let containerSelect = dropdown.querySelector('.container-select');
            let selectedOption = dropdown.querySelector('.selected-option');
            let optionsList = dropdown.querySelector('.options');


            containerSelect.addEventListener('click', () => {
                optionsList.style.display = (optionsList.style.display === '' || optionsList.style.display === 'none') ? 'flex' : 'none';
            });


            optionsList.addEventListener('click', async (event) => {

                selectedOption.textContent = event.target.textContent;
                optionsList.style.display = 'none';

                if(index==0){
                    this.subChapterObjects = await loadSubchaptersForNav(selectedOption.textContent);
                    this.#clear();
                    const markup = this.#generateMarkup(this.subChapterObjects);

                    let box = document.querySelector('#nav-left-box-subchapters');
                    box.insertAdjacentHTML('beforeend', markup);
                    this.#setEventOnLinks();
                    console.log('custom')
                }
                this.addHandlerRenderChangeSubChapter()
            });

            window.addEventListener('click', (event) => {
                let clickedDropdown = event.target.closest('.custom-dropdown');
                if (!clickedDropdown) {
                    optionsList.style.display = 'none';

                }
            });
        });



    }

    /**
     * eventlistener um die subchapters anhand der kapitel zu laden
     * @param loadFormContentByChapter
     */
    addHandlerRenderChangeChapter(loadFormContentByChapter) {
        let optionsList = document.querySelector('.options');
        optionsList.addEventListener('click', function (e) {
            console.log('e', e)
            loadFormContentByChapter(e.target.innerText)
        });
    }

    /**
     * eventlister auf subchapter Links
     */
    addHandlerRenderChangeSubChapter() {
        this.#navLeft.addEventListener('click', (e) => {
            console.log('subchapterlinks evenlistener')
            console.log('e', e.target.dataset.linkid);

            if (typeof e != 'number' && e.target.dataset.linkid !== undefined) {
                e = Number(e.target.dataset.linkid);
                console.log(' this.#navLeft');
                this.setActiveClass(e);
            }
        });
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async addHandlerRenderChangCategory() {
        this.#navHeaderLinks = document.querySelectorAll('.nav-header-links');
        for (const e of this.#navHeaderLinks) {
            if (e.firstChild.classList.contains('active')) {

                let category = e.firstChild.id;

                this.#chapterObjects = await loadChapterForNav(category);
                let markup = this.#generateMarkupChapterEdit(this.#chapterObjects);
                let box = document.querySelector('#nav-left-box-subchapters');
                box.insertAdjacentHTML('beforebegin', markup);
            }

        }
        this.#activateCustomDropdown();

    }

    /**
     * erzeugt das markup für das kapitel dropdown menu
     * @returns {string}
     */
    #generateMarkupDropDownChapter() {

        this.#htmlObj = `<div class="custom-dropdown chapter-dropdown">
            <div class="container-select">
             <div id="chapter" class="selected-option">Javascript Fundamentals Part 1</div> 
             <div class="container-arrow"><ion-icon name="caret-down-outline"></ion-icon></div>
            </div>
              <ul class="options">
               <li>Javascript Fundamentals Part 1</li>
               <li>Javascript Fundamentals Part 2</li>
              </ul>
            </div>`;
        return this.#htmlObj;

    }


    /**
     * markup edit modus chapter
     * @param chapterObjects
     * @returns {string}
     */
    #generateMarkupChapterEdit(chapterObjects) {
        this.#htmlObj = `<section class="create-chapter-wrapper edit-section"><section id="nav-left-box-chapters">
        <h1 class="nav-editmode-header">Kaptiel Bearbeiten</h1>
        <ul id="nav-left-chapter">`;
        for (let i = 0; i < chapterObjects.length; i++) {
            this.#htmlObj += `<li  class="nav-left-links-chapters" data-chapterid=${chapterObjects[i].id}><span class="nav-left-link-container-chapters"><span class="nav-left-link-box-chapter"><span class="nav-span-chapter"><span data-linkid=${chapterObjects[i].id} class='nav-link-chapter' ${chapterObjects[i].id}">${chapterObjects[i].chapterName}</span></span></span><span class="edit-box-chapter nav-editmode"><ion-icon class="trash" name="trash-outline"></ion-icon><ion-icon class="update" name="create-outline"></ion-icon></span></li>`;
        }
        this.#htmlObj += ` </ul></section>`;
        this.#htmlObj +=this.#generateMarkupForEditMode()+`</section>`;
        return this.#htmlObj;
    }

    /**
     * markup box- für subchapter
     * @returns {string}
     */
    #generateMarkupBox() {
        this.#htmlObj = `<section id="nav-left-box-subchapters"></section>`;
        return this.#htmlObj;
    }

    /**
     * markup subchapter -normal mode
     * @returns {string}
     */
    #generateMarkup(subChapterObjects) {
        this.#htmlObj = ` <h1 class="nav-editmode-header-subchapter edit-section">Unterkapitel Berarbeiten</h1><ul id="nav-left-subchapter">`;
        for (let i = 0; i < subChapterObjects.length; i++) {
            if (subChapterObjects.id === 1) {
                this.#htmlObj += `<li  class="nav-left-links-subchapter" data-subchapterid=${subChapterObjects[i].id}><span id="startLink" class="nav-span-subchapter"><a data-linkid=${subChapterObjects[i].id} class='nav-link-subchapter' href="#${subChapterObjects[i].id}">${subChapterObjects[i].subchapterName}</a></span></li>`;
            } else {
                this.#htmlObj += `<li  class="nav-left-links-subchapter" data-subchapterid=${subChapterObjects[i].id}><span class="nav-left-link-container-subchapters "><span class="nav-left-link-box-subchapter"><span class="nav-span-subchapter"><a data-linkid=${subChapterObjects[i].id} class='nav-link-subchapter' href="#${subChapterObjects[i].id}">${subChapterObjects[i].subchapterName}</a></span></span><span class="edit-box-subchapter nav-editmode"><ion-icon class="trash" name="trash-outline"></ion-icon><ion-icon class="update" name="create-outline"></ion-icon></span></li>`;
            }
        }
        this.#htmlObj += ` </ul>`;
        return this.#htmlObj;

    }

    /**
     * generiert markup für den edetierbereich der subchapter
     * @returns {string}
     */
    #generateMarkupForEditMode() {
        this.#htmlObj = `<section class="create-subchapter-wrapper edit-section">
                         
                         <div class="create-subchapter-box">
                         <p>Unterkapitel eingeben: </p>
                         <input class="create-subchapter" type="text">
                         </div>`;



        this.#htmlObj += ` <p>Kapitel auswählen: </p><div class="custom-dropdown">
            <div class="container-select">
             <div id="chapter" class="selected-option">Javascript Fundamentals Part 1</div> 
             <div class="container-arrow"><ion-icon name="caret-down-outline"></ion-icon></div>
            </div>
              <ul class="options">
               <li>Javascript Fundamentals Part 1</li>
               <li>Javascript Fundamentals Part 2</li>
              </ul>
            </div>`;


        this.#htmlObj+= `<div class="create-buttons">
                             <button class="btn btn-nav-reset">Zurücksetzen</button>
                             <button class="btn btn-nav-send">Absenden</button>
                         </div>
                         <div>
                             <button class="btn btn-neu">neu</button>
                         </div>
                         </section>`;
        return this.#htmlObj;
    }

    /**
     * färbt nav links blau bein anklicken
     * @param element
     */
    setActiveClass(element) {
        console.log('setActiveClass',element)
        this.#removeAttributeActiveOnLink();
        window.location.href = "#" + element;
        const links = document.getElementsByClassName('nav-link-subchapter');
        //beim wechseln von kapitel
        let start = Number(links[0].dataset.linkid) - 1;
        console.log('start',start)
        if (start !== 1) {
            element = element - start;
            start = 1;
        }
        for (let i = start - 1; i < links.length; i++) {
            console.log('for',element)
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
    #clear() {
        // let box=document.querySelector('#nav-left-box');
        // this.#navLeftWrapper.removeChild(box);
        //
        let box = document.querySelector('#nav-left-box-subchapters');
        let subchapeterEditheader=document.querySelector('.nav-editmode-header-subchapter');
        console.log(subchapeterEditheader)
        let navLeft = document.querySelector('#nav-left-subchapter');
        box.removeChild(subchapeterEditheader);
        box.removeChild(navLeft);


    }
}

export default new NavLeft();