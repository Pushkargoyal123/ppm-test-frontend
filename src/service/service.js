
// const ServerURL="http://localhost:7080/api/";
// const ServerURL="https://test.praedicofinance.com/api/"
const axios = require('axios');

async function postData(url, body){
    try{
        const response = await fetch(process.env.React_App_SERVERURL + '/api/' + url , 
            {   
                method: "POST", 
                mode: "cors", 
                headers: { 
                    "Content-Type": "application/json;charset=utf-8" ,
                    "Authorization" : "Bearer "+localStorage.getItem("token")
                }, 
                body:JSON.stringify(body)
            }
        );
        const result = await response.json();
        return result;
    }
    catch(err){
        console.log(err);
        return(err);
    }
}

async function postDataAndImage(url, body){
    try{
        const response = await axios.post(process.env.React_App_SERVERURL + '/api/' + url ,
            body, 
            {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    "Authorization" : "Bearer "+localStorage.getItem("token")
                }, 
            }
        );
        const result = await response.data;
        return result;
    }
    catch(err){
        console.log(err);
        return(err);
    }
}

async function getData(url){
    try{
        const response = await fetch(process.env.React_App_SERVERURL + '/api/' + url , 
            {   
                headers: { 
                    "Authorization" : "Bearer "+localStorage.getItem("token")
                }, 
            }
        );
        const result = await response.json();
        return result;
    }
    catch(err){
        console.log(err);
        return(err);
    }
}


export { postData , getData, postDataAndImage};