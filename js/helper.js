import {API_URL} from './config.js';
export const getJSONObj=async function(formData){
    try{

        console.log(API_URL);
        const response = await fetch(`${API_URL}`,
            {
                body: formData,
                method: "post"
            });

        //Wenn antwort nicht ok, dann Fehelermeldung
        if(!response.ok) throw new Error(`${data.message} (${response.status}`);
        //data aufbereitung für stateObject
        let data = await response.json();
        // let data = JSON.parse(await response.json());
        // let data = JSON.parse(await response.text());

        return data;
    }catch(e){

    }

}