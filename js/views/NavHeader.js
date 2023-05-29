class NavHeader{
    #parentElement=document.querySelector('.nav-links');


    render(){
        const markup=this.#generateMarkup();
        this.#parentElement.insertAdjacentHTML('afterbegin',markup);
        this.#parentElement.addEventListener('click',this.setActiveClassOnNav.bind(this));


    }
    #generateMarkup() {

        return `<li class="nav-header-links"><span id="javascript">JAVASCRIPT</span></li>
                <li class="nav-header-links"><span id="php">PHP</span></li>
                <li class="nav-header-links"><span id="mysql">MSQL</span></li>
                <li class="nav-header-links"><span id="html">HTML/CSS</span></li>
                <li class="nav-header-links"><span id="how">HOW TO</span></li>`;

    }
    setActiveClassOnNav(e){
        this.#removeAttributeActiveOnLink();
        if(e.target.tagName==='SPAN'){
            e.target.classList.add('active');
        }

    }


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