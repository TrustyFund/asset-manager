const AssetManager = require('./AssetManager');
const config = require('../config');

function processWork() {
  let description = {
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
    config.serviceUsertId, symbol, precision, description, maxSupply,
    marketFeePercent, maxMarketFee, coreExchangeRate, isBitAsset, isPredictionMarket, config.serviceUserPrivateKey
  );
}


module.exports = processWork;
