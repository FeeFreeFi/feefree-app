import {
  CHAIN_ID_ZORA,
  // CHAIN_ID_BASE,
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"

const CONFIG = [
  {
    chainId: CHAIN_ID_ZORA,
    router: "0x0Fee97363deEFBE4De038D437D805A98dbEbA400",
    pool: "0xB43287b2106BC044F07aE674794f5492E851d3dC",
    fee: 10000000000000n,
  },
  // {
  //   chainId: CHAIN_ID_BASE,
  //   router: "0x0Fee76f15DE74A5211e5Bc2aBF95394d7f50C400",
  //   pool: "0xc08304a5300D9a2310A603b8D7fB8470f752947F",
  //   fee: 10000000000000n,
  // },
  {
    chainId: CHAIN_ID_BASE_SEPOLIA,
    router: "0x0FeeFCeF3d2908e0c3aBe5AD3FbEf63EC1172100",
    pool: "0xD022fD930efeCc608096C5c984ab6c187b7d55D7",
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
