const AssetManager = require('./AssetManager');
const config = require('../config');
const express = require('express');
const bodyParser = require('body-parser');
const transactionWriter = require('./TransactionWriter');
const Checker = require('./Checker');
const { Apis } = require('bitsharesjs-ws');

async function processWork() {
  const checker = new Checker(config.trustyIssuerId, config.trustyKYCBrainkey, config.trustyKYCId);

  const host = express();
  host.use(bodyParser.urlencoded({ extended: true }));

  host.post('/approve_user', async (req, res) => {
    const { user, bankaccount } = req.body;
    res.setHeader('Content-Type', 'application/json');
    if ((user !== undefined) && (bankaccount !== undefined)) {
      const writeToBlockChain = await transactionWriter.sendUserToService(user, bankaccount);
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
    if (result) {
      const toAccount = await Apis.instance().db_api().exec('get_account_by_name', [user]);
      const issued = await AssetManager.issueAsset(config.trustyIssuerId, toAccount.id, amount, config.defaultIssueAssetId, config.trustyIssuerBrainkey);
      if (issued) {
        res.send(JSON.stringify({
          result: 'OK'
        }));
      }
    }
  });


  host.listen(config.defaultPort, () => {
    console.log('server is running');
  });
}

module.exports = processWork;
