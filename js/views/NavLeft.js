/**
 * Autorin: Petra Tsesmetzi
 * Datum: 12.06.2023
 *
 * Die Klasse NavLeft generiert das Markup für die linksgerichtete Navigationsleiste
 *
 *
 */
class NavLeft {

    #parentElement = document.querySelector('#nav-left');
    #id;

    /**
     * initialisiert das Markup (hängt die htmlObjekte in die Container)
     * und setzt ein EventListener für das Markieren der Links in blau
     * @param start
     */
    render(start) {
        if(start==='init'){
            const markup = this.#generateMarkup();
            this.#parentElement.insertAdjacentHTML('afterbegin', markup);
            const startLink=document.querySelector('#startLink');
            this.#setActiveClassOnNav(startLink,start);
        }
        this.#parentElement.addEventListener('click', this.#setActiveClassOnNav.bind(this));
    }


    /**
     * string für Links in nav-left
     * @returns {string}
     */
    #generateMarkup() {

        return `<section>
                <h1 data-titel="1">Javascript Fundamentals Part 1</h1>
                     <ul> 
                            <li  class="nav-left-links" data-articleid="1"><span id="startLink" class="nav-span"><a data-linkid="1" class='nav-link' href="#1">Values und Variables</a></span></li>
                            <li  class="nav-left-links" data-articleid="2"><span class="nav-span"><a data-linkid="2" class='nav-link' href="#2">Basic Operators Mathoperators</a></span></li>
                            <li  class="nav-left-links" data-articleid="3"><span class="nav-span"><a data-linkid="3" class='nav-link' href="#3">String und Template literals</a></span></li>
                     </ul3
                </section>`;

    }

    //todo: zusammenfasen?
    /**
     * setzt die li auf aktiv (färbt blau)
     * @param id
     */

    setActiveClass(id){

        const links=document.getElementsByClassName('nav-link');
        this.#removeAttributeActiveOnLink();
        for (let i = 0; i <links.length; i++) {
            if(id===i+1) {
                links[i].style.color = 'white';
                links[i].parentElement.classList.add('active');
            }
        }
    }
    /**
     * setzt den span auf aktiv(färbt blau)
     * @param e
     */
    #setActiveClassOnNav(e,start) {
        this.#removeAttributeActiveOnLink();

        if(start==='init'){
            e.children[0].style.color = 'white';
            e.classList.add('active');
        }else{
            if (e.target.tagName === 'A') {
                e.target.style.color = 'white';
                e.target.parentElement.classList.add('active');
            }
        }
    }

    /**
     * Evetnhandler für die links in nav-left. hier wird allerdings auf veränderung in der url gehorcht
     * @param handler
     */
    addHandlerRender(handler) {
        window.addEventListener('hashchange', handler);
        window.addEventListener('load', handler);
    }

    /**
     * entfernt sytles von den Links
     */
    #removeAttributeActiveOnLink() {
        const allLinks = document.querySelectorAll('.nav-left-links');
        allLinks.forEach((element) => {
            element.firstChild.firstChild.style.color = "#444444FF";
            if (element.firstChild.classList.contains('active')) {
                element.firstChild.classList.remove('active');
            }
        })
    }

    // getParentElement() {
    //     return this.#parentElement;
    // }

}

export default new NavLeft();