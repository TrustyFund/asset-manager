const assetUtils = require('./AssetUtils');
const { TransactionBuilder } = require('bitsharesjs');
const { key } = require('bitsharesjs');
const { PrivateKey } = require('bitsharesjs');

function createAsset(
  accountId, symbol, precision, description, maxSupply, marketFeePercent, maxMarketFee, cer,
  isBitAsset, isPredictionMarket, privateKey
) {
  const { flagBooleans, permissionBooleans } = assetUtils.getBooleans(isBitAsset);
  const flags = assetUtils.getFlags(flagBooleans);
  const permissions = assetUtils.getPermissions(permissionBooleans, isBitAsset);

  const operationJSON = {
    fee: {
      amount: 0,
      asset_id: 0
    },
    issuer: accountId,
    symbol,
    precision: parseInt(precision, 10),
    common_options: {
      description,
      max_supply: maxSupply,
      market_fee_percent: marketFeePercent,
      max_market_fee: maxMarketFee,
      issuer_permissions: permissions,
      flags,
      core_exchange_rate: cer,
      whitelist_authorities: [],
      blacklist_authorities: [],
      whitelist_markets: [],
      blacklist_markets: [],
    },
    is_prediction_market: isPredictionMarket,
    extensions: null,
  };

  if (isBitAsset) {
    operationJSON.bitasset_opts = assetUtils.getDefaultBitassetOpts;
  }
  const transaction = new TransactionBuilder();
  transaction.add_type_operation('asset_create', operationJSON);
  const pKey = PrivateKey.fromWif(privateKey);
  transaction.set_required_fees().then(() => {
    transaction.add_signer(pKey, pKey.toPublicKey().toPublicKeyString());
    console.log('serialized transaction:', JSON.stringify(transaction.serialize()));
    transaction.broadcast(() => {
      console.log('create uia transaction done');
    });
  });
}

async function issueAsset(issuerAccountId, issueToAccountId, amount, assetId, brainkey) {
  const issueJSON = {
    issuer: issuerAccountId,
    issue_to_account: issueToAccountId,
    asset_to_issue: {
      amount,
      asset_id: assetId,
    }
  };
  const transaction = new TransactionBuilder();
  transaction.add_type_operation('asset_issue', issueJSON);
  const normalizedBrainkey = key.normalize_brainKey(brainkey);
  const pKey = key.get_brainPrivateKey(normalizedBrainkey, 1);
  await transaction.set_required_fees();
  await transaction.add_signer(pKey, pKey.toPublicKey().toPublicKeyString());
  const result = transaction.broadcast();
  return result;
}

function burnAsset(accountId, amount, assetId, privateKey) {
  const burnJSON = {
    payer: accountId,
    amount_to_burn: {
      amount,
      asset_id: assetId,
    }
  };
  const transaction = new TransactionBuilder();
  transaction.add_type_operation('asset_burn', burnJSON);
  const pKey = PrivateKey.fromWif(privateKey);
  transaction.set_required_fees().then(() => {
    transaction.add_signer(pKey, pKey.toPublicKey().toPublicKeyString());
    console.log('serialized transaction:', JSON.stringify(transaction.serialize()));
    transaction.broadcast(() => {
      console.log('burn uia transaction done');
    });
  });
}

function updateAsset(
  issuerAccountId, assetId, maxSupply, marketFeePercent, maxMarketFee, minMarketFee,
  issuerPermissions, flags, cer, privateKey
) {
  const updateJSON = {
    issuer: issuerAccountId,
    asset_to_update: assetId,
    new_options: {
      max_supply: maxSupply,
      market_fee_percent: marketFeePercent,
      max_market_fee: maxMarketFee,
      min_market_fee: minMarketFee,
      issuer_permissions: issuerPermissions,
      flags,
      core_exchange_rate: cer,
      whitelist_authorities: [],
      blacklist_authorities: [],
      whitelist_markets: [],
      blacklist_markets: []
    }
  };
  const transaction = new TransactionBuilder();
  transaction.add_type_operation('asset_update', updateJSON);
  const pKey = PrivateKey.fromWif(privateKey);
  transaction.set_required_fees().then(() => {
    transaction.add_signer(pKey, pKey.toPublicKey().toPublicKeyString());
    console.log('serialized transaction:', JSON.stringify(transaction.serialize()));
    transaction.broadcast(() => {
      console.log('burn uia transaction done');
    });
  });
}

module.exports = {
  createAsset,
  issueAsset,
  burnAsset,
  updateAsset
};
