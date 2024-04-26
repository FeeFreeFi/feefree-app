import {
  CHAIN_ID_ZORA,
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"

const CONFIG = [
  {
    chainId: CHAIN_ID_ZORA,
    router: "0x0FeeD701755c8040F7E1b0CeF8cEE41839270900",
    pool: "0xB43287b2106BC044F07aE674794f5492E851d3dC",
    fee: 10000000000000n,
  },
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
