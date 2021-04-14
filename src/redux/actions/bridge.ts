/* eslint-disable @typescript-eslint/ban-types */
import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { SwapDirection, Token } from '../../types';
import { RootState } from '../reducers';
import * as ERC20 from '../../contracts/ERC20.json';
import EthApi from '../../net/eth';
import Polkadot from '../../net/polkadot';
import {
  SET_TOKEN_LIST,
  SET_SELECTED_ASSET,
  SET_DEPOSIT_AMOUNT,
  SET_SWAP_DIRECTION,
  SET_SHOW_CONFIRM_TRANSACTION_MODAL,
} from '../actionsTypes/bridge';
import { TokenData } from '../reducers/bridge';
import { fetchERC20Allowance } from './ERC20Transactions';

export interface SetTokenListPayload { type: string, list: TokenData[] }
export const setTokenList = (list: TokenData[]): SetTokenListPayload => ({
  type: SET_TOKEN_LIST,
  list,
});

export interface SetSelectedAssetPayload {type: string, asset: TokenData}
export const setSelectedAsset = (asset: TokenData)
    : SetSelectedAssetPayload => ({
  type: SET_SELECTED_ASSET,
  asset,
});

export interface SetDepositAmountPayload { type: string, amount: number }
export const setDepositAmount = (amount: number): SetDepositAmountPayload => ({
  type: SET_DEPOSIT_AMOUNT,
  amount,
});

export interface SetSwapDirectionPayload { type: string, direction: SwapDirection }
export const setSwapDirection = (direction: SwapDirection): SetSwapDirectionPayload => ({
  type: SET_SWAP_DIRECTION,
  direction,
});

export interface SetShowConfirmTransactionModalPayload {type: string, open: boolean}
export const setShowConfirmTransactionModal = (open: boolean)
  : SetShowConfirmTransactionModalPayload => ({
  type: SET_SHOW_CONFIRM_TRANSACTION_MODAL,
  open,
});

// async middleware actions
// sets selected asset and updates ERC20 spend allowance
export const updateSelectedAsset = (asset: TokenData):
  ThunkAction<Promise<void>, {}, {}, AnyAction> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>, getState,
): Promise<void> => {
  // upate selected asset
  dispatch(setSelectedAsset(asset));

  // update erc spending allowance
  dispatch(fetchERC20Allowance());
};

// update balances for selected asset
// updates values for selected asset as well as the token list
export const updateBalances = ():
  ThunkAction<Promise<void>, {}, {}, AnyAction> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>, getState,
): Promise<void> => {
  const state = getState() as RootState;
  const { tokens, selectedAsset } = state.bridge;
  const {
    web3, ethAddress, polkadotApi, polkadotAddress,
  } = state.net;

  // fetch updated balances
  const ethBalance = await EthApi.getTokenBalance(web3!, ethAddress!, selectedAsset);
  const polkadotBalance = await Polkadot.getEthBalance(polkadotApi!, polkadotAddress!, selectedAsset);

  // update balance data in token list
  const updatedTokens = tokens!.map((tokenData) => {
    if (tokenData.token.address === selectedAsset?.token.address) {
      return {
        ...tokenData,
        balance: {
          eth: ethBalance,
          polkadot: polkadotBalance,
        },
      };
    }

    return tokenData;
  });
  dispatch(setTokenList(updatedTokens));

  const updatedAsset = { ...selectedAsset };
  updatedAsset.balance = {
    eth: ethBalance,
    polkadot: polkadotBalance,
  };
  dispatch(setSelectedAsset(updatedAsset as TokenData));
};

// use the token list to instantiate contract instances
// and store them in redux. We also query the balance of each token for
// ease of use later
export const initializeTokens = (tokens: Token[]):
  ThunkAction<Promise<void>, {}, {}, AnyAction> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>, getState,
): Promise<void> => {
  const state = getState() as RootState;
  const { ethAddress, polkadotApi, polkadotAddress } = state.net;

  if (state.net.web3?.currentProvider) {
    const web3 = state!.net.web3!;
    // only include tokens from  current network
    const tokenList = tokens.filter(
      (token: Token) => token.chainId
              === Number.parseInt((web3.currentProvider as any).chainId, 16),
    );

    // create a web3 contract instance for each ERC20
    const tokenContractList = tokenList.map(
      async (token: Token) => {
        // eth 'tokens' don't have any contract instance
        let contractInstance = null;
        let ethBalance = '0';
        let polkadotBalance = '0';
        let tokenData;
        // All valid contract addresses have 42 characters ('0x' + address)
        if (token.address.length === 42) {
          //   create token contract instance
          contractInstance = new web3.eth.Contract(
                ERC20.abi as any,
                token.address,
          );
          // create TokenData for eth API
          tokenData = {
            instance: contractInstance,
            token,
          } as TokenData;
        }

        try {
        // return ETH data:
          polkadotBalance = await Polkadot.getEthBalance(
            polkadotApi!,
            polkadotAddress!,
            tokenData,
          );
        } catch (e) {
          console.log('failed reading polkadot balance', e);
        }
        try {
          ethBalance = await EthApi.getTokenBalance(
            web3,
            ethAddress!,
            tokenData,
          );
        } catch (e) {
          console.log('failed reading eth balance', e);
        }
        return {
          token,
          instance: contractInstance,
          balance: {
            eth: ethBalance,
            polkadot: polkadotBalance,
          },
        };
      },
    );
    Promise.all(tokenContractList).then((tokenList) => {
      dispatch(setTokenList(tokenList));
      // set default selected token to first token from list
      dispatch(updateSelectedAsset(tokenList[0]));
    });
  }
};
