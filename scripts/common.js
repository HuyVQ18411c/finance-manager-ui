const BASE_REQUEST_URL = 'http://127.0.0.1:8000/'


async function getJSONData(extendUrl=''){
    const REQUEST_URL = BASE_REQUEST_URL + extendUrl;
    try{
        const response = await fetch(REQUEST_URL, {
            method: 'GET',
            headers: {
                'X-Token': window.localStorage.getItem('finance-manager::code')
            }
        });
        return await response.json();
    } catch(error){
        console.error('Lấy data thất bại.', error)
    }
}

async function postJSONData(data={}, extendUrl='', method='POST'){
    const REQUEST_URL = BASE_REQUEST_URL + extendUrl;
    try{
        const response = await fetch(REQUEST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Token': window.localStorage.getItem('finance-manager::code')
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch(error) {
        console.error('Error', 'Thực hiện yêu cầu thất bại.');
    }
}

function isBlank(value){
    if(value === null || value === undefined || value === ''){
        return true;
    }
    return false;
}

function validateEmail(email) 
{
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email.match(mailformat))
    {
        return true;    
    }
    return false;
}

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}