// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import styled from 'styled-components';
import * as S from './AppEth.style';
import PolkadotAccount from '../PolkadotAccount/';
import Net from '../../net';

import {
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  FormHelperText,
  Divider,
} from '@material-ui/core';

import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import IconButton from '../IconButton';

// ------------------------------------------
//                  Props
// ------------------------------------------
type Props = {
  net: Net;
  handleSwap: any;
  children?: JSX.Element | JSX.Element[];
};

// ------------------------------------------
//               AppETH component
// ------------------------------------------
function AppETH({
  net,
  handleSwap,
  children,
}: Props): React.ReactElement<Props> {
  // State
  const [depositAmount, setDepositAmount] = useState(String);

  const handleClick = () => {
    handleSwap();
  };

  function SendButton() {
    if (Number(depositAmount) > 0) {
      return (
        <Button
          color="primary"
          onClick={() => net?.eth?.send_eth(depositAmount)}
          variant="outlined"
        >
          <Typography variant="button">Send ETH</Typography>
        </Button>
      );
    } else {
      return (
        <Button disabled color="primary" variant="outlined">
          <Typography variant="button">Send ETH</Typography>
        </Button>
      );
    }
  }

  // Render
  return (
    <Grid container>
      <Grid
        container
        item
        xs={10}
        md={8}
        justify="center"
        spacing={3}
        style={{
          background: 'white',
          margin: '0 auto',
          padding: '2em 0',
          border: 'thin solid #E0E0E0',
        }}
      >
        <Grid item xs={10}>
          <Typography gutterBottom variant="h5">
            <S.HeadingContainer>
              Eth
              <IconButton
                style={{ marginLeft: '10px' }}
                icon={<FaLongArrowAltLeft size="2.5em" />}
                onClick={handleClick}
              />
              <IconButton
                primary
                style={{ marginRight: '10px' }}
                icon={<FaLongArrowAltRight size="2.5em" />}
                onClick={handleClick}
              />
              Polkadot
            </S.HeadingContainer>
          </Typography>
        </Grid>

        {/* SS58 Address Input */}
        <Grid item xs={10}>
          <FormControl>
            <PolkadotAccount address={net.polkadotAddress} />
          </FormControl>
          <FormHelperText id="ethAmountDesc">
            Polkadot Receiving Address
          </FormHelperText>
        </Grid>

        {/* ETH Deposit Amount Input */}
        <Grid item xs={10}>
          <FormControl>
            <Typography gutterBottom>Amount</Typography>
            <TextField
              InputProps={{
                value: depositAmount,
              }}
              id="eth-input-amount"
              type="number"
              margin="normal"
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.00 ETH"
              style={{ margin: 5 }}
              variant="outlined"
            />
            <FormHelperText id="ethAmountDesc">
              How much ETH would you like to deposit?
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Send ETH */}
        <Grid item xs={10}>
          <SendButton />
        </Grid>
      </Grid>
      <Divider />
    </Grid>
  );
}

export default React.memo(styled(AppETH)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`);