import { ref } from "vue"
import { keccak256, encodeAbiParameters } from "viem"
import pMap from "p-map"
import { uniqBy } from "lodash-es"
import { byDecimals, fromValue } from "@/utils/bn"
import {
  getPoolState as _getPoolState,
  getPoolMeta as _getPoolMeta,
  getPoolIds,
} from "@/contracts/Quoter"
import { getPublicClient } from "./useClient"
import { getManager, getQuoterAddress } from "./useManager"
import { getToken, populateToken } from "./useToken"
import { getPrice } from "./usePrices"

/**
 * @type {import('vue').Ref<{[id:string]: import('@/types').PoolMeta}>}
 */
const config = ref({})

/**
 * @type {import('vue').Ref<{[id:string]: import('@/types').PoolData}>}
 */
const datas = ref({})

// 2n ** 96n
const Q96 = 79228162514264337593543950336n
// 2n ** 192n
const Q192 = 6277101735386680763835789423207666416102355444464034512896n

const MAX_COUNT = 5

const POOL_KEY = {
  name: "params",
  type: "tuple",
  components: [
    { name: "currency0", type: "address" },
    { name: "currency1", type: "address" },
    { name: "fee", type: "uint24" },
    { name: "tickSpacing", type: "int24" },
    { name: "hooks", type: "address" },
  ]
}

/**
 * @returns {import('@/types').PoolData}
 */
const getDefaultPoolData = () => ({
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
 * @param {bigint} sqrtPriceX96
 * @param {bigint} liquidity
 */
export const getBalances = (sqrtPriceX96, liquidity) => {
  if (sqrtPriceX96 === 0n) {
    return { balance0: 0n, balance1: 0n }
  }

  const balance0 = Q96 * liquidity / sqrtPriceX96
  const balance1 = liquidity * sqrtPriceX96 / Q96

  return { balance0, balance1 }
}

/**
 * @param {import('@/types').PoolMeta} pool
 */
const updatePoolData = async pool => {
  const { chainId, id, currency0, currency1 } = pool

  const { sqrtPriceX96, liquidity }  = await getPoolState(chainId, id)

  const dp = currency0.decimals - currency1.decimals
  const factor = 10 ** dp
  const { balance0, balance1, tvl, percent0, percent1 } = getPositionData(id, sqrtPriceX96, liquidity)
  const priceX192 = sqrtPriceX96 * sqrtPriceX96
  const price0 = fromValue(priceX192).times(factor).div(Q192).toNumber()
  const price1 = fromValue(Q192).div(priceX192).div(factor).toNumber()

  datas.value[id] = { sqrtPriceX96, liquidity, balance0, balance1, tvl, price0, price1, percent0, percent1 }
}

/**
 * @param {string} input
 * @param {string} output
 * @param {import('@/types').PoolMeta[]} pools
 */
const findPool = (input, output, pools) => {
  const [currency0, currency1] = input.toLowerCase() < output.toLowerCase() ? [input, output] : [output, input]
  return pools.findIndex(it => it.currency0.address === currency0 && it.currency1.address === currency1)
}

/**
 * @param {import('@/types').PoolMeta} pool
 * @param {string} currency
 */
const mapPool = (pool, currency) => pool.currency0.address === currency ? pool.currency1 : pool.currency1.address === currency ? pool.currency0 : null

/**
 * @param {string} id
 */
export const getPool = id => config.value[id]

/**
 * @param {import('@/types').PoolMeta} pool
 */
export const getPoolName = pool => `${pool.currency0.symbol}-${pool.currency1.symbol}`

/**
 * @param {number} chainId
 * @param {boolean} hot
 */
export const getPools = (chainId = undefined, hot = undefined) => {
  const list = Object.values(config.value)
  return list.filter(it => (!chainId || it.chainId === chainId) && (hot === undefined || it.hot === hot))
}

/**
 * @param {import('@/types').PoolInfo[]} pools
 */
export const addPools = pools => {
  const items = Object.fromEntries(pools.map(it => {
    const { id, chainId } = it
    const meta = {
      id,
      chainId,
      currency0: getToken(chainId, it.currency0),
      currency1: getToken(chainId, it.currency1),
      hot: true,
    }
    return [id, meta]
  }))

  config.value = {
    ...config.value,
    ...items,
  }
}

/**
 * @param {number} chainId
 * @param {string} id
 * @returns {Promise<import('@/types').PoolMeta>}
 */
export const fetchPoolMeta = async (chainId, id) => {
  let meta = getPool(id)

  if (!meta) {
    const quoter = getQuoterAddress(chainId)
    const publicClient = getPublicClient(chainId)
    const { currency0, currency1, } = await _getPoolMeta(publicClient, quoter, id)
    config.value[id] = {
      id,
      chainId,
      currency0: populateToken(currency0),
      currency1: populateToken(currency1),
      hot: false,
    }
    meta = config.value[id]
  }

  return meta
}

/**
 * @param {number} chainId
 * @param {string} id
 */
const getPoolState = async (chainId, id) => {
  const quoter = getQuoterAddress(chainId)
  const publicClient = getPublicClient(chainId)
  const { sqrtPriceX96, liquidity } = await _getPoolState(publicClient, quoter, id)

  return { id, sqrtPriceX96, liquidity }
}

/**
 * @param {number} chainId
 * @param {string} account
 */
export const loadMyPools = async (chainId, account) => {
  const quoter = getQuoterAddress(chainId)
  if (!quoter || !account) {
    return []
  }

  const publicClient = getPublicClient(chainId)

  let poolIds = await getPoolIds(publicClient, quoter, account)
  poolIds = [...new Set(poolIds)]

  return pMap(poolIds, async id => fetchPoolMeta(chainId, id), { concurrency: 3 })
}

/**
 * @param {number} chainId
 * @param {string} currency0
 * @param {string} currency1
 */
const getPoolKey = (chainId, currency0, currency1) => {
  currency0 = currency0.toLowerCase()
  currency1 = currency1.toLowerCase()
  if (currency0 > currency1) {
    [currency0, currency1] = [currency1, currency0]
  }

  const { hooks } = getManager(chainId)
  return {
    currency0,
    currency1,
    fee: 0n,
    tickSpacing: 60n,
    hooks,
  }
}

/**
 * @param {number} chainId
 * @param {string} currency0
 * @param {string} currency1
 */
export const getPoolId = (chainId, currency0, currency1) => {
  return keccak256(encodeAbiParameters([POOL_KEY], [getPoolKey(chainId, currency0, currency1)]))
}

/**
 * @param {number} chainId
 */
export const getPoolTokens = chainId => {
  const tokens = getPools(chainId).map(pool => [pool.currency0, pool.currency1]).flat()
  return uniqBy(tokens, "address")
}

/**
 * @param {import('@/types').Token} inputToken
 * @param {import('@/types').Token} outputToken
 * @returns {import('@/types').Token[][]}
 */
export const findPaths = (inputToken, outputToken) => {
  if (!inputToken || !outputToken || inputToken.chainId !== outputToken.chainId) {
    return []
  }

  const { chainId } = inputToken
  const pools = getPools(chainId)
  const paths = []
  const index = findPool(inputToken.address, outputToken.address, pools)
  if (index >= 0) {
    paths.push([inputToken, outputToken])
    pools.splice(index, 1)
  }

  const items1 = pools.map(it => mapPool(it, inputToken.address)).filter(Boolean)
  const items2 = pools.map(it => mapPool(it, outputToken.address)).filter(Boolean)
  const mediators = items1.filter(it => items2.find(it2 => it2.address === it.address))
  if (mediators.length > 0) {
    paths.push(...mediators.map(it => [inputToken, it, outputToken]))
  }

  if (paths.length < MAX_COUNT) {
    items1.forEach(x => {
      items2.forEach(y => {
        if (paths.length < MAX_COUNT && findPool(x.address, y.address, pools) >= 0) {
          paths.push([inputToken, x, y, outputToken])
        }
      })
    })
  }

  return paths.slice(0, MAX_COUNT)
}

/**
 * @param {string} id
 * @param {bigint} sqrtPriceX96
 * @param {bigint} liquidity
 */
export const getPositionData = (id, sqrtPriceX96, liquidity) => {
  const { currency0, currency1 } = getPool(id)
  const { balance0, balance1 } = getBalances(sqrtPriceX96, liquidity)
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

/**
 * @param {import('@/types').PoolMeta[]} pools
 */
export const updatePoolDatas = async pools => {
  await pMap(pools, updatePoolData, { concurrency: 3 })
}

/**
 * @param {import('@/types').PoolMeta} pool
 */
export const getPoolData = (pool = null) => {
  return pool && datas.value[pool.id] || getDefaultPoolData()
}

/**
 * @param {import('@/types').PoolMeta[]} pools
 */
export const getPoolDatas = pools => {
  return Object.fromEntries(pools.map(it => [it.id, getPoolData(it)]))
}

/**
 * @param {import('@/types').Token} token0
 * @param {import('@/types').Token} token1
 */
export const getPoolInitState = async (token0, token1) => {
  const { chainId } = token0
  const id = getPoolId(chainId, token0.address, token1.address)
  if (getPool(id)) {
    return { id, initialized: true }
  }

  const state = await getPoolState(chainId, id)
  return { id, initialized: state.sqrtPriceX96 > 0n }
}
