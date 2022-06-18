import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { SurfContract, StakingContract, LpReserveContract } from "../../abi";
import { setAll, getApprovedLPAmount } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { RootState } from "../store";
import { Power } from "@material-ui/icons";

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: { surf: string; };

    referrerNum: number;
    referrerRewards: number;

    LPSupply: number;
    ApprovedLP: number;

    pendingReward: number;
    stakedBalance: number;
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    
    const addresses = getAddresses(networkID);
    const surfContract = new ethers.Contract(addresses.SURF_ADDRESS, SurfContract, provider);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
    const lpReserveContract = new ethers.Contract(addresses.PAIR_ADDRESS, LpReserveContract, provider);

    //**************************************** SURF ********************************************//
    let surfBalance = "0"; 
    surfBalance = await surfContract.balanceOf(address);

    //**************************************** Referral ********************************************//
    let referrerNum = 0; 
    let referrerRewards = 0; 
    // referrerNum = await lpReserveContract.userInfor().referrerNum;
    // referrerRewards = (await lpReserveContract.userInfor().referrerRewards)/Math.pow(10, 5);
    // console.log("Acc-referrerNum",referrerNum);
    // console.log("Acc-referrerRewards", referrerRewards);
    referrerNum = 2;
    referrerRewards = 3.5;

    //**************************************** LP ********************************************//
    let lPSupply = 0; 
    let approvedLP = 0; 
    // approvedLP = await getApprovedLPAmount(address, networkID, provider)/Math.pow(10, 18);
    // lPSupply = await lpReserveContract.balanceOf(address)/Math.pow(10, 18);
    // console.log("Acc-approvedLP", approvedLP);
    // console.log("Acc-lPSupply", lPSupply);
    approvedLP = 0.00;
    lPSupply = 0.00005;

    //**************************************** Staking ********************************************//
    let pendingReward = 0; 
    let stakedBalance = 0;
    // pendingReward = (await stakingContract.pendingSURFReward(address))/ Math.pow(10, 5);
    // stakedBalance = (await stakingContract.userInfor(address).amount)/Math.pow(10, 18);
    // console.log("Acc-pendingReward", pendingReward);
    // console.log("Acc-stakedBalance", stakedBalance);
    pendingReward = 0;
    stakedBalance = 0.000;

    return {
        balances: { surf: ethers.utils.formatUnits(surfBalance, 5) },

        referrerNum: referrerNum,
        referrerRewards: referrerRewards,

        LPSupply: lPSupply,
        ApprovedLP: approvedLP,

        pendingReward: pendingReward,
        stakedBalance: stakedBalance
    };
});



export interface IUserTokenDetails {
    balance: number;
    isBnb?: boolean;
}



export interface IAccountSlice {
    balances: {
        surf: string;
    };
    loading: boolean;
    tokens: { [key: string]: IUserTokenDetails };

    referrerNum: number;
    referrerRewards: number;

    LPSupply: number;
    ApprovedLP: number;

    pendingReward: number;
    stakedBalance: number;
}



const initialState = {
    loading: true,
    balances: { surf: "0" },
    tokens: {},
    referrerNum: 0,
    referrerRewards: 0,

    LPSupply: 0,
    ApprovedLP: 0,

    pendingReward: 0,
    stakedBalance: 0
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
    }
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
