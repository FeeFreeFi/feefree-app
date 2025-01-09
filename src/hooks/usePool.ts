import type { PoolData, PoolInfo, PoolMeta, Token } from "@/types"
import { ref } from "vue"
import { keccak256, encodeAbiParameters } from "viem"
import pMap from "p-map"
import { intersectionBy, uniqBy } from "lodash-es"
import { byDecimals, fromValue } from "@/utils"
import {
  getPoolState as _getPoolState,
  getPoolMeta as _getPoolMeta,
  getPoolIds,
} from "@/contracts/Quoter"
import { getPublicClient } from "./useClient"
import { getManager, getQuoterAddress } from "./useManager"
import { getToken, populateToken } from "./useToken"
import { getPrice } from "./usePrices"

const config = ref<{[id:string]: PoolMeta}>({})

const datas = ref<{[id:string]: PoolData}>({})

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
}) as PoolData

export const getBalances = (sqrtPriceX96: bigint, liquidity: bigint) => {
  if (sqrtPriceX96 === 0n) {
    return { balance0: 0n, balance1: 0n }
  }

  const balance0 = Q96 * liquidity / sqrtPriceX96
  const balance1 = liquidity * sqrtPriceX96 / Q96

  return { balance0, balance1 }
}

const updatePoolData = async (pool: PoolMeta) => {
  const { chainId, id, currency0, currency1 } = pool

  const { sqrtPriceX96, liquidity }  = await getPoolState(chainId, id)

  const dp = currency0.decimals - currency1.decimals
  const factor = 10 ** dp
  const { balance0, balance1, tvl, percent0, percent1 } = getPositionData(id, sqrtPriceX96, liquidity)
  const priceX192 = sqrtPriceX96 * sqrtPriceX96
  const price0 = fromValue(priceX192).times(factor).div(Q192.toString(10)).toNumber()
  const price1 = fromValue(Q192).div(priceX192.toString(10)).div(factor).toNumber()

  datas.value[id] = { sqrtPriceX96, liquidity, balance0, balance1, tvl, price0, price1, percent0, percent1 }
}

const findPool = (input: string, output: string, pools: PoolMeta[]) => {
  const [currency0, currency1] = input.toLowerCase() < output.toLowerCase() ? [input, output] : [output, input]
  return pools.findIndex(it => it.currency0.address === currency0 && it.currency1.address === currency1)
}

const mapPool = (pool: PoolMeta, currency: string) => pool.currency0.address === currency ? pool.currency1 : pool.currency1.address === currency ? pool.currency0 : undefined

export const getPool = (id: string) => config.value[id]

export const getPoolName = (pool: PoolMeta) => `${pool.currency0.symbol}-${pool.currency1.symbol}`

/**
 * @param {number} chainId
 * @param {boolean} hot
 */
export const getPools = (chainId: number|undefined = undefined, hot: boolean|undefined = undefined) => {
  const list = Object.values(config.value)
  return list.filter(it => (!chainId || it.chainId === chainId) && (hot === undefined || it.hot === hot))
}

export const addPools = (pools: PoolInfo[]) => {
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

export const fetchPoolMeta = async (chainId: number, id: string) => {
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

const getPoolState = async (chainId: number, id: string) => {
  const quoter = getQuoterAddress(chainId)
  const publicClient = getPublicClient(chainId)
  const { sqrtPriceX96, liquidity } = await _getPoolState(publicClient, quoter, id)

  return { id, sqrtPriceX96, liquidity }
}

export const loadMyPools = async (chainId: number, account: string) => {
  const quoter = getQuoterAddress(chainId)
  if (!quoter || !account) {
    return []
  }

  const publicClient = getPublicClient(chainId)

  let poolIds = await getPoolIds(publicClient, quoter, account)
  poolIds = [...new Set(poolIds)]

  return pMap(poolIds, async id => fetchPoolMeta(chainId, id), { concurrency: 3 })
}

const getPoolKey = (chainId: number, currency0: string, currency1: string) => {
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

export const getPoolId = (chainId: number, currency0: string, currency1: string) => {
  return keccak256(encodeAbiParameters([POOL_KEY], [getPoolKey(chainId, currency0, currency1)]))
}

export const getPoolTokens = (chainId: number) => {
  const tokens = getPools(chainId).map(pool => [pool.currency0, pool.currency1]).flat()
  return uniqBy(tokens, "address")
}

export const findPaths = (inputToken: Token, outputToken: Token) => {
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

  const items1 = pools.map(it => mapPool(it, inputToken.address)).filter(it => !!it)
  const items2 = pools.map(it => mapPool(it, outputToken.address)).filter(it => !!it)
  const mediators = intersectionBy(items1, items2, "address")
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

export const getPositionData = (id: string, sqrtPriceX96: bigint, liquidity: bigint) => {
  const { currency0, currency1 } = getPool(id)
  const { balance0, balance1 } = getBalances(sqrtPriceX96, liquidity)
  const price0 = getPrice(currency0.key || '')
  const price1 = getPrice(currency1.key || '')
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

export const updatePoolDatas = async (pools: PoolMeta[]) => {
  await pMap(pools, updatePoolData, { concurrency: 3 })
}

export const getPoolData = (pool: PoolMeta|undefined = undefined) => {
  return pool && datas.value[pool.id] || getDefaultPoolData()
}

export const getPoolDatas = (pools: PoolMeta[]) => {
  return Object.fromEntries(pools.map(it => [it.id, getPoolData(it)]))
}

export const getPoolInitState = async (token0: Token, token1: Token) => {
  const { chainId } = token0
  const id = getPoolId(chainId, token0.address, token1.address)
  if (getPool(id)) {
    return { id, initialized: true }
  }

  const state = await getPoolState(chainId, id)
  return { id, initialized: state.sqrtPriceX96 > 0n }
}
