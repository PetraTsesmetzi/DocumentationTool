class NavLeft {

    #parentElement = document.querySelector('#nav-left');
    #id;

    /**
     * initialisiert das markup(hängt die htmlObjekte in die Container)
     * und setzt ein eventlLister für das makieren der links in blau
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
     * html object für links in nav-left
     * @returns {string}
     */
    #generateMarkup() {

        return `<section>
                <h1 data-titel="1">Javascript Fundamentals Part 1</h1>
                     <ul> 
                            <li  class="nav-left-links" data-articleid="1"><span id="startLink" class="nav-span"><a href="#1">Values und Variables</a></span></li>
                            <li  class="nav-left-links" data-articleid="2"><span class="nav-span"><a href="#2">Basic Operators Mathoperators</a></span></li>
                            <li  class="nav-left-links" data-articleid="3"><span class="nav-span"><a href="#3">String und Template literals</a></span></li>
                     </ul>
                </section>`;

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

  /****************
   publischer subscriber pattern- eventlister gehrören in die View,
   damit man die funktion des listeners im controller noch aufrufen kann wird diese als parameter übergeben********/

    /**
     * evetnhandler für die links in nav-left. hier wird allerdings auf veränderung in der url gehorcht
     * @param handler
     */
    addHandlerRender(handler) {
        window.addEventListener('hashchange', handler);
        window.addEventListener('load', handler);
    }

    /**
     * entfernt sytles an den links
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

    getParentElement() {
        return this.#parentElement;
    }

}

export default new NavLeft();