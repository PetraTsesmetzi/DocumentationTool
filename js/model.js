export const state={
    subchapter:{}
}
export const loadArticle2 = async (id) => {
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

        console.log(data)



        //dataObject wird geparsed
        const articlesArr=data.articleArr;
        for (const key in articlesArr) {
            articlesArr[key]=JSON.parse(articlesArr[key]);
            for (const keyKey in  articlesArr[key].descriptionArr) {
                //console.log(articlesArr[key].descriptionArr);
                 articlesArr[key].descriptionArr[keyKey]=JSON.parse(articlesArr[key].descriptionArr[keyKey]);
            }
            for (const keyKey in  articlesArr[key].codeArr) {
                //console.log(articlesArr[key].descriptionArr);
                articlesArr[key].codeArr[keyKey]=JSON.parse(articlesArr[key].codeArr[keyKey]);
            }
        }
        const articles2=[];
        //ein artikel Object wird erstellt und in das articles array gepushed
        for (const key in articlesArr) {
            //mergen des descriptionsArr und CodeArr

            let articleElementsArr=[...articlesArr[key].descriptionArr,...articlesArr[key].codeArr]
            articleElementsArr=sortArrayOfObjects(articleElementsArr,'elementOrder');
            let article = {
                id: articlesArr[key].id,
                articleNumber: articlesArr[key].articleNumber,
                articleName: articlesArr[key].articleName,
                descriptionArr: articlesArr[key].descriptionArr,
                codeArr: articlesArr[key].codeArr,
                articleElementArr:articleElementsArr
            }
            articles2.push(article);

        }
        //ein subchapter wir erstellt
        state.subchapter=
            {
                subchapterName:data.subchapterName,
                articlesArr:articles2
            }
    } catch (e) {
        console.log(e.name);
        console.log(e.message);
        console.log(e.lineNumber);
        document.getElementById("console-error").innerHTML =e.message;
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


// export const loadArticle = async (id) => {
//     try {
//         // Build formData object.
//         let formData = new FormData();
//         formData.append('id', id);
//         const response = await fetch("http://localhost:63342/DocumentationsTool/php/controler.php",
//                 {
//                     body: formData,
//                     method: "post"
//                 });
//         //Wenn antwort nicht ok, dann Fehelermeldung
//         if(!response.ok) throw new Error(`${data.message} (${response.status}`);
//
//         //data aufbereitung für stateObject
//         let data = JSON.parse(await response.json());
//         console.log(data);
//         for (const dataKey in data.descriptionArr) {
//             data.descriptionArr[dataKey]=JSON.parse(data.descriptionArr[dataKey]);
//         }
//         for (const dataKey in data.codeArr) {
//             data.codeArr[dataKey]=JSON.parse(data.codeArr[dataKey]);
//         }
//         //beide Arrays zusammen mergen
//         let articleElementsArr=[...data.descriptionArr,...data.codeArr]
//
//
//         //Array  nach dem Atribut 'elementOrder' sortieren
//         articleElementsArr= sortArrayOfObjects(articleElementsArr,'elementOrder');
//
//
//
//         state.article={
//             id:data.id,
//             articleNumber:data.articleNumber,
//             articleName:data.articleName,
//             descriptionArr:data.descriptionArr,
//             codeArr:data.codeArr,
//             articleElementsArr:articleElementsArr
//         }
//         console.log(state.article);
//
//     } catch (e) {
//         console.log(e);
//     }
// }


