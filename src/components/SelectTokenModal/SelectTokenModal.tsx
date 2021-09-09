import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import {
  Button,
  Typography,
  Tabs,
  Tab,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';

import { utils } from 'ethers';
import * as S from './SelectTokenModal.style';
import { updateSelectedAsset } from '../../redux/actions/bridge';
import { Asset, decimals, symbols } from '../../types/Asset';
import { SwapDirection } from '../../types/types';
import { useAppSelector } from '../../utils/hooks';

import TabPanel from '../TabPanel';
import { NonFungibleTokens } from './NonFungibleTokens';

const customStyles = {
  overlay: {},
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'hidden',
    padding: '0',
  },
};

type Props = {
  open: boolean;
  onClose: () => void;
};

function SelectTokenModal({
  open,
  onClose,
}: Props): React.ReactElement<Props> {
  const [isOpen, setIsOpen] = useState(open);
  const [searchInput, setSearchInput] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const { assets, swapDirection } = useAppSelector((state) => state.bridge);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsOpen(open);
  }, [open, setIsOpen]);

  function closeModal() {
    setIsOpen(false);
    onClose();
  }

  function handleInputChange(e: React.ChangeEvent<{ value: string }>) {
    setSearchInput(e.currentTarget.value.toLowerCase());
  }

  function handleTokenSelection(selectedAsset: Asset) {
    dispatch(updateSelectedAsset(selectedAsset));
    closeModal();
  }

  // returns display formatted balance for source chain
  function getTokenBalance(asset: Asset): string {
    const { from } = decimals(asset, swapDirection);

    if (swapDirection === SwapDirection.EthereumToPolkadot) {
      return utils.formatUnits(asset.balance.eth, from);
    }
    return utils.formatUnits(asset.balance.polkadot, from);
  }

  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Select Token"
      >
        <S.Wrapper>
          <S.Heading>Select Asset</S.Heading>
          <Tabs value={selectedTab} onChange={(event, newTab) => setSelectedTab(newTab)}>
            <Tab label="Fungible" />
            <Tab label="Non-Fungible" />
          </Tabs>
          <TabPanel value={selectedTab} index={0}>
            <S.Input onChange={handleInputChange} />
            <S.TokenList>
              {
                assets
                  // filter assets by search term
                  ?.filter(
                    (asset: Asset) => asset.name.toLowerCase().includes(searchInput)
                      || asset.symbol.toLowerCase().includes(searchInput),
                  ).map(
                    // render each asset
                    (asset: Asset) => (
                      <S.Token key={`${asset.chainId}-${asset.address}`}>
                        <Button onClick={() => handleTokenSelection(asset)}>
                          <img src={asset.logoUri} alt={`${asset.name} icon`} />
                          <div>
                            <Typography variant="caption">{symbols(asset, swapDirection).from}</Typography>
                            <Typography>{getTokenBalance(asset)}</Typography>
                          </div>
                        </Button>
                      </S.Token>
                    ),
                  )
              }
            </S.TokenList>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <NonFungibleTokens handleTokenSelection={handleTokenSelection} />
          </TabPanel>

          <S.Button onClick={closeModal}>Close</S.Button>
        </S.Wrapper>
      </ReactModal>
    </div>
  );
}

export default SelectTokenModal;
