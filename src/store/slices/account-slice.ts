import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { SurfContract, Erc20Contract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { RootState } from "../store";


interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        surf: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    
    const addresses = getAddresses(networkID);
    const surfContract = new ethers.Contract(addresses.SURF_ADDRESS, SurfContract, provider);
    const surfBalance = await surfContract.balanceOf(address);
    return {
        balances: {
            surf: ethers.utils.formatUnits(surfBalance, 5),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        surf: string;
    };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    
    let surfBalance = 0; 
    const addresses = getAddresses(networkID);
    if (addresses.SURF_ADDRESS) {
        const surfContract = new ethers.Contract(addresses.SURF_ADDRESS, SurfContract, provider);
        surfBalance = await surfContract.balanceOf(address);
    }
    return {
        balances: {
            surf: ethers.utils.formatUnits(surfBalance, 5),
        }
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
}

const initialState: IAccountSlice = {
    loading: true,
    balances: { surf: "0" },
    tokens: {},
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
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
