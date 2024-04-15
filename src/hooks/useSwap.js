import { ref } from "vue"
import pMap from "p-map"
import { getTxMeta } from "@/utils/getTxMeta"
import { getStamp } from "@/utils/date"
import {
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"
import {
  isNative,
  getBaseSepoliaToken,
} from "./useCurrency"
import { getPrice } from "./usePrices"
import { byDecimals, fromValue } from "@/utils/bn"
import { getRouterAddress } from "./useRouter"
import { getPublicClient } from "./useClient"

const cache = ref({})

const DURATION = 600
const Q96 = 79228162514264337593543950336n

const CONFIG = [
  {
    chainId: CHAIN_ID_BASE_SEPOLIA,
    pools: [
      {
        currency0: getBaseSepoliaToken("USDC"),
        currency1: getBaseSepoliaToken("OP"),
        currencyLiquidity: getBaseSepoliaToken("USDC-OP"),
        id: "0x8200d68699ce30b6451b9db2ce840a47b0546c6712b07653caa9d58886c97ef9",
      },
      {
        currency0: getBaseSepoliaToken("DAI"),
        currency1: getBaseSepoliaToken("USDC"),
        currencyLiquidity: getBaseSepoliaToken("DAI-USDC"),
        id: "0x9b5aaa46743b74314d96067d526da593f5607bb5d69f3ab035317a99cd886610",
      },
      {
        currency0: getBaseSepoliaToken("ETH"),
        currency1: getBaseSepoliaToken("OP"),
        currencyLiquidity: getBaseSepoliaToken("ETH-OP"),
        id: "0x00a3c928e85fe7c6aeea0fa340740ebca850703309b8fb6b9e732689638e3099",
      },
    ],
  },
]

const ALL_TOKENS = [
  getBaseSepoliaToken("ETH"),
  getBaseSepoliaToken("USDC"),
  getBaseSepoliaToken("DAI"),
  getBaseSepoliaToken("OP"),
]

const ALL_POOLS_MAP = Object.fromEntries(CONFIG.map(c => {
  const { chainId, pools, ...rest } = c
  return pools.map(pool => ({ ...pool, chainId, ...rest }))
}).reduce((sum, item) => sum.concat(item), []).map(item => [item.id, item]))

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

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {stirng} address
 * @param {stirng[]} paths
 * @param {bigint} amountSpecified
 * @returns {{deltaAmounts: bigint[], sqrtPriceX96Afters: bigint[], amountIn:bigint, amountOut:bigint, paths:string[], amountSpecified:bigint}}
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
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}}
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
    value -= amountIn
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
 * @param {stirng} address
 * @param {stirng} currency0
 * @param {stirng} currency1
 * @param {bigint} amount0Desired
 * @param {bigint} amount1Desired
 * @returns {{amount0Min:bigint, amount1Min:bigint, liquidity:bigint}}
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
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}}
 * @param {stirng} address
 * @param {string} currency0
 * @param {string} currency1
 * @param {bigint} amount0Desired
 * @param {bigint} amount1Desired
 * @param {bigint} amount0Min
 * @param {bigint} amount1Min
 * @param {string} to
 */
export const addLiquidity = async ({ publicClient, walletClient }, address, currency0, currency1, amount0Desired, amount1Desired, amount0Min, amount1Min, to) => {
  const account = walletClient.account.address
  let value = 0n
  if (isNative(currency0)) {
    value = amount0Desired
  }
  const deadline = getStamp() + DURATION
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_ADD_LIQUIDITY,
    functionName: 'addLiquidity',
    args: [{ currency0, currency1, amount0Desired, amount1Desired, amount0Min, amount1Min, to, deadline }],
    value,
  })
  const hash = await walletClient.writeContract(request)

  return getTxMeta(hash, publicClient.chain)
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {stirng} address
 * @param {stirng} currency0
 * @param {stirng} currency1
 * @param {bigint} liquidity
 * @returns {{amount0:bigint, amount1:bigint}}
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
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}}
 * @param {stirng} address
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
 * @param {bigint} sqrtPriceX96
 * @param {bigint} liquidity
 */
const getTokenBalances = (sqrtPriceX96, liquidity) => {
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
  const price0 = getPrice(currency0.symbol)
  const price1 = getPrice(currency1.symbol)
  const tvl0 = byDecimals(balance0, currency0.decimals).times(price0).dp(4)
  const tvl1 = byDecimals(balance1, currency1.decimals).times(price1).dp(4)
  const tvl = tvl0.plus(tvl1)
  const percent0 = tvl.eq(0) ? '50%' : `${tvl0.times(100).div(tvl).toFormat(2)}%`
  const percent1 = tvl.eq(0) ? '50%' : `${tvl1.times(100).div(tvl).toFormat(2)}%`

  return { balance0, balance1, percent0, percent1, tvl: BigInt(tvl.dp(0).toString(10)) }
}

const getDefaultState = () => ({
  sqrtPriceX96: 0n,
  liquidity: 0n,
  balance0: 0n,
  balance1: 0n,
  tvl: 0n,
  price0: 0,
  price1: 0,
})

/**
 * @param {string} id
 * @returns {{sqrtPriceX96:bigint, liquidity:bigint, balance0:bigint, balance1:bigint, tvl:bigint, price0:number, price1:number, percent0:string, percent1:string}}
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
 * @param {stirng} id
 */
export const updatePoolState = async id => {
  const { chainId } = getPool(id)
  const publicClient = getPublicClient(chainId)
  const address = getRouterAddress(chainId)
  const [sqrtPriceX96, liquidity] = await publicClient.readContract({
    address,
    abi: ABI_GET_POOL_STATE,
    functionName: 'getPoolState',
    args: [id],
  })

  const { balance0, balance1, tvl, percent0, percent1 } = getPositionData(id, sqrtPriceX96, liquidity)
  const price0 = fromValue(balance1).div(balance0).toNumber()
  const price1 = fromValue(balance0).div(balance1).toNumber()

  cache.value = {
    ...cache.value,
    [id]: { sqrtPriceX96, liquidity, balance0, balance1, tvl, price0, price1, percent0, percent1 },
  }
}

/**
 * @param {stirng[]} ids
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
export const getChainTokens = chainId => ALL_TOKENS.filter(t => t.chainId === chainId)

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
 * @param {{chainId:number, address:string, symbol:string}} inputToken
 * @param {{chainId:number, address:string, symbol:string}} outputToken
 * @returns {{chainId:number, address:string, symbol:string}[][]}
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
 * @param {bigint} sqrtPriceX96
 * @param {bigint} amount1
 */
export const getAmount0FromSqrtPrice = (sqrtPriceX96, amount1) => {
  // sqrtPriceX96 = FACTOR * sqrtPriceX96 / Q96
  // return amount1 * FACTOR2 / sqrtPriceX96 / sqrtPriceX96
  return BigInt(fromValue(amount1 << 192n).div(sqrtPriceX96 * sqrtPriceX96).dp(0).toString(10))
}

/**
 * @param {bigint} sqrtPriceX96
 * @param {bigint} amount0
 */
export const getAmount1FromSqrtPrice = (sqrtPriceX96, amount0) => {
  // sqrtPriceX96 = FACTOR * sqrtPriceX96 / Q96
  // return amount0 * sqrtPriceX96 * sqrtPriceX96 / FACTOR2
  return (sqrtPriceX96 * sqrtPriceX96 * amount0) >> 192n
}
