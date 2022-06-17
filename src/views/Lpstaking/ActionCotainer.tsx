import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IReduxState } from "../../store/slices/state.interface";
import { IAccountSlice } from "../../store/slices/account-slice";
import {useWeb3Context } from "../../hooks";
import { Tag, Flex, Button } from '@pancakeswap/uikit';
import ConnetButton from "./components/ConnectButton";
import HarvestAction from "./HarvestAction";
import { ApproveLP } from "src/store/slices/staking-slice";
import StakeAction from './StakeAction'
import BigNumber from 'bignumber.js'
import "./lpstaking.scss";



const ActionCotainer = () => {

  const dispatch = useDispatch();
  const {connected, connect, address, provider, chainID, checkWrongNetwork} = useWeb3Context(); 
  const account = useSelector<IReduxState, IAccountSlice>(state => state.account);
  const stakedBalance = new BigNumber( account.stakedBalance);
  const tokenBalance = new BigNumber(account.LPSupply);
  const approvedBalance =new BigNumber(account.ApprovedLP);
  const isapproved = address &&  approvedBalance && approvedBalance.gt(0);
  const [requestedApproval, setRequestedApproval] = useState(false)

  
  const handleApprove = async () => {
    setRequestedApproval(true)
    dispatch(ApproveLP({address, networkID:chainID, provider}));
    setRequestedApproval(false)
    return;
  }

  const renderApprovalOrStakeButton = () => {
    return isapproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={"LP"}
        addLiquidityUrl={"https://"}
      />
    ) : (
      <Button variant="success" width="100%" marginTop="8px" disabled={requestedApproval}  onClick={handleApprove} >Approve contract</Button>
    )
  }

  return (
    <>
      <div className="lpstaking-title">
        <span className="lpstaking-title2">SURF</span>
        <span className="lpstaking-title1"> EARNED</span>
      </div>
      <HarvestAction/>
      <div className="lpstaking-title">
        <span className="lpstaking-title2">SURF-BNB LP</span>
        <span className="lpstaking-title1"> STAKED</span>
      </div>
      {!connected ? <ConnetButton/>: renderApprovalOrStakeButton()}
    </>
  )

}

export default ActionCotainer;
