import {
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"

const CONFIG = [
  {
    chainId: CHAIN_ID_BASE_SEPOLIA,
    router: "0x000017f113C10dE643B6FE57dacD17d7ABE500FF",
    pool: "0x81d0fCD3a651f7ceB3Fb01358aE9E732d5271d5d",
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
