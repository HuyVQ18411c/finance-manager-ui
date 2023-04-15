const categoryUrl = 'categories/';
const expenseUrl = 'expenses/'

let PAGE_LIMIT = 5;

let EXPENSES = [];
let currentExpense = [];
let currentPage = 1;

/**
 * Simple validator for creating a new expense
 * @param {Object} data new expense data
 * @returns {Boolean} indicate if data is validated
 */
function validateNewExpense(data){
    if(!isBlank(data) && !isBlank(data.title) && !isBlank(data.amount) && !isBlank(data.category_id)){
        return true;
    }
    return false;
}

/**
 * Wrapper function to transform data to data suitable for dropdown
 * @param {Array} data data set which need to be transformed
 * @param {String} key determine which field is value sent to server
 * @param {String} value determine which field is value is show for end user
 * @returns {Array} an array of adapted objects
 */
function selectAdapter(data, key, value){
    const adaptedData = []; 
    data.forEach(val => {
        adaptedData.push({title: val[value], value: val[key]})
    });
    return adaptedData;
}

/**
 * Get all expenses for users
 * @returns {Array} array of expenses created by request user
 */
async function getExpenses(){
    const code = window.localStorage.getItem('finance-manager::code');

    if(isBlank(code)){
        return window.location.replace('/');
    }
    else{
        const data = await getJSONData(expenseUrl);
        EXPENSES = data;
        return data;
    }
}

/**
 * Get expenses for current page. Enable pagination
 * @param {Number} page page number 
 * @returns {Array} an array of user expenses
 */
function getCurrentExpenses(page=1){
    let start = (page - 1) * PAGE_LIMIT;
    let end = start + PAGE_LIMIT;
    return EXPENSES.slice(start, end);
}

/**
 * Create a new expenses
 * @param {Array} data expense data
 * @returns {Promise} response indicate request status 
 */
async function createExpense(data){
    const isValid = validateNewExpense(data);
    if(!isValid){
        return;
    }

    return await postJSONData(data, expenseUrl);
}
