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

    #bookBtn=document.querySelector('.btn-book');


    /**
     * initialisiert das Markup (hängt die htmlObjekte in die Container)
     * und setzt ein EventlLister für das Makieren der Links in blau
     * @param start
     */
    render(start,categories){
        if(start==='init'){
            const markup = this.#generateMarkup(categories);
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
     * @param loadEditMode
     */
    addHandlerEdit(loadEditMode){
        this.#editBtn.addEventListener('click',loadEditMode);
    }

    /**
     * EventListener für den EinfügeButton
     * @param loadForm
     */
    addHandlerInsert(loadForm){
        this.#insertBtn.addEventListener('click',loadForm.bind(this));
    }
    addHandlerMobileMenu(loadMobileMenu){

        this.#bookBtn.addEventListener('click',loadMobileMenu);

    }

    /**
     * String für die Links in Nav-Header
     * @returns {string}
     */
    #generateMarkup(categories) {
        let htmlObj='';

        for (let i = 0; i < categories.length; i++) {
            console.log('kategoriennamen',categories[i].categoryName)
            htmlObj+=`<li class="nav-header-links"><span class="startLink" id=${categories[i].id} data-categoryName=${categories[i].categoryName}>${categories[i].categoryName}</span></li>`;
        }

        return htmlObj;
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

    addHandlerRenderLoadSubchapter(loadChapterByCategory) {
        const links=document.querySelectorAll('.nav-header-links')

        links.forEach(link=>{
            link.addEventListener('click',loadChapterByCategory.bind(this));

        })

    }

}
export default new NavHeader();