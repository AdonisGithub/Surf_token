import { ethers } from "ethers";
import { LpReserveContract } from "src/abi";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const pairAddress = "0xa0c54ee121c4804371500e72346e0fd06c80180e";
    const pairContract = new ethers.Contract(pairAddress, LpReserveContract,provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0]  / reserves[1];
    return marketPrice/Math.pow(10,13);
}
