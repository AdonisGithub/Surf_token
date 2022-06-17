import { BigNumber, ethers, constants } from "ethers";
import { getGasPrice } from "src/helpers/get-gas-price";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { sleep } from "src/helpers";
import { getAddresses, Networks, Tokens } from "src/constants";
import { metamaskErrorWrap } from "src/helpers/metamask-error-wrap";
import { messages } from "src/constants/messages";
import { LpReserveContract, StakingContract } from "src/abi";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { info, success, warning } from "./messages-slice";
import { loadAccountDetails } from "./account-slice";


interface IApproveLP {
    address : string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
} 

export const ApproveLP = createAsyncThunk("approve LP", async({address, networkID, provider}: IApproveLP,{dispatch}) => {
 
    if(!provider){
        dispatch(warning({text:messages.please_connect_wallet}));
        return;
    }
    const signer = provider.getSigner();
    const addresses = getAddresses(networkID);
    const LPContract = new ethers.Contract(addresses.PAIR_ADDRESS, LpReserveContract, signer);
    let amountToApprove = 0;

    amountToApprove = LPContract.balanceOf(address);
    
    let approveTx;
    try {
        const gasPrice = await  getGasPrice(provider);        
        approveTx = await LPContract.approve(addresses.PAIR_ADDRESS, amountToApprove, {gasPrice});
        dispatch(
            fetchPendingTxns({
                txnHash: approveTx.hash,
                text:"Approving",
                type:"approve"
            }),
        );
        await approveTx.wait();
        dispatch(success({text: messages.tx_successfully_send}));
    } catch(err : any) {
        metamaskErrorWrap(err,dispatch);
    } finally {
        if(approveTx){
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }
});

interface IHarvest {
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
} 
export const Harvest = createAsyncThunk("harvest", async({networkID, provider }:IHarvest,{dispatch}) => {
    const signer = provider.getSigner();
    const addresses = getAddresses(networkID);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, signer);
    let approveTx;
    try {
        const gasPrice = await  getGasPrice(provider);        
        approveTx = await stakingContract.harvest({gasPrice});
        dispatch(
            fetchPendingTxns({
                txnHash: approveTx.hash,
                text:"Harvesting",
                type:"harvest"
            }),
        );
        await approveTx.wait();
        dispatch(success({text: messages.tx_successfully_send}));
    } catch(err : any) {
        metamaskErrorWrap(err,dispatch);
    } finally {
        if(approveTx){
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }
});


interface IStake {
    address : string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    amount: string;
} 

export const Stake = createAsyncThunk("Stake", async({address, networkID, provider, amount}: IStake,{dispatch}) => {
 
    if(!provider){
        dispatch(warning({text:messages.please_connect_wallet}));
        return;
    }
    const signer = provider.getSigner();
    const addresses = getAddresses(networkID);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, signer);
    let amountToStaking = "0";
    amountToStaking = BigNumber.from(ethers.utils.parseUnits(amount,18)).toString();

    let approveTx;
    try {
        const gasPrice = await  getGasPrice(provider);        
        approveTx = await stakingContract.deposit(addresses.STAKING_ADDRESS, amountToStaking, {gasPrice});
        dispatch(
            fetchPendingTxns({
                txnHash: approveTx.hash,
                text:"Staking",
                type:"stake"
            }),
        );
        await approveTx.wait();
        dispatch(success({text: messages.tx_successfully_send}));
        await sleep(3);
        await dispatch(loadAccountDetails({networkID, provider, address}));
    } catch(err : any) {
        metamaskErrorWrap(err,dispatch);
    } finally {
        if(approveTx){
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }
});



interface IStakeWithReferrer {
    address : string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    amount: string;
    referrer: string;
} 

export const StakeWithReferrer = createAsyncThunk("StakeWithReferrer", async({address, networkID, provider, amount, referrer}: IStakeWithReferrer,{dispatch}) => {
 
    if(!provider){
        dispatch(warning({text:messages.please_connect_wallet}));
        return;
    }
    const signer = provider.getSigner();
    const addresses = getAddresses(networkID);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, signer);
    let amountToStaking = "0";
    amountToStaking = BigNumber.from(ethers.utils.parseUnits(amount,18)).toString();

    let approveTx;
    try {
        const gasPrice = await  getGasPrice(provider);        
        approveTx = await stakingContract.depositWithReferrer(addresses.STAKING_ADDRESS, amountToStaking, referrer, {gasPrice});
        dispatch(
            fetchPendingTxns({
                txnHash: approveTx.hash,
                text:"StakingwithReferrer",
                type:"stakeWithReferrer"
            }),
        );
        await approveTx.wait();
        dispatch(success({text: messages.tx_successfully_send}));
        await sleep(3);
        await dispatch(loadAccountDetails({networkID, provider, address}));
    } catch(err : any) {
        metamaskErrorWrap(err,dispatch);
    } finally {
        if(approveTx){
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }
});

interface IWithdraw {
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
} 
export const Withdraw = createAsyncThunk("withdraw", async({networkID, provider }:IWithdraw, {dispatch}) => {
    const signer = provider.getSigner();
    const addresses = getAddresses(networkID);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, signer);
    let approveTx;
    try {
        const gasPrice = await  getGasPrice(provider);        
        approveTx = await stakingContract.withdraw({gasPrice});
        dispatch(
            fetchPendingTxns({
                txnHash: approveTx.hash,
                text:"withdrawing",
                type:"withdraw"
            }),
        );
        await approveTx.wait();
        dispatch(success({text: messages.tx_successfully_send}));
    } catch(err : any) {
        metamaskErrorWrap(err,dispatch);
    } finally {
        if(approveTx){
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }
});
