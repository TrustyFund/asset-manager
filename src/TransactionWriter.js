const { TransactionHelper } = require('bitsharesjs');
const { Aes } = require('bitsharesjs');
const { TransactionBuilder } = require('bitsharesjs');
const { key } = require('bitsharesjs');
const { Apis } = require('bitsharesjs-ws');
const config = require('../config');

async function sendUserToService(userName, bankaccount) {
  const [fromAccount] = await Apis.instance().db_api().exec('get_objects', [[config.trustyKYCId]]);
  const [toAccount] = await Apis.instance().db_api().exec('get_objects', [[config.trustyIssuerId]]);
  const normalizedBrainkey = key.normalize_brainKey(config.trustyKYCBrainkey);
  const pKey = key.get_brainPrivateKey(normalizedBrainkey, 1);
  console.log(pKey);

  let memo = {
    user: userName,
    bankaccount
  };
  memo = JSON.stringify(memo);

  const memoFromKey = fromAccount.options.memo_key;
  const memoToKey = toAccount.options.memo_key;
  const nonce = TransactionHelper.unique_nonce_uint64();

  const memoMessage = Aes.encrypt_with_checksum(
    pKey,
    memoToKey,
    nonce,
    memo,
  );
  const memoObject = {
    from: memoFromKey,
    to: memoToKey,
    nonce,
    message: memoMessage
  };

  const transaction = new TransactionBuilder();

  transaction.add_type_operation('transfer', {
    fee: {
      amount: 0,
      asset_id: '1.3.0'
    },
    from: fromAccount.id,
    to: toAccount.id,
    amount: {
      amount: 1,
      asset_id: '1.3.0'
    },
    memo: memoObject
  });


  await transaction.set_required_fees();
  await transaction.add_signer(pKey, pKey.toPublicKey().toPublicKeyString());
  const result = await transaction.broadcast();
  return result;
}

module.exports = {
  sendUserToService
};
