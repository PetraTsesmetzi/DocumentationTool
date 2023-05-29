class NavLeft{

    #parentElement=document.querySelector('#nav-left');


    render(){
        const markup=this.#generateMarkup();
        this.#parentElement.insertAdjacentHTML('afterbegin',markup);
        this.#parentElement.addEventListener('click',this.setActiveClassOnNav.bind(this));


    }
    #generateMarkup() {

            return `<section>
                        <h1 data-titel="1">Javascript Fundamentals Part 1</h1>
                        <ul> 
                            <li  class="nav-left-links" data-subchapterid="1"><span class="nav-span">Variables</span></li>
                            <li  class="nav-left-links" data-subchapterid="2"><span class="nav-span">Namenskonventionen</span></li>
                            <li  class="nav-left-links" data-subchapterid="3"><span class="nav-span">Datentypen</span></li>
                        </ul>
                        </section>`;

    }
    setActiveClassOnNav(e){
        this.#removeAttributeActiveOnLink();
        if(e.target.tagName==='SPAN'){
           e.target.classList.add('active');
        }

    }


    #removeAttributeActiveOnLink(){
        const allLinks=document.querySelectorAll('.nav-left-links');
        allLinks.forEach((element)=>{
            if(element.firstChild.classList.contains('active')){
                element.firstChild.classList.remove('active');
            }
        })
    }


}

export default new NavLeft();