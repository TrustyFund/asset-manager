module.exports = {
  bitsharesNodes: [
    'wss://bitshares.openledger.info/ws',
    'wss://eu.openledger.info/ws',
    'wss://bit.btsabc.org/ws',
    'wss://bts.ai.la/ws',
    'wss://bitshares.apasia.tech/ws',
    'wss://japan.bitshares.apasia.tech/ws',
    'wss://bitshares.dacplay.org/ws',
    'wss://bitshares-api.wancloud.io/ws',
    'wss://openledger.hk/ws',
    'wss://bitshares.crypto.fans/ws',
    'wss://ws.gdex.top',
    'wss://dex.rnglab.org',
    'wss://dexnode.net/ws',
    'wss://kc-us-dex.xeldal.com/ws',
    'wss://btsza.co.za:8091/ws',
    'wss://api.bts.blckchnd.com',
    'wss://eu.nodes.bitshares.ws',
    'wss://us.nodes.bitshares.ws',
    'wss://sg.nodes.bitshares.ws',
    'wss://ws.winex.pro'
  ],
  bitasset_opts: {
    feed_lifetime_sec: 60 * 60 * 24,
    minimum_feeds: 7,
    force_settlement_delay_sec: 60 * 60 * 24,
    force_settlement_offset_percent: 100,
    maximum_force_settlement_volume: 2000,
    short_backing_asset: '1.3.0'
  },
  serviceUserId: '1.2.512210', //hobb1t
  trustyKYCId: '1.2.512210', //hobb1t
  trustyIssuerId: '1.2.772147', //trusty-issuer
  trustyKYCBrainkey: '',
  trustyIssuerBrainkey: '',
  defaultPort: 3000,
  defaultIssueAssetId: '1.3.2'
};
