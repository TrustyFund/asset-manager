const assetConstants = require('./AssetConstants');

class AssetUtils {
  static getFlagBooleans(mask, isBitAsset = false) {
    const booleans = {
      charge_market_fee: false,
      white_list: false,
      override_authority: false,
      transfer_restricted: false,
      disable_force_settle: false,
      global_settle: false,
      disable_confidential: false,
      witness_fed_asset: false,
      committee_fed_asset: false
    };

    if (mask === 'all') {
      for (let flag in booleans) {
        if (!isBitAsset && (assetConstants.uia_permission_mask.indexOf(flag) === -1)) {
          delete booleans[flag];
        } else {
          booleans[flag] = true;
        }
      }
      return booleans;
    } else {
      for (let flag in booleans) {
        if (!isBitAsset && (assetConstants.uia_permission_mask.indexOf(flag) === -1)) {
          delete booleans[flag];
        } else {
          if (mask & assetConstants.permission_flags[flag]) {
            booleans[flag] = true;
          }
        }
      }
      return booleans;
    }
  }

  static getBooleans(isBitAsset) {
    const flagBooleans = this.getFlagBooleans(0, isBitAsset);
    const permissionBooleans = this.getFlagBooleans('all', isBitAsset);

    return {
      flagBooleans,
      permissionBooleans
    };
  }

  static getFlags(flagBooleans) {
    const keys = Object.keys(assetConstants.permission_flags);

    let flags = 0;

    keys.forEach(key => {
      if (flagBooleans[key] && key !== 'global_settle') {
        flags += assetConstants.permission_flags[key];
      }
    });

    return flags;
  }

  static getPermissions(flagBooleans, isBitAsset = false) {
    const permissions = isBitAsset ? Object.keys(assetConstants.permission_flags) : assetConstants.uia_permission_mask;
    let flags = 0;
    permissions.forEach(permission => {
      if (flagBooleans[permission] && permission !== 'global_settle') {
        flags += assetConstants.permission_flags[permission];
      }
    });

    if (isBitAsset) {
      flags += assetConstants.permission_flags.global_settle;
    }

    return flags;
  }

  static getDefaultBitassetOpts() {
    return assetConstants.bitasset_opts;
  }

  
}
module.exports = AssetUtils;
