const bittrex = require('node-bittrex-api');

let bittrexCurrenciesNameArray = new Array();

let bittrexLastPriceArray = new Array();

const getBittrexCurrenciesName = () => {
    bittrex.getmarketsummaries( function( data, err ) {
        if (err) {
          return console.error(err);
        } else {
          data.result.forEach((value, index, array) => {
            if(value.MarketName.includes('BTC-')) {
                bittrexCurrenciesNameArray.push(value.MarketName);

                let obj = {};
                obj.name = value.MarketName;

                bittrexLastPriceArray.push(obj);
            }
          });
        }
        
    });
}

const refreshBittrexArray = () => {
        bittrex.getmarketsummaries( function( data, err ) {
        if (err) {
          return console.error(err);
        } else {
            bittrexCurrenciesNameArray.forEach((value, index, array) => {
                if(value === bittrexLastPriceArray[index].name) {
                    data.result.forEach((value2, index2, array2) => {
                        if(value2.MarketName === value) {
                            bittrexLastPriceArray[index].price = value2.Last;
                        }
                    })
                }
            });
        }    
    });
}


getBittrexCurrenciesName();
setInterval(refreshBittrexArray, 3000);

module.exports = {
    bittrexLastPriceArray : bittrexLastPriceArray
}