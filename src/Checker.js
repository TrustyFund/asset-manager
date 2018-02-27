const { Apis } = require('bitsharesjs-ws');
const { Aes } = require('bitsharesjs');
const { key } = require('bitsharesjs');

class Checker {
  constructor(serviceUserId, privateBrainkey, kycUserId) {
    this.serviceUserId = serviceUserId;
    this.kycUserId = kycUserId;
    const normalizedBrainkey = key.normalize_brainKey(privateBrainkey);
    this.privateKey = key.get_brainPrivateKey(normalizedBrainkey, 1);
  }

  async checkUserExists(user) {
    const allHistory = await this.getAllHistory();
    console.log(allHistory.length);
    const pass = allHistory.find((item) => this.checkIsKYC(item, user));
    return !!pass;
  }

  checkIsKYC(operation, userForCheck) {
    let pass = false;
    const transfer = operation.op[1];

    if (transfer.from !== this.kycUserId) {
      return pass;
    }

    let message = undefined;
    if (transfer.memo) {
      try{
        message = this.decryptMemo(transfer.memo);
        console.log(message);
      } catch(ex) {
        console.log('ex:', ex);
        return pass;
      }
      try {
        const parsed = JSON.parse(message);
        const { user, bankaccount } = parsed;
        if (user !== undefined && bankaccount !== undefined) {
          if (user === userForCheck) {
            pass = true;
          }
        }
      } catch (ex) {
        return pass;
      }
    }
    return pass;
  }

  decryptMemo(memo) {
    return Aes.decrypt_with_checksum(
      this.privateKey,
      memo.from,
      memo.nonce,
      memo.message
    ).toString('utf-8');
  }

  async getAllHistory() {
    const allHistory = [];

    // Because of bitshares fetching from new to old, we need to ensure that no messages missed
    let fromId = '1.11.999999999';

    // We need await in loop because each request depends on previous
    // eslint-disable-next-line no-await-in-loop
    for (;;) {
      const history = await this.getSegmentHistory(fromId);
      if ((allHistory.length > 0 && history[0].id === allHistory[allHistory.length - 1].id) || !history.length) {
        break;
      }
      allHistory.push(...history);
      fromId = allHistory[allHistory.length - 1].id;
    }
    return allHistory;
  }

  getSegmentHistory(fromId, toId = '1.11.0') {
    return Apis.instance().history_api().exec('get_account_history_operations', [this.serviceUserId, 0, fromId, toId, 100]);
  }
}

module.exports = Checker;
