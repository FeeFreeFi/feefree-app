import {
  CHAIN_ID_ZORA,
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"

const CONFIG = [
  {
    chainId: CHAIN_ID_ZORA,
    router: "0x0Fee97363deEFBE4De038D437D805A98dbEbA400",
    pool: "0xB43287b2106BC044F07aE674794f5492E851d3dC",
    fee: 10000000000000n,
  },
  {
    chainId: CHAIN_ID_BASE_SEPOLIA,
    router: "0x0FEE6485473aF19020D3d073A3Ec3691a298064E",
    pool: "0xAfF728d14d5b33912f1A53D8C4E999a8cCC8228e",
    fee: 10000000000000n,
  },
]

const ALL_ROUTERS_MAP = Object.fromEntries(CONFIG.map(c => [c.chainId, c]))

/**
 * @param {number} chainId
 */
export const getRouterAddress = chainId => ALL_ROUTERS_MAP[chainId].router

/**
 * @param {number} chainId
 */
export const getPoolAddress = chainId => ALL_ROUTERS_MAP[chainId].pool

/**
 * @param {number} chainId
 */
export const getFee = chainId => ALL_ROUTERS_MAP[chainId].fee
