const Poloniex = require('poloniex-api-node');
let poloniex = new Poloniex();

let poloniexCurrenciesNameArray = new Array();

let poloniexLastPriceArray = new Array();

const getPoloniexCurrenciesName = () => {
    poloniex.returnTicker((err, ticker) => {
        if (err) {
          console.log(err.message);
        } else {
          const tickersKeys = Object.keys(ticker);
          tickersKeys.forEach((value, index, array) => {
              if(value.includes('BTC_')) {
                  poloniexCurrenciesNameArray.push(value);

                  let obj = {};
                  obj.name = value;

                  poloniexLastPriceArray.push(obj);
              }
          });
        }
    });
}

const refreshPoloniexArray = () => {
    poloniex.returnTicker((err, ticker) => {
        if (err) {
          console.log(err.message);
        } else {
          poloniexCurrenciesNameArray.forEach((value, index, array) => {
              if(value === poloniexLastPriceArray[index].name) {
                poloniexLastPriceArray[index].price = ticker[value].last;
              }
          });
        }
    });
}

getPoloniexCurrenciesName();
setInterval(refreshPoloniexArray, 3000);

// 수수료 뽑아내기
// poloniex.returnCurrencies((err, data) => {
//     if (err) {
//         console.log(err.message);
//     } else {
//       console.log(data);
//     }
// });

module.exports = {
    poloniexLastPriceArray : poloniexLastPriceArray
}