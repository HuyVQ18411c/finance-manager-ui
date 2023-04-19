const BASE_REQUEST_URL = 'http://103.150.124.219:8001/';


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

async function postJSONData(data={}, extendUrl=''){
    const REQUEST_URL = BASE_REQUEST_URL + extendUrl;
    try{
        const response = await fetch(REQUEST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Token': window.localStorage.getItem('finance-manager::code'),
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch(error) {
        console.error('Error', 'Thực hiện yêu cầu thất bại.', error);
    }
}

async function deleteData(data={}, extendUrl=''){
    const REQUEST_URL = BASE_REQUEST_URL + extendUrl;
    try{
        const response = await fetch(`${REQUEST_URL}${data.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Token': window.localStorage.getItem('finance-manager::code'),
            },
        });
        return await response.json();
    } catch(error) {
        console.error('Error', 'Thực hiện yêu cầu thất bại.', error);
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

/**
 * Get all categories from server
 * @returns {Array} array of categories object
 */
 async function getCategories(){
    let categories = JSON.parse(window.sessionStorage.getItem('finance-manager::categories'));

    if(isBlank(categories)){
        const data = await getJSONData(categoryUrl);
        window.sessionStorage.setItem('finance-manager::categories', JSON.stringify(data));
        return data;
    } else {
        return categories;
    }   
}