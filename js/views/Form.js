class Form{
    #updateFlag=false;
    #parentElement = document.querySelector('.content-container');
    #addTextAreaFields="";
    #addedBlockCounter;



    render(){
        this.#clear();
        const markup=this.#generateMarkup();
        this.#parentElement.insertAdjacentHTML('afterbegin',markup);
        console.log(this.#parentElement);
        this.#addTextAreaFields=document.querySelector('.addTextAreaFields');
        console.log(this.#addTextAreaFields);
        this.#addHandlerRender();
    }
    #clear(){
        this.#parentElement.innerHTML='';
        this.#addedBlockCounter=0;
    }

    #addHandlerRender(){

        const addDescButton=document.querySelector('.addDescArea');
        addDescButton.addEventListener('click',this.#addElement.bind(this));
        //
        const addCodeButton=document.querySelector('.addCodeArea');
        addCodeButton.addEventListener('click',this.#addElement.bind(this));

        const deleteBtns=document.querySelector('.addTextAreaFields');
         deleteBtns.addEventListener('click',this.#deleteAddedElements.bind(this));

    }


    #addElement(e){
        let toAdd=e.target;
        if(toAdd.classList.contains("addCodeArea")){
            const codeMarkup=this.#generateCodeBlock();
            this.#addTextAreaFields.insertAdjacentHTML("beforeend", codeMarkup);

        }
        if(toAdd.classList.contains("addDescArea")) {
            const descMarkup = this.#generateDescriptionBlock();
            this.#addTextAreaFields.insertAdjacentHTML("beforeend", descMarkup);
        }

    }
    #deleteAddedElements(e){
        console.log(e.target);
        let toDelete=e.target.parentElement.parentNode;
        // console.log(toDelete);
        if(toDelete.classList.contains("addedCode") ||toDelete.classList.contains("addedDescription")){
            toDelete.remove();
        }
    }

    #generateDescriptionBlock(){
        this.#addedBlockCounter++;
        return`<div data-id="${this.#addedBlockCounter}" class="addedDescription">
                <div class="label-container"><label for="description_${this.#addedBlockCounter}">beschreibung</label>
                <button data-btnid="${this.#addedBlockCounter}" class="btn btn-delete">Delete</button></div>
                <textarea id="description_${this.#addedBlockCounter}" class="description"></textarea>
               </div>`;
    }

    #generateCodeBlock(){
        this.#addedBlockCounter++;
        return `<div data-id="${this.#addedBlockCounter}" class="addedCode">
                <div class="label-container"><label for="codeblock_${this.#addedBlockCounter}">Code</label>
                <button data-btnid="${this.#addedBlockCounter}" class="btn btn-delete">Delete</button></div>
                <textarea id="codeblock_${this.#addedBlockCounter}" class="code"></textarea>
                </div>`;
    }

    #generateMarkup() {
        let htmlObj = `<div class="form-container">
        <h1>Kapitel hinzufügen</h1>
        <form action="#">
            <div class="input-container">
<!--            <div class="inputFields">-->
<!--                <label for="chapterTitle">Kapitel</label>-->
<!--       -->
<!--                <input list="chapterTitles" type="text" id="chapterTitle" name="chapterTitle" autocomplete="off">-->
<!--                <datalist id="chapterTitles">-->
<!--                    <option value="Javascript Fundamentals Part 1">-->
<!--                    <option value="Javascript Fundamentals Part 2">-->
<!--                </datalist>-->
<!--            </div>-->
<!--            <div class="inputFields">-->
<!--                <label for="chapters">Kapitelnr.</label>-->
<!--                <select id="chapters" name="chapters">-->
<!--                    <option value="10">10</option>-->
<!--                    <option value="1">1</option>-->
<!--                    <option value="2">2</option>-->
<!--                    <option value="4">4</option>-->
<!--                </select>-->
<!--            </div>-->
        </div>
        <div class="input-container">
            <div class="inputFields">
                <label for="subChapterTitel">Unterkapitel</label>
                <input list="subChapterTitels" type="text" id="subChapterTitel" name="subChapterTitel"
                       autocomplete="off">
                <datalist id="subChapterTitels">
                    <option value="Values and Variables">
                    <option value="Basic Operators & Math Operators">
                </datalist>
            </div>
            <div class="inputFields">
                <label for="subChapterNr">Unterkapitelnr.</label>
                <select id="subChapterNr" name="subChapterNr">
                    <option value="10">10</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                </select>
            </div>
        </div>
        <div class="input-container">
            <div class="inputFields">
                <label for="articleTitel">Artikel</label>
                <input list="articleTitels" type="text" id="articleTitel" name="articleTitel" autocomplete="off">
                <datalist id="articleTitels">
                    <option value="Values">
                    <option value="Variables">
                </datalist>
            </div>
            <div class="inputFields">
                <label for="articleNr">Artikelnr.</label>
                <select id="articleNr" name="articleNr">
                    <option value="10">10</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                </select>
            </div>
        </div>
        <div class="textAreaFields">
            <div class="textAreaFieldsDescription">
                <label for="description">Beschreibung</label>
                <textarea id="description_0" class="description"></textarea>
            </div>
            <div class="textAreaFieldsCode">
                <label for="code">Code</label>
                <textarea id="code_0" class="code"></textarea>
            </div>
        </div>
        <div class="addTextAreaFields">`;


        htmlObj+=`</div>

        <div class="addTextArea-container">
            <div class="addTextAreas">
                <button type="button" class="btn-add addCodeArea">Code hinzufügen</button>
                <button type="button" class="btn-add addDescArea">Beschreibung hinzufügen</button>
            </div>
            
        </div>

        <div class="btn-form-container">
            <button type="reset" class="btn-form btn-reset">Zurücketzen</button>
            <button type="button" class="btn-form btn-send">Absenden</button>
        </div>
    </form>
    </div>`;
        return htmlObj;

    }


}
export default new Form();