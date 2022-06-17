import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { trim } from "../../helpers";
import { useWeb3Context } from "src/hooks";
import { IReduxState } from "../../store/slices/state.interface";
import { IAccountSlice } from "../../store/slices/account-slice";
import { Button, Flex, Heading } from "@pancakeswap/uikit";
import { Harvest } from "src/store/slices/staking-slice";
import { Skeleton } from "@material-ui/lab";
import { Tokens } from "src/constants";
// import useToast from "../../hooks/useToast";
import "./lpstaking.scss";


const HarvestAction = () => {
  const {connected, connect, address, provider, chainID, checkWrongNetwork} = useWeb3Context(); 
  const dispatch = useDispatch();
  const pendingReward = useSelector<IReduxState, number>(state => {
    return state.account.pendingReward;
  });
  const handleHarvest = async () => {
    dispatch(Harvest({networkID:chainID, provider}));
    return;
  }
  const [pendingTx, setPendingTx] = useState(false);


  return (
    <div className="lpstaking-harvest">
        <div className="lpstaking-earned-value">{!connected ? <Skeleton width="80px" /> : <>{pendingReward}</>}</div>
        <Button
          disabled={ connected == false || pendingReward == 0 || pendingTx }
          variant="success" 
          onClick={async () => {
            setPendingTx(true);
            try {
             await handleHarvest();
            } catch (e) {
              console.error(e);
            } finally {
              setPendingTx(false);
            }
          }}
        >
          Harvest
        </Button>
    </div>
  );
};

export default HarvestAction;
