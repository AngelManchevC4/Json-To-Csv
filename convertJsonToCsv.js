

function convertJsonToCsv(json) {
    const fs = require('fs');
    const jsonData = require(json);

    const jsonInput = jsonData.records;

    const processedProductIds = {};
    const csvOutput = `Product StockKeepingUnit, Price (${jsonInput[0].Pricebook2Id}) EUR, Price (${jsonInput[0].Pricebook2Id}) RON, IsActive\n` +
        jsonInput.reduce((acc, item) => {
            const productCode = item.Product2.Article_SAP_Code__c;

            if (processedProductIds[productCode]) {
                return acc;
            }

            const unitPriceEUR = item.CurrencyIsoCode === 'EUR' ? item.UnitPrice : '';
            const unitPriceRON = item.CurrencyIsoCode === 'RON' ? item.UnitPrice : '';
            const isActive = item.IsActive;

            processedProductIds[productCode] = true;

            return `${acc}${productCode}, ${unitPriceEUR}, ${unitPriceRON}, ${isActive}\n`;
        }, '');
    
        const csvName = json.split('/')[2].replace('.json','.csv');

    fs.writeFileSync(csvName, csvOutput);

    console.log("CSV file generated successfully!");
}

module.exports=convertJsonToCsv;