import React, { useCallback } from 'react'
import {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3Context } from "src/hooks";
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading} from '@pancakeswap/uikit'
import { useLocation } from 'react-router-dom'
import Balance from './components/Balance'
import { IAppSlice } from "../../store/slices/app-slice";
import { IReduxState } from "../../store/slices/state.interface";
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'src/helpers/formatBalance'
import { Stake, StakeWithReferrer, Withdraw } from "src/store/slices/staking-slice";
import {isAddress} from "../../helpers/isAddress"

import {DepositModal1} from './components/DepositModal1'
import {DepositModal2} from './components/DepositModal2'
import {WithdrawModal} from './components/WithdrawModal'


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
      // return getFullDisplayBalance(stakedBalance, 18, 15).toLocaleString()
      return stakedBalanceBigNumber.toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  const renderStakingButtons = () => {
    return stakedBalance.eq(0) ? (
      <DepositModal1 max={stakedBalance} onConfirm={handleUnstake} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl}/>
    ) : (
      <IconButtonWrapper>
        <WithdrawModal max={stakedBalance} onConfirm={handleStake} tokenName={tokenName} />
        <DepositModal2 max={stakedBalance} onConfirm={handleUnstake} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl}/>
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
