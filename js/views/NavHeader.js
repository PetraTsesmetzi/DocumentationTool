/**
 * Autorin: Petra Tsesmetzi
 * Datum: 12.06.2023
 *
 * Die Klasse NavHeader generiert das Markup für die Navigationsleiste im Header und für die
 * 2 Buttons Beartbeiten und Einfügen
 * diese werden anschließend in die jeweiligen Div -Containern eingehangen
 *
 */
class NavHeader{
    #parentElement=document.querySelector('.nav-links');
    #editBtn=document.querySelector('.btn-edit');
    #insertBtn=document.querySelector('.btn-insert');


    /**
     * initialisiert das Markup (hängt die htmlObjekte in die Container)
     * und setzt ein EventlLister für das Makieren der Links in blau
     * @param start
     */
    render(start){
        if(start==='init'){
            const markup = this.#generateMarkup();
            this.#parentElement.insertAdjacentHTML('afterbegin', markup);
            const startLink=document.querySelector('.startLink');
            this.#setActiveClassOnNav(startLink,start);
        }
        this.#parentElement.addEventListener('click', this.#setActiveClassOnNav.bind(this));
    }

    /**
     * Toggelt den Einfüge Button
     * @param editMode
     */
    renderInsert(editMode){
        if(editMode===true){
            this.#insertBtn.classList.remove('btn-hide')
        }else{
            this.#insertBtn.classList.add('btn-hide');
        }
    }

    /**
     * Eventlistener für den Bearbeiten Buttton
     * @param handler
     */
    addHandlerEdit(handler){
        this.#editBtn.addEventListener('click',handler);
    }

    /**
     * EventListener für den EinfügeButton
     * @param handler
     */
    addHandlerInsert(handler){
        this.#insertBtn.addEventListener('click',handler.bind(this));
    }

    /**
     * String für die Links in Nav-Header
     * @returns {string}
     */
    #generateMarkup() {

        return `<li class="nav-header-links"><span class="startLink" id="javascript">JAVASCRIPT</span></li>
                <li class="nav-header-links"><span id="php">PHP</span></li>
                <li class="nav-header-links"><span id="mysql">MSQL</span></li>
                <li class="nav-header-links"><span id="html">HTML/CSS</span></li>
                <li class="nav-header-links"><span id="how">HOW TO</span></li>`;

    }

    /**
     * setzt die spans auf aktiv(färbt blau)
     * @param e //element welches verändert wird
     * @param start
     */
    #setActiveClassOnNav(e,start){

        this.#removeAttributeActiveOnLink();

        if(start==='init'){
            e.style.color = 'white';
            e.classList.add('active');
        }else{
            if(e.target.tagName==='SPAN'){
                e.target.classList.add('active');
            }
        }
    }

    /**
     * entfernt die CSS Klasse active
     */
    #removeAttributeActiveOnLink(){
        const allLinks=document.querySelectorAll('.nav-header-links');
        allLinks.forEach((element)=>{
            if(element.firstChild.classList.contains('active')){
                element.firstChild.classList.remove('active');
            }
        })
    }
}
export default new NavHeader();