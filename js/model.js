export const state={
    article:{}
}

export const loadArticle = async (id) => {
    try {
        // Build formData object.
        let formData = new FormData();
        formData.append('id', id);
        const response = await fetch("http://localhost:63342/DocumentationsTool/php/controler.php",
                {
                    body: formData,
                    method: "post"
                });
        //Wenn antwort nicht ok, dann Fehelermeldung
        if(!response.ok) throw new Error(`${data.message} (${response.status}`);

        //data aufbereitung für stateObject
        let data = JSON.parse(await response.json());
        for (const dataKey in data.descriptionArr) {
            data.descriptionArr[dataKey]=JSON.parse(data.descriptionArr[dataKey]);
        }
        for (const dataKey in data.codeArr) {
            data.codeArr[dataKey]=JSON.parse(data.codeArr[dataKey]);
        }
        //beide Arrays zusammen mergen
        let articleElementsArr=[...data.descriptionArr,...data.codeArr]


        //Array  nach dem Atribut 'elementOrder' sortieren
        articleElementsArr= sortArrayOfObjects(articleElementsArr,'elementOrder');



        state.article={
            id:data.id,
            articleNumber:data.articleNumber,
            articleName:data.articleName,
            descriptionArr:data.descriptionArr,
            codeArr:data.codeArr,
            articleElementsArr:articleElementsArr
        }
        console.log(state.article);

    } catch (e) {
        console.log(e);
    }
}

//sortiert ein Array mit Objekten nach einem vorgegebenem Attribut
const sortArrayOfObjects=(arr, propertyName, order='ascending')=>{
    const sortedArr=arr.sort((a,b)=>{

        if(a[propertyName]<b[propertyName]){
            return -1;

        }
        if(a[propertyName]>b[propertyName]){
            return 1;

        }
        return 0;
    })
    if(order==='descending'){
        return sortedArr.reverse();
    }
    return sortedArr;
}

