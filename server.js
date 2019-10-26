// const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const express = require('express');
const cors = require('cors');

const axios = require('axios');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());


//https://www.worldcoinindex.com/apiservice/v2getmarkets?key=kLrrpre9ySdJ5mXyMFj1lKiqr4pIkv&fiat=USD
//https://www.worldcoinindex.com/apiservice/ticker?key=kLrrpre9ySdJ5mXyMFj1lKiqr4pIkv&label=btcbtc-ethbtc-ltcbtc-xrpbtc&fiat=usd

const apiKey = 'kLrrpre9ySdJ5mXyMFj1lKiqr4pIkv';

let marketsUSD = null;
let marketsBTC = null;

const getMarketData = fiat => {
  return axios.get(`https://www.worldcoinindex.com/apiservice/v2getmarkets?key=kLrrpre9ySdJ5mXyMFj1lKiqr4pIkv&fiat=${fiat}`)
    .then(response => {
      return response.data.Markets[0];
    });
}

Promise.all([getMarketData('USD'), getMarketData('BTC')])
  .then(result => {
    marketsUSD = result[0];
    marketsBTC = result[1];
  })

let intervalHandler = setInterval(() => {
  getMarketData();
}, 60000 * 5);

/*
Label: "007/USD"
​​​​​​
Name: "007coin"
​​​​​​
Price: 0.72532284
​​​​​​
Timestamp: 1569759060
​​​​​​
Volume_24h: 0
*/

app.get('/', function (req, res) {
  res.send(JSON.stringify({ Hello: 'World' }));
});

app.get('/market/', (req, res) => {
  if (req.query.fiat === 'USD') {
    res.status(200).json(marketsUSD.find(market => market.Name === req.query.marketName));
  } else {
    res.status(200).json(marketsBTC.find(market => market.Name === req.query.marketName));
  }
});

app.get('/images/:coinName', (req, res) => {
  res.sendFile(`${path.join(__dirname, 'images')}/${req.params.coinName}.png`, [{ headers: {} }]);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`)
});




