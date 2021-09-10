import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import {
  setShowConfirmTransactionModal, setSwapDirection,
} from '../../../redux/actions/bridge';
import { SwapDirection, Chain } from '../../../types/types';

import {
  dotSelector,
  etherSelector,
  tokenBalancesByNetwork,
} from '../../../redux/reducers/bridge';
import { getChainsFromDirection } from '../../../utils/common';
import { AssetType, decimals } from '../../../types/Asset';
import { useAppSelector } from '../../../utils/hooks';
import SelectedFungibleToken from './SelectedFungibleToken';
import { SelectedNFT } from '../SelectedNFT';
import { SelectAnAsset } from '../SelectAnAsset';

import Panel from '../../Panel/Panel';
import ChainDisplay from './ChainDisplay';
import DirectionBadge from './DirectionBadge';
import DOSButton from '../../Button/DOSButton';
import SwitchButton from '../../Button/SwitchButton';
import FungibleTokenBalance from './FungibleTokenBalance';

const INSUFFICIENT_GAS_ERROR = 'Insufficient gas';

type Props = {
  className?: string;
  setShowAssetSelector: (show: boolean) => void,
}

const TransferPanel = ({ className, setShowAssetSelector }: Props) => {
  // state
  const tokenBalances = useAppSelector(tokenBalancesByNetwork);
  const dot = useAppSelector(dotSelector);
  const ether = useAppSelector(etherSelector);

  const polkadotGasBalance = dot?.balance?.polkadot;
  const ethereumGasBalance = ether?.balance?.eth;

  const [errors, setErrors] = useState<{ balance?: string, asset?: string }>({
    balance: undefined,
    asset: undefined,
  });

  const {
    selectedAsset,
    depositAmount,
    swapDirection,
  } = useAppSelector((state) => state.bridge);

  const dispatch = useDispatch();
  const decimalMap = decimals(selectedAsset, swapDirection);

  // check the user has enough gas for the transaction
  useEffect(() => {
    let hasEnoughGas;

    // check eth balance for eth -> polkadot transactions
    if (swapDirection === SwapDirection.EthereumToPolkadot) {
      hasEnoughGas = Number.parseFloat(ethereumGasBalance) > 0;
    } else {
      // check DOT balance for polkadot -> eth transactions
      hasEnoughGas = Number.parseFloat(polkadotGasBalance) > 0;
    }

    if (!hasEnoughGas) {
      setErrors((errors) => ({ ...errors, gas: INSUFFICIENT_GAS_ERROR }));
    } else {
      setErrors(
        (errors) => ({ ...errors, gas: undefined }),
      );
    }
  }, [swapDirection, selectedAsset, ethereumGasBalance, polkadotGasBalance]);

  const setAssetError = (assetError: string) => {
    setErrors((errors) => ({ ...errors, asset: assetError }));
  }

  const handleTransferClicked = () => {
    dispatch(setShowConfirmTransactionModal(true));
  };

  const changeTransactionDirection = () => {
    if (swapDirection === SwapDirection.EthereumToPolkadot) {
      dispatch(setSwapDirection(SwapDirection.PolkadotToEthereum));
    } else {
      dispatch(setSwapDirection(SwapDirection.EthereumToPolkadot));
    }
  };

  const selectedAssetSourceChain = selectedAsset?.chain === Chain.ETHEREUM ? 0 : 1;
  const selectedAssetValid = selectedAsset?.type === 0 ||
    (selectedAsset?.type === 1 && selectedAssetSourceChain === swapDirection);
  const errorText = (selectedAsset?.type === AssetType.ERC20 && errors.asset) || errors.balance;

  const isDepositDisabled = !!errorText
    || (selectedAsset?.type === AssetType.ERC20 && Number.parseFloat(depositAmount) <= 0) || !selectedAssetValid;

  const chains = getChainsFromDirection(swapDirection);

  return (
    <Panel className={className}>
      <Panel>
        <div className='chain-direction-display'>
          <DirectionBadge direction="From" />
          <ChainDisplay chain={chains.from} />
        </div>
        {selectedAsset?.type === 0 &&
          <SelectedFungibleToken setShowAssetSelector={setShowAssetSelector} setError={setAssetError} />}
        {selectedAsset?.type === 1 && selectedAssetValid &&
          <SelectedNFT setShowAssetSelector={setShowAssetSelector} />}
        {!selectedAssetValid &&
          <SelectAnAsset setShowAssetSelector={setShowAssetSelector} />}
      </Panel>

      <div>
        <SwitchButton onClick={changeTransactionDirection} />
      </div>

      <Panel>
        <div className='chain-direction-display'>
          <DirectionBadge direction="To" />
          <ChainDisplay chain={chains.to} />
        </div>
        {selectedAsset?.type === 0 &&
          <FungibleTokenBalance amount={tokenBalances.destinationNetwork}
            decimals={decimalMap.to} />}
      </Panel>

      <div color="error">
        {errorText}
      </div>

      <DOSButton
        onClick={handleTransferClicked}
        disabled={isDepositDisabled}
      >
        Transfer Asset(s)
      </DOSButton>

    </Panel>
  );
};

export default styled(TransferPanel)`
  width: 520px;
  align-items: center;
  gap: 15px;

  border: 1px solid ${props => props.theme.colors.transferPanelBorder};
  background: ${props => props.theme.colors.transferPanelBackground};

  .chain-direction-display {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    gap: 5px;
  }
`;