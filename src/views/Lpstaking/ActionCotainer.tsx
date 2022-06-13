import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "../../store/slices/state.interface";
import { IPendingTxn } from "../../store/slices/pending-txns-slice";
import { useAddress, useWeb3Context } from "../../hooks";
import { DEFAULD_NETWORK, getAddresses } from "../../constants";
import { Tag, Flex, Button } from '@pancakeswap/uikit';
import ConnetButton from "./components/ConnectButton";
import HarvestAction from "./HarvestAction";
import "./lpstaking.scss";



const ActionCotainer = ({

}) => {
  const address = useAddress();
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
      {!address ? (
        <ConnetButton/>
      ) : (
       <Button variant="success" width="100%" marginTop="8px" >Approve contract</Button>
      )}
    </>
  )

}

export default ActionCotainer;
