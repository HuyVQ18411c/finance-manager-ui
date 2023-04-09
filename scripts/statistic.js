async function getStatisticData(){
    const data = await getJSONData('expenses/statistic/');
    return data;
}