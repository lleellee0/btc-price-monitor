const poloniex = require('./poloniex');
const bittrex = require('./bittrex');

const express = require('express');
const app = express();

let totalTable = new Array();

app.use(express.static('public'));

app.get('/poloniex', (req, res) => {
    res.json(poloniex.poloniexLastPriceArray);
});

app.get('/bittrex', (req, res) => {
    res.json(bittrex.bittrexLastPriceArray);
});

app.get('/total', (req, res) => {
    res.json(totalTable);
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});


const makeTotalTable = () => {
    for(let i = 0; i < poloniex.poloniexLastPriceArray.length; i++) {
        let obj = {};
        obj.name = poloniex.poloniexLastPriceArray[i].name.replace('_', '-');
        totalTable.push(obj);
    }

    for(let i = 0; i < bittrex.bittrexLastPriceArray.length; i++) {
        let flag = false;
        for(let j = 0; j < totalTable.length; j++) {
            if(bittrex.bittrexLastPriceArray[i].name === totalTable[j].name) {
                flag = false;
                break;
            } else {
                flag = true;
            }
        }
        if(flag === true) {
            let obj = {};
            obj.name = bittrex.bittrexLastPriceArray[i].name;
            totalTable.push(obj);
            // break;
        }
    }
}

const refreshTotalTable = () => {
    console.log(`refreshTotalTable is called!`);
    for(let i = 0; i < poloniex.poloniexLastPriceArray.length; i++) {
        for(let j = 0; j < totalTable.length; j++) {
            if(poloniex.poloniexLastPriceArray[i].name.replace('_', '-') === totalTable[j].name) {
                totalTable[j].poloniexPrice = parseFloat(poloniex.poloniexLastPriceArray[i].price);
                break;
            }
        }
    }

    for(let i = 0; i < bittrex.bittrexLastPriceArray.length; i++) {
        for(let j = 0; j < totalTable.length; j++) {
            if(bittrex.bittrexLastPriceArray[i].name === totalTable[j].name) {
                totalTable[j].bittrexPrice = bittrex.bittrexLastPriceArray[i].price;
                break;
            }
        }
    }

    for(let i = 0; i < totalTable.length; i++) {    // Percent 계산하기
        if(totalTable[i].poloniexPrice && totalTable[i].bittrexPrice) {
            totalTable[i].percent = ((totalTable[i].poloniexPrice - totalTable[i].bittrexPrice) / totalTable[i].poloniexPrice * 100).toFixed(2);
        }
    }

    for(let i = 0; i < totalTable.length; i++) {    // 비어있는 것 삭제
        if(!(totalTable[i].poloniexPrice && totalTable[i].bittrexPrice)) {
            totalTable.splice(i, 1);
            i--;
        }
    }

    totalTable.sort((a, b) => { // 정렬
        return Math.abs(b.percent) - Math.abs(a.percent);
    });
}

setTimeout(makeTotalTable, 5000);
setInterval(refreshTotalTable, 10000);
