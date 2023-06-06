class NavHeader{
    #parentElement=document.querySelector('.nav-links');

    /**
     * initialisiert das markup(hängt die htmlObjekte in die Container)
     * und setzt ein eventlLister für das makieren der links in blau
     */
    render(){
        const markup=this.#generateMarkup();
        this.#parentElement.insertAdjacentHTML('afterbegin',markup);
        this.#parentElement.addEventListener('click',this.setActiveClassOnNav.bind(this));


    }

    /**
     * html object für links in nav-header
     * @returns {string}
     */
    #generateMarkup() {

        return `<li class="nav-header-links"><span id="javascript">JAVASCRIPT</span></li>
                <li class="nav-header-links"><span id="php">PHP</span></li>
                <li class="nav-header-links"><span id="mysql">MSQL</span></li>
                <li class="nav-header-links"><span id="html">HTML/CSS</span></li>
                <li class="nav-header-links"><span id="how">HOW TO</span></li>`;

    }

    /**
     * setzt den span auf aktiv(färbt blau)
     * @param e
     */
    setActiveClassOnNav(e){
        this.#removeAttributeActiveOnLink();
        if(e.target.tagName==='SPAN'){
            e.target.classList.add('active');
        }

    }

    /**
     * entfernt die css klasse aktiv auf span , spann wird wieder grau
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