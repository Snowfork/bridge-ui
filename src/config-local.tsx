export default {
  // Contract Addresses
  APP_ETH_CONTRACT_ADDRESS: '0xB1185EDE04202fE62D38F5db72F71e38Ff3E8305',
  APP_ERC20_CONTRACT_ADDRESS: '0x3f0839385DB9cBEa8E73AdA6fa0CFe07E321F61d',
  APP_DOT_CONTRACT_ADDRESS: '0x8cF6147918A5CBb672703F879f385036f8793a24',
  APP_ERC721_CONTRACT_ADDRESS: '0x54D6643762E46036b3448659791adAf554225541',

  SNOW_DOT_ADDRESS: '0x0c8df76790248eD9045415882cdC1eF924E23216',

  BASIC_INBOUND_CHANNEL_CONTRACT_ADDRESS: '0x774667629726ec1FaBEbCEc0D9139bD1C8f72a23',
  BASIC_OUTBOUND_CHANNEL_CONTRACT_ADDRESS: '0xF8F7758FbcEfd546eAEff7dE24AFf666B6228e73',
  INCENTIVIZED_INBOUND_CHANNEL_CONTRACT_ADDRESS: '0x83428c7db9815f482a39a1715684dCF755021997',
  INCENTIVIZED_OUTBOUND_CHANNEL_CONTRACT_ADDRESS: '0xEE9170ABFbf9421Ad6DD07F6BDec9D89F2B581E0',

  // Fetch chain data interval
  REFRESH_INTERVAL_MILLISECONDS: 10000,

  // Polkadotjs API Provider
  POLKADOT_API_PROVIDER: 'ws://localhost:11144',

  // Minimum Number of confirmations required for an ETH transaction
  // to be regarded as a success
  REQUIRED_ETH_CONFIRMATIONS: 1,

  // URL to the block explorer the UI will redirect to
  BLOCK_EXPLORER_URL: 'https://ropsten.etherscan.io',
  SNOWBRIDGE_EXPLORER_URL: 'https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A11144#/explorer',

  PERMITTED_METAMASK_NETWORK: 'private',
  PERMITTED_METAMASK_NETWORK_ID: '0x???',

  BASIC_CHANNEL_ID: 0,
  INCENTIVIZED_CHANNEL_ID: 1,

};
