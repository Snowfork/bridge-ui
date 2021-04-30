// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// General
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// External
import {
  Button,
} from '@material-ui/core';

// Local
import { useDispatch, useSelector } from 'react-redux';
import { utils } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { RootState } from '../../redux/reducers';
import { approveERC20, fetchERC20Allowance } from '../../redux/actions/ERC20Transactions';
import LoadingSpinner from '../LoadingSpinner';
import { setShowConfirmTransactionModal } from '../../redux/actions/bridge';
import { REFRESH_INTERVAL_MILLISECONDS } from '../../config';
import { decimals, isErc20 } from '../../types/Asset';
import { doTransfer } from '../../redux/actions/transactions';
import { SwapDirection } from '../../types/types';
// ------------------------------------------
//           LockToken component
// ------------------------------------------
function LockToken(): React.ReactElement {
  const { allowance } = useSelector((state: RootState) => state.ERC20Transactions);
  const { selectedAsset, depositAmount, swapDirection } = useSelector(
    (state: RootState) => state.bridge,
  );
  const [isApprovalPending, setIsApprovalPending] = useState(false);

  const dispatch = useDispatch();
  const currentTokenAllowance = allowance;

  // update allowances to prevent failed transactions
  // e.g the user might spend entire allowance on 1st transaction
  // so we need to update the allowance before sending the 2nd transaction
  useEffect(() => {
    function poll() {
      return setInterval(() => {
        dispatch(fetchERC20Allowance());
      }, REFRESH_INTERVAL_MILLISECONDS);
    }

    const interval = poll();

    return () => {
      clearInterval(interval);
    };
  }, []);

  // lock assets
  const handleDepositToken = async () => {
    try {
      dispatch(doTransfer());
    } catch (e) {
      console.log('Failed to transfer asset', e);
    } finally {
      dispatch(setShowConfirmTransactionModal(false));
    }
  };

  // approve spending of token
  const handleTokenUnlock = async () => {
    try {
      setIsApprovalPending(true);
      await dispatch(approveERC20());
    } catch (e) {
      console.log('error approving!');
    } finally {
      setIsApprovalPending(false);
    }
  };

  const currentAllowanceFormatted = new BigNumber(currentTokenAllowance.toString());
  const depositAmountFormatted = new BigNumber(
    utils.parseUnits(
      depositAmount.toString(),
      decimals(selectedAsset!, swapDirection).from,
    ).toString(),
  );

  // we don't need approval to burn snowDot
  // we only need approval for erc20 transfers in eth -> polkadot direction
  const requiresApproval = swapDirection === SwapDirection.EthereumToPolkadot
  && isErc20(selectedAsset!)
  && depositAmountFormatted.isGreaterThan(currentAllowanceFormatted);

  const DepositButton = () => {
    if (requiresApproval) {
      return (
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={handleTokenUnlock}
          disabled={isApprovalPending}
        >
          Unlock Token
          {
              isApprovalPending && <LoadingSpinner spinnerWidth="40px" spinnerHeight="40px" />
            }
        </Button>
      );
    }

    return (
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={handleDepositToken}
      >
        Deposit
        {' '}
        {selectedAsset?.symbol }
      </Button>
    );
  };

  // Render
  return (
    <DepositButton />
  );
}

export default styled(LockToken)`
`;
