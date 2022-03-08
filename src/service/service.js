
const ServerURL="http://localhost:7080/api/";
// const ServerURL="https://test.praedicofinance.com/api/"

async function postData(url, body){
    try{
        const response = await fetch(ServerURL + url , 
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

async function getData(url){
    try{
        const response = await fetch(ServerURL + url , 
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


export {ServerURL, postData , getData};