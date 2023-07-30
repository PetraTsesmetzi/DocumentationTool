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



            const markup = this.#generateMarkup( this.subChapterObjects);
            this.#navLeftWrapper.insertAdjacentHTML('beforeend', markup);
            // this.#navLeft = document.getElementById('nav-left');
            const startLink = document.querySelector('#startLink');
            this.setActiveClass(1);
            this.#setEventOnLinks();

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
            this.#navLeftWrapper.insertAdjacentHTML('beforeend', markup);
            this.#setEventOnLinks();


        });

        window.addEventListener("click", (event) => {
            if(event.target.id!=='chapter'){
                this.#optionsList.style.display = 'none';
            }
        });


    }

    addHandlerRenderChangeChapter(loadFormContentByChapter){
        console.log('activate eventlistenern')

        this.#optionsList.addEventListener('click', function(e){
            console.log('e',e)
            loadFormContentByChapter(e.target.innerText)
        });
    }

    /**
     * string für Links in nav-left
     * @returns {string}
     */
    #generateMarkup(subChapterObjects) {


        this.#htmlObj = `<section id="nav-left-box"> <ul id="nav-left">`;
        for (let i = 0; i < subChapterObjects.length; i++) {
            if (subChapterObjects.id === 1) {
                this.#htmlObj += `<li  class="nav-left-links" data-subchapterid=${subChapterObjects[i].id}><span id="startLink" class="nav-span"><a data-linkid=${subChapterObjects[i].id} class='nav-link' href="#${subChapterObjects[i].id}">${subChapterObjects[i].subchapterName}</a></span></li>`;
            } else {
                this.#htmlObj += `<li  class="nav-left-links" data-subchapterid=${subChapterObjects[i].id}><span class="nav-span"><a data-linkid=${subChapterObjects[i].id} class='nav-link' href="#${subChapterObjects[i].id}">${subChapterObjects[i].subchapterName}</a></span></li>`;
            }
        }

        this.#htmlObj += ` </ul></section>`;
        return this.#htmlObj;

    }

    /**
     * färbt nav links blau bein anklicken
     * @param element
     */
    setActiveClass(element) {
        this.#removeAttributeActiveOnLink();
        console.log('element',element)
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
        allLinks.forEach((link) => {
            link.firstChild.firstChild.style.color = "#444444FF";
            if (link.firstChild.classList.contains('active')) {
                link.firstChild.classList.remove('active');
            }
        })


    }

    display(e) {
        this.#navLeftContainer.classList.toggle('showBlock');
    }

    //löscht den die nav-left-box
    #clear() {
        let box=document.querySelector('#nav-left-box');
        this.#navLeftWrapper.removeChild(box);

    }
}

export default new NavLeft();