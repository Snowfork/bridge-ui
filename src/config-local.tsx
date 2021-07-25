export default {
  // Contract Addresses
  APP_ETH_CONTRACT_ADDRESS: '0x440eDFFA1352B13227e8eE646f3Ea37456deC701',
  APP_ERC20_CONTRACT_ADDRESS: '0x54D6643762E46036b3448659791adAf554225541',
  APP_DOT_CONTRACT_ADDRESS: '0xdAF13FA1997b9649b2bCC553732c67887A68022C',
  APP_ERC721_CONTRACT_ADDRESS: '0x433488cec14C4478e5ff18DDC7E7384Fc416f148',

  SNOW_DOT_ADDRESS: '0xDEBF40cd34f297B44A093D61b64Ac25C94Bc5519',
  BASIC_INBOUND_CHANNEL_CONTRACT_ADDRESS: '0xB1185EDE04202fE62D38F5db72F71e38Ff3E8305',
  BASIC_OUTBOUND_CHANNEL_CONTRACT_ADDRESS: '0xB8EA8cB425d85536b158d661da1ef0895Bb92F1D',
  INCENTIVIZED_INBOUND_CHANNEL_CONTRACT_ADDRESS: '0x8cF6147918A5CBb672703F879f385036f8793a24',
  INCENTIVIZED_OUTBOUND_CHANNEL_CONTRACT_ADDRESS: '0x3f0839385DB9cBEa8E73AdA6fa0CFe07E321F61d',

  // Fetch chain data interval
  REFRESH_INTERVAL_MILLISECONDS: 10000,

  // Polkadotjs API Provider
  POLKADOT_API_PROVIDER: 'ws://localhost:11144',

  // Minimum Number of confirmations required for an ETH transaction
  // to be regarded as a success
  REQUIRED_ETH_CONFIRMATIONS: 1,

  // URL to the block explorer the UI will redirect to
  BLOCK_EXPLORER_URL: 'https://ropsten.etherscan.io',

  PERMITTED_METAMASK_NETWORK: 'private',

  PRICE_CURRENCIES: ['usd'],

  BASIC_CHANNEL_ID: 0,
  INCENTIVIZED_CHANNEL_ID: 1,

};
