import {loadSubchaptersForNav} from "../controller.js";

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

    #navLeft;
    #navLeftbox;
    #htmlObj = '';
    #id;
    subChapterObjects;
#selectedOption;
    #optionsList;

    /**
     * initialisiert das Markup (hängt die htmlObjekte in die Container)
     * und setzt ein EventListener für das Markieren der Links in blau
     * @param start
     */
    async render(start) {
        if (start === 'init') {
            const markUpChapter = this.#generateMarkupChapter();
            this.#navLeftWrapper.insertAdjacentHTML('afterbegin', markUpChapter);
            this.#activateCustomDropdown();
            const chapter = document.getElementById('chapter');


            this.subChapterObjects = await loadSubchaptersForNav(chapter.textContent);




            const markupBox = this.#generateMarkupBox();
            this.#navLeftWrapper.insertAdjacentHTML('beforeend', markupBox);
            let navLeftBox=document.getElementById('nav-left-box');
            const markup = this.#generateMarkup( this.subChapterObjects);
            navLeftBox.insertAdjacentHTML('beforeend', markup);




            const startLink = document.querySelector('#startLink');
            this.setActiveClass(1);
            this.#setEventOnLinks();
            console.log('render');

            //todo: durch einen eventlister aktiveren raus hier oder stehen lassen dafür diplay none verwenden
            let editSection=this.#generateMarkupForEditMode();
            console.log('render2');
            this.#navLeftWrapper.insertAdjacentHTML('beforeend',editSection);
        }
    }

    /**
     * setzt eventhandle auf navigations links
     * @param event
     */
    #setEventOnLinks(event=null){
        this.#navLeft = document.getElementById('nav-left');
        let firstLink=this.#navLeft.firstChild.dataset.subchapterid;
        this.setActiveClass(firstLink)
        this.#navLeft.addEventListener('click', (e)=>{
            if (typeof e != 'number') {
                e = Number(e.target.dataset.linkid);
                this.setActiveClass(e);
            }
        });
    }

    /**
     * erzeugt das markup für das kapitel dropdown menu
     * @returns {string}
     */
    #generateMarkupChapter() {

        this.#htmlObj = `<div class="custom-dropdown">
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
     * custom dropdown
     * setzt eventlistener auf 'optionen'
     */
    #activateCustomDropdown() {
        const dropdown = document.querySelector('.custom-dropdown');
        const containerSelect = document.querySelector('.container-select');
        this.#selectedOption = document.querySelector('.selected-option')
        this.#optionsList = dropdown.querySelector('.options');

        containerSelect.addEventListener('click', () => {
            this.#optionsList.style.display = ( this.#optionsList.style.display === '' ||  this.#optionsList.style.display === 'none') ? 'flex' : 'none';
        });

        this.#optionsList.addEventListener('click', async(event) => {
            this.#selectedOption.textContent = event.target.textContent;
            this.#optionsList.style.display = 'none';

            this.subChapterObjects = await loadSubchaptersForNav(this.#selectedOption.textContent);


            this.#clear();
            const markup = this.#generateMarkup( this.subChapterObjects);
            // this.#navLeftWrapper.insertAdjacentHTML('beforeend', markup);
            let box=document.querySelector('#nav-left-box');
            box.insertAdjacentHTML('beforeend', markup);
            this.#setEventOnLinks();


        });

        window.addEventListener("click", (event) => {
            if(event.target.id!=='chapter'){
                this.#optionsList.style.display = 'none';
                console.log('window click')
            }
        });


    }

    /**
     * eventlistener um die subchapters anhand der kapitel zu laden
     * @param loadFormContentByChapter
     */
    addHandlerRenderChangeChapter(loadFormContentByChapter){
        this.#optionsList.addEventListener('click', function(e){
            console.log('e',e)
            loadFormContentByChapter(e.target.innerText)
        });
    }

    #generateMarkupBox(){
        this.#htmlObj = `<section id="nav-left-box"></section>`;
        return this.#htmlObj;
    }
    /**
     * string für Links in nav-left
     * @returns {string}
     */
    #generateMarkup(subChapterObjects) {


        this.#htmlObj = ` <ul id="nav-left">`;
        for (let i = 0; i < subChapterObjects.length; i++) {
            if (subChapterObjects.id === 1) {
                this.#htmlObj += `<li  class="nav-left-links" data-subchapterid=${subChapterObjects[i].id}><span id="startLink" class="nav-span"><a data-linkid=${subChapterObjects[i].id} class='nav-link' href="#${subChapterObjects[i].id}">${subChapterObjects[i].subchapterName}</a></span></li>`;
            } else {
                 this.#htmlObj += `<li  class="nav-left-links" data-subchapterid=${subChapterObjects[i].id}><span class="nav-left-link-container"><span class="nav-left-link-box"><span class="nav-span"><a data-linkid=${subChapterObjects[i].id} class='nav-link' href="#${subChapterObjects[i].id}">${subChapterObjects[i].subchapterName}</a></span></span><span class="subchapter-edit-box nav-editmode"><ion-icon class="trash" name="trash-outline"></ion-icon><ion-icon class="update" name="create-outline"></ion-icon></span></li>`;

            }
        }
        this.#htmlObj += ` </ul>`;
        //this.#htmlObj += `<section class="createSubchapter-wrapper nav-editmode"><div class="createSubchapter-box"><input class="createSubchapter" type="text"></div> <div class="create-buttons"><button class="btn btn-nav-reset">Zurücksetzen</button><button class="btn btn-nav-send">Absenden</button></div><div><button class="btn btn-neu">neu</button></div></section>`;
        return this.#htmlObj;

    }

    /**
     * generiert markup für den edetierbereich der subchapter
     * @returns {string}
     */
    #generateMarkupForEditMode() {
        this.#htmlObj = `<section class="create-subchapter-wrapper nav-editmode"><div class="create-subchapter-box"><input class="create-subchapter" type="text"></div> <div class="create-buttons"><button class="btn btn-nav-reset">Zurücksetzen</button><button class="btn btn-nav-send">Absenden</button></div><div><button class="btn btn-neu">neu</button></div></section>`;
        return this.#htmlObj;
    }

    /**
     * färbt nav links blau bein anklicken
     * @param element
     */
    setActiveClass(element) {
        this.#removeAttributeActiveOnLink();
        window.location.href = "#" + element;
        const links = document.getElementsByClassName('nav-link');
        //beim wechseln von kapitel
        let start=Number(links[0].dataset.linkid)-1;
        if(start!==1) {
            element=element-start;
            start = 1;
        }
        for (let i = start-1; i < links.length; i++) {
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
        const allLinks = document.querySelectorAll('.nav-left-links');

        // allLinks.forEach((link) => {
        //     // const navLink=document.getElementsByClassName('.nav-link');
        //     // navLink.style.color= "#444444FF";
        //     link.firstChild.firstChild.firstChild.firstChild.style.color = "#444444FF";
        //     console.log( 'link---------------------',link.firstChild.firstChild.firstChild);
        //     if (link.firstChild.firstChild.firstChild.classList.contains('active')) {
        //         link.firstChild.firstChild.firstChild.classList.remove('active');
        //     }
        // })
        for (let i = 0; i < allLinks.length; i++) {
            const navLink = document.getElementsByClassName('nav-link');

            navLink[i].style.color= "#444444FF";
            const navSpan=document.getElementsByClassName('nav-span');

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
        let box=document.querySelector('#nav-left-box');
        let navLeft=document.querySelector('#nav-left');
        box.removeChild(navLeft);


    }
}

export default new NavLeft();