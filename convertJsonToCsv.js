function convertJsonToCsv(json) {
    const fs = require('fs');
    const jsonData = require(json);

    const jsonInput = jsonData.records;

    const processedProductIds = {};
    const csvOutput = `Product StockKeepingUnit, Price (${jsonInput[0].Pricebook2Id}) EUR, Price (${jsonInput[0].Pricebook2Id}) RON, IsActive\n` +
        jsonInput.reduce((acc, item) => {
            const productCode = item.Product2.Article_SAP_Code__c;

            if (!processedProductIds[productCode]) {
                processedProductIds[productCode] = {
                    unitPriceEUR: "",
                    unitPriceRON: "",
                    isActive: item.IsActive
                };
            }

            if (item.CurrencyIsoCode === 'EUR') {
                processedProductIds[productCode].unitPriceEUR = item.UnitPrice;
            } else if (item.CurrencyIsoCode === 'RON') {
                processedProductIds[productCode].unitPriceRON = item.UnitPrice;
            }

            return acc;
        }, '');

    const csvRows = Object.keys(processedProductIds).map(productCode => {
        const { unitPriceEUR, unitPriceRON, isActive } = processedProductIds[productCode];
        return `${productCode}, ${unitPriceEUR}, ${unitPriceRON}, ${isActive}\n`;
    });

    const csvName = json.split('/')[2].replace('.json', '.csv');

    fs.writeFileSync(csvName, csvOutput + csvRows.join(''));

    console.log("CSV file generated successfully!");
}

module.exports = convertJsonToCsv;