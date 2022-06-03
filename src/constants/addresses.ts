import { Networks } from "./blockchain";

const BSC_MAINNET = {
    SURF_ADDRESS : "0x6Cbd8ECaF789324233039FDB8711a29f3f8d0a61",
    FIREPIT_ADDRESS : "0x790C475BE03456F56311Dd03713E3Ce33808810e",
    TREASURY_ADDRESS : "0x99283e8a35Bea9ee5B150a28A75130B1b4A58EeB",
    SIF_ADDRESS : "0x19223a53C6ED168e67F91c949e79eD3cFF86E76E",
    PAIR_ADDRESS : "0xa0c54ee121c4804371500e72346e0fd06c80180e",
    BUSD_ADDRESS : "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.BSC) return BSC_MAINNET;
    throw Error("Network don't support");
};
