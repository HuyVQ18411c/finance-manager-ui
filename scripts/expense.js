const categoryUrl = 'categories/';
const expenseUrl = 'expenses/'

let PAGE_LIMIT = 5;

let EXPENSES = [];
let currentExpense = [];
let currentPage = 1;

function validateNewExpense(data){
    if(!isBlank(data) && !isBlank(data.title) && !isBlank(data.amount) && !isBlank(data.category_id)){
        return true;
    }
    return false;
}

function selectAdapter(data, key, value){
    const adaptedData = []; 
    data.forEach(val => {
        adaptedData.push({title: val[value], value: val[key]})
    });
    return adaptedData;
}

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

function getCurrentExpenses(page=1){
    let start = (page - 1) * PAGE_LIMIT;
    let end = start + PAGE_LIMIT;
    return EXPENSES.slice(start, end);
}

async function createExpense(data){
    const isValid = validateNewExpense(data);
    if(!isValid){
        return;
    }

    return await postJSONData(data, expenseUrl);
}

function getExpensesForChart(data=[], categories=[]){
    const result = {labelByCategory: [], amount: []};
    const existingCategories = []; 

    data.forEach((row) => {
        let index = existingCategories.indexOf(row.category_id);
        if(index === -1){
            existingCategories.push(row.category_id);

            let filteredCategory = categories.filter((category) => category.id === row.category_id)[0].name;
            result.labelByCategory.push(filteredCategory);
            
            result.amount[existingCategories.length - 1] = row.amount;
        }
        else{
            result.amount[index] += row.amount;
        }
    });

    return result;
}
