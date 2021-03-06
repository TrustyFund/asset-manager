module.exports = {
  uia_permission_mask: [
    'charge_market_fee',
    'white_list',
    'override_authority',
    'transfer_restricted',
    'disable_confidential'
  ],

  permission_flags: {
    charge_market_fee    : 0x01, /**< an issuer-specified percentage of all market trades in this asset is paid to the issuer */
    white_list           : 0x02, /**< accounts must be whitelisted in order to hold this asset */
    override_authority   : 0x04, /**< issuer may transfer asset back to himself */
    transfer_restricted  : 0x08, /**< require the issuer to be one party to every transfer */
    disable_force_settle : 0x10, /**< disable force settling */
    global_settle        : 0x20, /**< allow the bitasset issuer to force a global settling -- this may be set in permissions, but not flags */
    disable_confidential : 0x40, /**< allow the asset to be used with confidential transactions */
    witness_fed_asset    : 0x80, /**< allow the asset to be fed by witnesses */
    committee_fed_asset  : 0x100 /**< allow the asset to be fed by the committee */
  },

  bitasset_opts: {
    feed_lifetime_sec: 60 * 60 * 24,
    minimum_feeds: 7,
    force_settlement_delay_sec: 60 * 60 * 24,
    force_settlement_offset_percent: 100,
    maximum_force_settlement_volume: 2000,
    short_backing_asset: '1.3.0'
  },
};
