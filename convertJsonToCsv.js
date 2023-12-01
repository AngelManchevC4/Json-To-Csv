function convertJsonToCsv(jsonPath) {

    var csvjson = require('csvjson');
    var fs = require('fs')
    var json = require(jsonPath);

    let modifiedJson = json.map(e => {
        let newJson = {
            Product: e.Product2.Article_SAP_Code__c,
            PriceEuro: e.UnitPrice,
            PriceRON: (e.UnitPrice / 0.20).toFixed(2) * 1,
            isActive: e.IsActive
        };

        return newJson;
    })

    const csvData = csvjson.toCSV(modifiedJson, {
        headers: 'key',
    })

    fs.writeFile('./convertedData.csv', csvData, (err) => {
        if (err) {
            console.log(err);
            throw new Error(err);
        }
        console.log('Converted successfully')
    })

    fs.readFile('./convertedData.csv', 'utf-8', (err, fileContent) => {
        fileContent = fileContent.replace("PriceEuro", `Price (${json[0].Pricebook2Id}) Euro`);
        fileContent = fileContent.replace("PriceRON", `Price (${json[0].Pricebook2Id}) RON`);

        console.log(fileContent);

        fs.writeFile('./convertedData.csv', fileContent, (err) => {
            if (err) {
                console.log(err);
                throw new Error(err);
            }
        })
    })


}

module.exports=convertJsonToCsv;
