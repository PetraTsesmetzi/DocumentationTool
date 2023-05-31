class NavLeft{

    #parentElement=document.querySelector('#nav-left');
    #id;


    render(){
        const markup=this.#generateMarkup();
        this.#parentElement.insertAdjacentHTML('afterbegin',markup);
        this.#parentElement.addEventListener('click',this.#setActiveClassOnNav.bind(this));



    }
    #generateMarkup() {

            return `<section>
                        <h1 data-titel="1">Javascript Fundamentals Part 1</h1>
                        <ul> 
                            <li  class="nav-left-links" data-articleid="1"><span class="nav-span " id="white"><a href="#1">Values und Variables</a></span></li>
                            <li  class="nav-left-links" data-articleid="2"><span class="nav-span "><a href="#2">Basic Operators Mathoperators</a></span></li>
                            <li  class="nav-left-links" data-articleid="3"><span class="nav-span "><a href="#3">String und Template literals</a></span></li>
 
                        </ul>
                      </section>`;

    }
   #setActiveClassOnNav(e){
        this.#removeAttributeActiveOnLink();
        if(e.target.tagName==='A'){
            e.target.style.color = 'white';
           e.target.parentElement.classList.add('active');
        }

    }


    #removeAttributeActiveOnLink(){
        const allLinks=document.querySelectorAll('.nav-left-links');
        allLinks.forEach((element)=>{
            element.firstChild.firstChild.style.color="#444444FF";
            if(element.firstChild.classList.contains('active')){
                element.firstChild.classList.remove('active');
            }
        })
    }

    getParentElement(){
        return this.#parentElement;
    }

}

export default new NavLeft();