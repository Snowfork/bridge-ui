import { Channel } from './types/types';
import localAddresses from './contracts-local.json'

export default {
  // Contract Addresses
  CONTRACT_ADDRESS: localAddresses,
  
  // Fetch chain data interval
  REFRESH_INTERVAL_MILLISECONDS: 10000,

  // Health check data refresh interval
  HEALTH_CHECK_POLL_INTERVAL_MILLISECONDS: 120_000,
  // Health check will check at most n blocks from ethereum for time information
  HEALTH_CHECK_ETHEREUM_POLL_MAX_BLOCKS: 2000,
  // Health check will check at most n blocks from polkadot for time information
  HEALTH_CHECK_POLKADOT_POLL_MAX_BLOCKS: 20000,
  // Allow health check to skip blocks for performance
  HEALTH_CHECK_POLKADOT_POLL_SKIP_BLOCKS: 500,

  // Disables the option to transfer nfts.
  DISABLE_NFT_ASSETS: false,

  // Polkadotjs API Provider
  POLKADOT_API_PROVIDER: 'ws://localhost:11144',
  POLKADOT_RELAY_API_PROVIDER: 'ws://localhost:9944',

  // Minimum Number of confirmations required for an ETH transaction
  // to be regarded as a success
  REQUIRED_ETH_CONFIRMATIONS: 1,

  // URL to the block explorer the UI will redirect to
  BLOCK_EXPLORER_URL: 'https://ropsten.etherscan.io',
  SNOWBRIDGE_EXPLORER_URL: 'https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A11144#/explorer',

  PERMITTED_ETH_NETWORK: 'private',
  PERMITTED_ETH_NETWORK_ID: '0x???',

  BASIC_CHANNEL_ID: 0,
  INCENTIVIZED_CHANNEL_ID: 1,
  ACTIVE_CHANNEL: Channel.INCENTIVIZED,

  //Asset id for wrapped Ether  
  PARACHAIN_ETHER_ASSET_ID: 0,
  //Key required for connection with walletconnect
  INFURA_KEY: process.env.REACT_APP_INFURA_KEY,
  PARACHAIN_LIST : [
    { "parachainName":'Snowbridge', "parachainId": 0, 'isDisabled':false, 'transactionFee': 0 },
    { "parachainName":'Snowbridge-test', "parachainId": 1001,'isDisabled':false, 'transactionFee': 4000000 },
    { "parachainName":'Acala (coming soon...)', "parachainId": 0,'isDisabled':true, 'transactionFee': 0 },
    { "parachainName":'Moonbeam (coming soon...)', "parachainId": 0,'isDisabled':true, 'transactionFee': 0 },
    { "parachainName":'Bifrost (coming soon...)', "parachainId": 0,'isDisabled':true, 'transactionFee': 0 },
    { "parachainName":'Kusama (coming soon...)', "parachainId": 0, 'isDisabled':true, 'transactionFee': 0 },
    { "parachainName":'Snowbridge (coming soon...)', "parachainId": 0,'isDisabled':true, 'transactionFee': 0 }
  ]
};
