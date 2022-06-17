import React, { useCallback } from 'react'
import {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3Context } from "src/hooks";
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal, Modal } from '@pancakeswap/uikit'
import { useLocation } from 'react-router-dom'
import Balance from './components/Balance'
import { IAppSlice } from "../../store/slices/app-slice";
import { IReduxState } from "../../store/slices/state.interface";
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'src/helpers/formatBalance'
import { Stake, StakeWithReferrer, Withdraw } from "src/store/slices/staking-slice";
import {isAddress} from "../../helpers/isAddress"

import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance: BigNumber
  tokenBalance: BigNumber
  tokenName: string
  addLiquidityUrl: string
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`
interface ModalProps {
  title: string
  onDismiss?: () => void

}
const CustomModal: React.FC<ModalProps> = ({ title, onDismiss, ...props }) => (
  <Modal title={title} onDismiss={onDismiss} {...props}>
    <Heading>{title}</Heading>
    <Button>This button Does nothing</Button>
  </Modal>
);


const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  tokenBalance,
  tokenName,
  addLiquidityUrl,
}) => {

  const {connected, connect, address, provider, chainID, checkWrongNetwork} = useWeb3Context(); 
  const location = useLocation();
  const dispatch = useDispatch();

  const app = useSelector<IReduxState, IAppSlice>(state => state.app);
  const lpPrice = new BigNumber(app.LPPrice);

  //*******************************referrer address*****************************//
  const { pathname, search } = useLocation();
  let referrer ="";
  useEffect(() => {
      if (search.slice(5) && isAddress(atob(search.slice(5)))) {
        referrer = atob(search.slice(5));
        console.log("referrer:", referrer);
      }
  }, [referrer]);

  const handleStake = async (amount: string) => {
    if(referrer)
      dispatch(StakeWithReferrer({address, networkID:chainID, provider, amount, referrer}));
    else
      dispatch(Stake({address, networkID:chainID, provider, amount}));
  }


  const handleUnstake = async () => {
    dispatch(Withdraw({networkID:chainID, provider }));
  }

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance, 18, 15).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  const [onPresent1] = useModal(<CustomModal title="Modal 1" />);

  const [onPresentDeposit] = useModal(
     <DepositModal max={tokenBalance} onConfirm={handleStake} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} /> 
    );
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={tokenName} />
  );

  const renderStakingButtons = () => {
    return stakedBalance.eq(0) ? (
      <Button
        variant="success"
        onClick={onPresentDeposit}
      >
        {'Stake LP'}
      </Button>
    ) : (
      <IconButtonWrapper>
        <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
          <MinusIcon color="primary" width="14px" />
        </IconButton>
        <IconButton
          variant="tertiary"
          onClick={onPresent1}
        >
          <AddIcon color="primary" width="14px" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading color={stakedBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance()}</Heading>
        {stakedBalance.gt(0) && lpPrice.gt(0) && (
          <Balance
            fontSize="12px"
            color="textSubtle"
            decimals={2}
            value={getBalanceNumber(lpPrice.times(stakedBalance))}
            unit=" USD"
            prefix="~"
          />
        )}
      </Flex>
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
