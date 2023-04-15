const budgetUrl = 'budgets/'
let BUDGETS = [];

/**
 * Get all expenses for users
 * @returns {Array} array of expenses created by request user
 */
 async function getBudgets(){
    const code = window.localStorage.getItem('finance-manager::code');

    if(isBlank(code)){
        return window.location.replace('/');
    }
    else{
        const data = await getJSONData(budgetUrl);
        BUDGETS = data;
        return data;
    }
}