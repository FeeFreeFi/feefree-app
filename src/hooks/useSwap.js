import { ref } from "vue"
import pMap from "p-map"
import { uniqWith } from "lodash-es"
import { getTxMeta } from "@/utils/chain"
import { getStamp } from "@/utils/date"
import {
  CHAIN_ID_ZORA,
  CHAIN_ID_BASE,
  CHAIN_ID_SCROLL,
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"
import {
  isNative,
  getZoraToken,
  getBaseToken,
  getScrollToken,
  getBaseSepoliaToken,
  isSame,
} from "./useCurrency"
import { getPrice } from "./usePrices"
import { byDecimals, fromValue } from "@/utils/bn"
import { Q96, Q192 } from "@/utils/uniswap"
import { getRouterAddress } from "./useRouter"
import { getPublicClient } from "./useClient"

const cache = ref({})

const DURATION = 600

const CONFIG = [
  {
    chainId: CHAIN_ID_ZORA,
    pools: [
      {
        name: 'ETH-USDzC',
        currency0: getZoraToken("ETH"),
        currency1: getZoraToken("USDzC"),
        currencyLiquidity: getZoraToken("ETH-USDzC"),
        id: "0x219a2c0f153258a81f975771ac32114e75de77c8bde22cf64d9aed0f20c8c13d",
      },
    ],
    pairs: [
      {
        currency0: getZoraToken("ETH"),
        currency1: getZoraToken("ETH+"),
      },
      {
        currency0: getZoraToken("USDzC"),
        currency1: getZoraToken("USDzC+"),
      },
    ],
  },
  {
    chainId: CHAIN_ID_BASE,
    pools: [
      {
        name: 'ETH-USDC',
        currency0: getBaseToken("ETH"),
        currency1: getBaseToken("USDC"),
        currencyLiquidity: getBaseToken("ETH-USDC"),
        id: "0x9532d36802d2394beedee1165fe1c0cb008a19cf3eab78410b7b2ea2cd885880",
      },
    ],
    pairs: [
      {
        currency0: getBaseToken("ETH"),
        currency1: getBaseToken("ETH+"),
      },
      {
        currency0: getBaseToken("USDC"),
        currency1: getBaseToken("USDC+"),
      },
      {
        currency0: getBaseToken("DAI"),
        currency1: getBaseToken("DAI+"),
      },
    ],
  },
  {
    chainId: CHAIN_ID_SCROLL,
    pools: [
      {
        name: 'ETH-USDC',
        currency0: getScrollToken("ETH"),
        currency1: getScrollToken("USDC"),
        currencyLiquidity: getScrollToken("ETH-USDC"),
        id: "0x869a780ad43922adb0be93b2c2c460e4eec9ede0b6155ca609e4fcdaecd3aa3e",
      },
    ],
    pairs: [
      {
        currency0: getScrollToken("ETH"),
        currency1: getScrollToken("ETH+"),
      },
      {
        currency0: getScrollToken("USDC"),
        currency1: getScrollToken("USDC+"),
      },
      {
        currency0: getScrollToken("USDT"),
        currency1: getScrollToken("USDT+"),
      },
      {
        currency0: getScrollToken("DAI"),
        currency1: getScrollToken("DAI+"),
      },
    ],
  },
  {
    chainId: CHAIN_ID_BASE_SEPOLIA,
    pools: [
      {
        name: 'ETH-USDC',
        currency0: getBaseSepoliaToken("ETH"),
        currency1: getBaseSepoliaToken("USDC"),
        currencyLiquidity: getBaseSepoliaToken("ETH-USDC"),
        id: "0x8a3dcc870d81e599dbc212ef5da1f76d229fa7d3b085d8ba33f4c9419b0b79b8",
      },
      {
        name: 'DAI-USDC',
        currency0: getBaseSepoliaToken("DAI"),
        currency1: getBaseSepoliaToken("USDC"),
        currencyLiquidity: getBaseSepoliaToken("DAI-USDC"),
        id: "0xec90af283207ebc0c6bb1d1678a6721b1d68d40009bdac2931b8a582335c7802",
      },
      {
        name: 'ETH-OP',
        currency0: getBaseSepoliaToken("ETH"),
        currency1: getBaseSepoliaToken("OP"),
        currencyLiquidity: getBaseSepoliaToken("ETH-OP"),
        id: "0x15b8224b42969f338efd221d969748cac4b8565b2b252ce06e076c1be1ab4163",
      },
    ],
    pairs: [
      {
        currency0: getBaseSepoliaToken("ETH"),
        currency1: getBaseSepoliaToken("ETH+"),
      },
      {
        currency0: getBaseSepoliaToken("USDC"),
        currency1: getBaseSepoliaToken("USDC+"),
      },
      {
        currency0: getBaseSepoliaToken("DAI"),
        currency1: getBaseSepoliaToken("DAI+"),
      },
      {
        currency0: getBaseSepoliaToken("OP"),
        currency1: getBaseSepoliaToken("OP+"),
      },
    ],
  },
]

const SWAP_TOKENS = [
  getZoraToken("ETH"),
  getZoraToken("USDzC"),

  getBaseToken("ETH"),
  getBaseToken("USDC"),

  getScrollToken("ETH"),
  getScrollToken("USDC"),

  getBaseSepoliaToken("ETH"),
  getBaseSepoliaToken("USDC"),
  getBaseSepoliaToken("DAI"),
  getBaseSepoliaToken("OP"),
]

const EXCHANGE_TOKENS = CONFIG.map(c => c.pairs.map(pair => [pair.currency0, pair.currency1]).flat()).flat()

const ALL_TOKENS = uniqWith(SWAP_TOKENS.concat(EXCHANGE_TOKENS), isSame)

const ALL_POOLS_MAP = Object.fromEntries(CONFIG.map(c => {
  const { chainId, pools, ...rest } = c
  return pools.map(pool => ({ ...pool, chainId, ...rest }))
}).reduce((sum, item) => sum.concat(item), []).map(item => [item.id, item]))

const ALL_PAIRS_MAP = Object.fromEntries(CONFIG.map(c => [c.chainId, c.pairs]))

const IS_EXCHANGE_TOKENS = Object.fromEntries(CONFIG.map(c => [c.chainId, Object.fromEntries(c.pairs.map(p => [p.currency1.address, true]))]))

const SUPPORTED_CHAINS = CONFIG.map(c => ({ chainId: c.chainId }))

const ABI_ADD_LIQUIDITY = [
  {
    type: "function",
    name: "addLiquidity",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "currency0", type: "address" },
          { name: "currency1", type: "address" },
          { name: "amount0Desired", type: "uint128" },
          { name: "amount1Desired", type: "uint128" },
          { name: "amount0Min", type: "uint128" },
          { name: "amount1Min", type: "uint128" },
          { name: "to", type: "address" },
          { name: "deadline", type: "uint96" }
        ]
      }
    ],
    outputs: [{ name: "liquidity", type: "uint128" }],
    stateMutability: "payable"
  }
]

const ABI_REMOVE_LIQUIDITY = [
  {
    type: "function",
    name: "removeLiquidity",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "currency0", type: "address" },
          { name: "currency1", type: "address" },
          { name: "liquidity", type: "uint128" },
          { name: "deadline", type: "uint96" }
        ]
      }
    ],
    outputs: [{ name: "delta", type: "int256" }],
    stateMutability: "nonpayable"
  }
]

const ABI_SWAP = [
  {
    type: "function",
    name: "swap",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "paths", type: "address[]" },
          { name: "sqrtPriceX96Limits", type: "uint160[]" },
          { name: "amountSpecified", type: "int128" },
          { name: "to", type: "address" },
          { name: "deadline", type: "uint96" }
        ]
      }
    ],
    outputs: [{ name: "delta", type: "int256" }],
    stateMutability: "payable"
  }
]

const ABI_EXCHANGE = [
  {
    type: "function",
    name: "exchange",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "currency", type: "address" },
          { name: "amountSpecified", type: "int128" },
          { name: "to", type: "address" }
        ]
      }
    ],
    outputs: [],
    stateMutability: "payable"
  }
]

const ABI_QUOTE_SWAP = [
  {
    type: "function",
    name: "quoteSwap",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "paths", type: "address[]" },
          { name: "amountSpecified", type: "int128" }
        ]
      }
    ],
    outputs: [
      { name: "deltaAmounts", type: "int128[]" },
      { name: "sqrtPriceX96Afters", type: "uint160[]" }
    ],
    stateMutability: "nonpayable"
  }
]

const ABI_QUOTE_ADD_LIQUIDITY = [
  {
    type: "function",
    name: "quoteAddLiquidity",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "currency0", type: "address" },
          { name: "currency1", type: "address" },
          { name: "amount0Desired", type: "uint128" },
          { name: "amount1Desired", type: "uint128" }
        ]
      }
    ],
    outputs: [
      { name: "amount0Min", type: "uint128" },
      { name: "amount1Min", type: "uint128" },
      { name: "liquidity", type: "uint128" }
    ],
    stateMutability: "nonpayable"
  }
]

const ABI_QUOTE_REMOVE_LIQUIDITY = [
  {
    type: "function",
    name: "quoteRemoveLiquidity",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "currency0", type: "address" },
          { name: "currency1", type: "address" },
          { name: "liquidity", type: "uint128" }
        ]
      }
    ],
    outputs: [
      { name: "amount0", type: "uint128" },
      { name: "amount1", type: "uint128" }
    ],
    stateMutability: "nonpayable"
  },
]

const ABI_GET_POOL_STATE = [
  {
    type: "function",
    name: "getPoolState",
    inputs: [{ name: "id", type: "bytes32" }],
    outputs: [
      { name: "sqrtPriceX96", type: "uint160" },
      { name: "liquidity", type: "uint128" }
    ],
    stateMutability: "view"
  }
]

export const getSupportedChains = () => SUPPORTED_CHAINS

/**
 * @param {number} chainId
 */
export const isSupportChain = chainId => !!SUPPORTED_CHAINS.find(it => it.chainId === chainId)

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string[]} paths
 * @param {bigint} amountSpecified
 * @returns {Promise<import('@/types').SwapQuoteData>}
 */
export const quoteSwap = async (publicClient, address, paths, amountSpecified) => {
  const { result } = await publicClient.simulateContract({
    address,
    abi: ABI_QUOTE_SWAP,
    functionName: 'quoteSwap',
    args: [{ paths, amountSpecified }],
  })

  const [deltaAmounts, sqrtPriceX96Afters] = result
  return {
    deltaAmounts,
    sqrtPriceX96Afters,
    amountIn: -deltaAmounts[0],
    amountOut: deltaAmounts[deltaAmounts.length - 1],
    paths,
    amountSpecified,
  }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string[]} paths
 * @param {bigint[]} sqrtPriceX96Limits
 * @param {bigint} amountIn
 * @param {bigint} amountSpecified
 * @param {string} to
 * @param {bigint} fee
 */
export const swap = async ({ publicClient, walletClient }, address, paths, sqrtPriceX96Limits, amountIn, amountSpecified, to, fee) => {
  const account = walletClient.account.address
  let value = fee
  if (isNative(paths[0])) {
    value += amountIn
  }

  const deadline = getStamp() + DURATION
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_SWAP,
    functionName: 'swap',
    args: [{ paths, sqrtPriceX96Limits, amountSpecified, to, deadline }],
    value,
  })
  const hash = await walletClient.writeContract(request)

  return getTxMeta(hash, publicClient.chain)
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} currency0
 * @param {string} currency1
 * @param {bigint} amount0Desired
 * @param {bigint} amount1Desired
 * @returns {Promise<import('@/types').DepositQuoteData>}
 */
export const quoteAddLiquidity = async (publicClient, address, currency0, currency1, amount0Desired, amount1Desired) => {
  const { result } = await publicClient.simulateContract({
    address,
    abi: ABI_QUOTE_ADD_LIQUIDITY,
    functionName: 'quoteAddLiquidity',
    args: [{ currency0, currency1, amount0Desired, amount1Desired }],
  })

  const [amount0Min, amount1Min, liquidity] = result
  return {
    amount0Min,
    amount1Min,
    liquidity,
  }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} currency0
 * @param {string} currency1
 * @param {bigint} amount0Desired
 * @param {bigint} amount1Desired
 * @param {bigint} amount0Min
 * @param {bigint} amount1Min
 * @param {string} to
 */
export const addLiquidity = async ({ publicClient, walletClient }, address, currency0, currency1, amount0Desired, amount1Desired, amount0Min, amount1Min, to = '') => {
  const account = walletClient.account.address
  let value = 0n
  if (isNative(currency0)) {
    value = amount0Min
  }
  const deadline = getStamp() + DURATION
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_ADD_LIQUIDITY,
    functionName: 'addLiquidity',
    args: [{ currency0, currency1, amount0Desired, amount1Desired, amount0Min, amount1Min, to: to || account, deadline }],
    value,
  })
  const hash = await walletClient.writeContract(request)

  return getTxMeta(hash, publicClient.chain)
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} currency0
 * @param {string} currency1
 * @param {bigint} liquidity
 * @returns {Promise<import('@/types').WithdrawQuoteData>}
 */
export const quoteRemoveLiquidity = async (publicClient, address, currency0, currency1, liquidity) => {
  const { result } = await publicClient.simulateContract({
    address,
    abi: ABI_QUOTE_REMOVE_LIQUIDITY,
    functionName: 'quoteRemoveLiquidity',
    args: [{ currency0, currency1, liquidity }],
  })

  const [amount0, amount1] = result
  return {
    amount0,
    amount1,
  }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} currency0
 * @param {string} currency1
 * @param {bigint} liquidity
 */
export const removeLiquidity = async ({ publicClient, walletClient }, address, currency0, currency1, liquidity) => {
  const account = walletClient.account.address
  const deadline = getStamp() + DURATION
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_REMOVE_LIQUIDITY,
    functionName: 'removeLiquidity',
    args: [{ currency0, currency1, liquidity, deadline }],
  })
  const hash = await walletClient.writeContract(request)

  return getTxMeta(hash, publicClient.chain)
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} currency
 * @param {bigint} amountSpecified
 * @param {string} to
 * @param {bigint} fee
 */
export const exchange = async ({ publicClient, walletClient }, address, currency, amountSpecified, to, fee) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_EXCHANGE,
    functionName: 'exchange',
    args: [{ currency, amountSpecified, to }],
    value: amountSpecified < 0 && isNative(currency) ? -amountSpecified + fee : fee,
  })
  const hash = await walletClient.writeContract(request)

  return getTxMeta(hash, publicClient.chain)
}

/**
 * @param {bigint} sqrtPriceX96
 * @param {bigint} liquidity
 */
export const getTokenBalances = (sqrtPriceX96, liquidity) => {
  if (sqrtPriceX96 === 0n) {
    return { balance0: 0n, balance1: 0n, price0: 0, price1: 0 }
  }

  const balance0 = Q96 * liquidity / sqrtPriceX96
  const balance1 = liquidity * sqrtPriceX96 / Q96

  return { balance0, balance1 }
}

/**
 * @param {string} id
 * @param {bigint} sqrtPriceX96
 * @param {bigint} liquidity
 */
export const getPositionData = (id, sqrtPriceX96, liquidity) => {
  const { currency0, currency1 } = getPool(id)
  const { balance0, balance1 } = getTokenBalances(sqrtPriceX96, liquidity)
  const price0 = getPrice(currency0.key)
  const price1 = getPrice(currency1.key)
  const tvl0 = byDecimals(balance0, currency0.decimals).times(price0).dp(4)
  const tvl1 = byDecimals(balance1, currency1.decimals).times(price1).dp(4)
  const tvl = tvl0.plus(tvl1)
  const percent0 = tvl.eq(0) ? '50%' : `${tvl0.times(100).div(tvl).toFormat(2)}%`
  const percent1 = tvl.eq(0) ? '50%' : `${tvl1.times(100).div(tvl).toFormat(2)}%`

  return {
    balance0,
    balance1,
    percent0,
    percent1,
    tvl: BigInt(tvl.dp(0).toString(10)),
    liquidity,
  }
}

const getDefaultState = () => ({
  sqrtPriceX96: 0n,
  liquidity: 0n,
  balance0: 0n,
  balance1: 0n,
  tvl: 0n,
  price0: 0,
  price1: 0,
  percent0: "0%",
  percent1: "0%",
})

/**
 * @param {string} id
 * @returns {import('@/types').PoolState}
 */
export const getPoolState = id => {
  return cache.value[id] || getDefaultState()
}

/**
 * @param {string[]} ids
 */
export const getPoolStates = ids => {
  return Object.fromEntries(ids.map(id => [id, getPoolState(id)]))
}

/**
 * @param {string} id
 */
export const updatePoolState = async id => {
  const { chainId, currency0, currency1 } = getPool(id)
  const publicClient = getPublicClient(chainId)
  const address = getRouterAddress(chainId)
  const [sqrtPriceX96, liquidity] = await publicClient.readContract({
    address,
    abi: ABI_GET_POOL_STATE,
    functionName: 'getPoolState',
    args: [id],
  })

  const dp = currency0.decimals - currency1.decimals
  const factor = 10 ** dp
  const { balance0, balance1, tvl, percent0, percent1 } = getPositionData(id, sqrtPriceX96, liquidity)
  const priceX96 = sqrtPriceX96 * sqrtPriceX96
  const price0 = fromValue(priceX96).times(factor).div(Q192).toNumber()
  const price1 = fromValue(Q192).div(priceX96).div(factor).toNumber()

  cache.value = {
    ...cache.value,
    [id]: { sqrtPriceX96, liquidity, balance0, balance1, tvl, price0, price1, percent0, percent1 },
  }
}

/**
 * @param {string[]} ids
 */
export const updatePoolStates = async ids => {
  await pMap(ids, updatePoolState, { concurrency: 3 })
}

/**
 * @param {number} chainId
 */
export const getPools = chainId => Object.values(ALL_POOLS_MAP).filter(p => p.chainId === chainId)

/**
 * @param {string} poolId
 */
export const getPool = poolId => ALL_POOLS_MAP[poolId]

/**
 * @param {string} poolId
 */
export const isValidPool = poolId => !!ALL_POOLS_MAP[poolId]

/**
 * @param {number} chainId
 */
export const getChainTokens = chainId => ALL_TOKENS.filter(it => it.chainId === chainId)

/**
 *
 * @param {import('@/types').Token} token
 */
export const findSwapOtherToken = token => {
  return SWAP_TOKENS.find(t => t.chainId === token.chainId && t.address !== token.address)
}

/**
 * @param {import('@/types').Token} inputToken
 * @param {import('@/types').Token} outputToken
 * @param {import('@/types').Pool[]} pools
 */
const findPath = (inputToken, outputToken, pools) => {
  const [a, b] = inputToken.address.toLowerCase() < outputToken.address.toLowerCase() ? [inputToken.address, outputToken.address] : [outputToken.address, inputToken.address]
  const pool = pools.find(it => it.currency0.address === a && it.currency1.address === b)
  if (pool) {
    return [inputToken, outputToken]
  }

  return false
}

const mapPool = (pool, token) => pool.currency0.address === token.address ? pool.currency1 : pool.currency1.address === token.address ? pool.currency0 : null

/**
 * @param {import('@/types').Token} inputToken
 * @param {import('@/types').Token} outputToken
 * @returns {import('@/types').Token[][]}
 */
export const findPaths = (inputToken, outputToken) => {
  if (!inputToken || !outputToken || inputToken.chainId !== outputToken.chainId) {
    return []
  }

  const pools = getPools(inputToken.chainId)
  let path = findPath(inputToken, outputToken, pools)
  if (path) {
    return [path]
  }

  const items1 = pools.map(it => mapPool(it, inputToken)).filter(Boolean)
  const items2 = pools.map(it => mapPool(it, outputToken)).filter(Boolean)
  const mediators = items1.filter(it => items2.find(it2 => it2.address === it.address))
  if (mediators.length > 0) {
    return mediators.map(it => [inputToken, it, outputToken])
  }

  const paths = []
  items1.forEach(x => {
    items2.forEach(y => {
      path = findPath(x, y, pools)
      if (path) {
        paths.push([inputToken, x, y, outputToken])
      }
    })
  })

  return paths
}

/**
 * @param {import('@/types').Token} inputToken
 * @param {import('@/types').Token} outputToken
 * @param {import('@/types').SwapQuoteData} quote
 */
export const checkValueChange = (inputToken, outputToken, quote) => {
  const inputValue = byDecimals(quote.amountIn, inputToken.decimals).times(getPrice(inputToken.symbol)).dp(inputToken.dp).toNumber()
  const outputValue = byDecimals(quote.amountOut, outputToken.decimals).times(getPrice(outputToken.symbol)).dp(outputToken.dp).toNumber()

  if (inputValue === 0 || outputValue > inputValue) {
    return null
  }

  const percent = (inputValue - outputValue) / inputValue

  if (percent <= 0.05) {
    return null
  }

  return {
    inputToken,
    outputToken,
    amountIn: quote.amountIn,
    amountOut: quote.amountOut,
    inputValue,
    outputValue,
    percent,
  }
}

/**
 * @param {number} chainId
 */
export const getExchangePairs = chainId => ALL_PAIRS_MAP[chainId] || []

/**
 * @param {import('@/types').Token} token
 */
export const isExchangeToken = token => !!(IS_EXCHANGE_TOKENS[token.chainId][token.address])

// /**
//  * @param {import('@/types').Token} token0
//  * @param {import('@/types').Token} token1
//  */
// export const isExchangePair = (token0, token1) => {
//   const otherToken = findExchangeOtherToken(token0)
//   return otherToken ? isSame(otherToken, token1) : false
// }

/**
 * @param {import('@/types').Token} token
 */
export const isSwapToken = token => !!(SWAP_TOKENS.find(it => isSame(it, token)))

/**
 * @param {import('@/types').Token} token
 */
export const findExchangeOtherToken = token => {
  const pairs = ALL_PAIRS_MAP[token.chainId] || []
  const pair = pairs.find(p => p.currency0.address === token.address || p.currency1.address === token.address)
  return pair.currency0.address === token.address ? pair.currency1 : pair.currency0
}
