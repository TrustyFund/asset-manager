const AssetManager = require('./AssetManager');
const config = require('../config');
const express = require('express');
const bodyParser = require('body-parser');
const transactionWriter = require('./TransactionWriter');
const Checker = require('./Checker');

const fs = require('fs');

async function processWork() {
  const checker = new Checker(config.trustyIssuerId, config.trustyIssuerBrainkey, config.trustyKYCId);

  const host = express();
  host.use(bodyParser.urlencoded({ extended: true }));

  host.post('/approve_user', async (req, res) => {
    const { user, bankaccount } = req.body;
    res.setHeader('Content-Type', 'application/json');
    if ((user !== undefined) && (bankaccount !== undefined)) {
      const writeToBlockChain = await transactionWriter.sendUserToService(user, bankaccount);
      console.log(writeToBlockChain);
      if (writeToBlockChain) {
        res.send(JSON.stringify({
          result: 'OK'
        }));
      }
    }
  });

  host.post('/issue_asset', async (req, res) => {
    const { user, amount } = req.body;
    const result = await checker.checkUserExists(user);
    console.log(result);
  });


  host.listen(config.defaultPort, () => {
    console.log('server is running');
  });

  /*let description = {
    main: 'just test description',
    market: 'BTS',
    shortName: 'TESTUIA',
    visible: true
  };

  description = JSON.stringify(description);
  const coreExchangeRate = {
    base: {
      amount: 1,
      asset_id: '1.3.0'
    },
    quote: {
      amount: 1,
      asset_id: '1.3.1'
    }
  };

  const symbol = 'TESTUIA';
  const maxSupply = 1000000;
  const precision = '4';
  const maxMarketFee = 0;
  const marketFeePercent = 0;
  const isBitAsset = false;
  const isPredictionMarket = false;
  AssetManager.createAsset(
    config.serviceUserId, symbol, precision, description, maxSupply,
    marketFeePercent, maxMarketFee, coreExchangeRate, isBitAsset, isPredictionMarket, config.serviceUserPrivateKey
  );*/
}

module.exports = processWork;
