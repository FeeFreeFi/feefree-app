import { ref } from "vue"
import pMap from "p-map"
import { maxBy, minBy } from "lodash-es"
import { isNative } from "@/utils/ethereum"
import { getStamp } from "@/utils/date"
import { byDecimals } from "@/utils/bn"
import {
  launch as _launch,
  initialize as _initialize,
  addLiquidity as _addLiquidity,
  removeLiquidity as _removeLiquidity,
  swap as _swap,
  exchange as _exchange,
  encodeLaunchData,
  encodeInitializeData,
  encodeAddLiquidityData,
  encodeRemoveLiquidityData,
  encodeSwapData,
  encodeExchangeData,
} from "@/contracts/Manager"
import {
  addLiquidity as _quoteAddLiquidity,
  removeLiquidity as _quoteRemoveLiquidity,
  swap as _quoteSwap,
} from "@/contracts/Quoter"
import { allowance, isOperator, approve } from "@/contracts/ERC6909"
import { getPublicClient } from "./useClient"
import { getWalletClient, walletChainId } from "./useWallet"
import { getPrice } from "./usePrices"
import { SLIPPAGE } from "@/config"

const DURATION = 600

const DENOMINATOR = 10000n

/**
 * @type {import('vue').Ref<{[chainId:number]: import('@/types').Manager}>}
 */
const config = ref({})

/**
 * @param {number} chainId
 */
export const getManager = chainId => config.value[chainId]

/**
 * @param {number} chainId
 */
export const getManagerAddress = chainId => getManager(chainId)?.address

/**
 * @param {number} chainId
 */
export const getQuoterAddress = chainId => getManager(chainId)?.quoter

/**
 * @param {number} chainId
 */
export const getPoolAddress = chainId => getManager(chainId)?.pool

/**
 * @param {number} chainId
 */
export const getLiquidityAddress = chainId => getManager(chainId)?.liquidity

/**
 * @param {import('@/types').Manager[]} managers
 */
export const addManagers = managers => {
  managers.forEach(manager => {
    config.value[manager.chainId] = manager
  })
}

/**
 * @param {number} chainId
 */
export const isSupportChain = chainId => !!getManager(chainId)

export const getSupportedChains = () => Object.keys(config.value).map(chainId => ({ chainId: parseInt(chainId, 10) }))

/**
 * @param {import('@/types').LaunchParams} params
 */
export const launch = async params => {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  const value = isNative(params.asset) ? params.amount : 0n

  return _launch({ publicClient, walletClient }, getManagerAddress(chainId), encodeLaunchData(params), { value })
}

/**
 * @param {import('@/types').InitializeParams} params
 */
export const initialize = async params => {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  if (params.currency0.toLowerCase() > params.currency1.toLowerCase()) {
    const [currency0, currency1] = [params.currency0, params.currency1]
    const [amount0, amount1] = [params.amount0, params.amount1]
    params = { ...params, currency0, currency1, amount0, amount1 }
  }

  const value = isNative(params.currency0) ? params.amount0 : 0n

  return _initialize({ publicClient, walletClient }, getManagerAddress(chainId), encodeInitializeData(params), { value })
}

/**
 * @param {number} chainId
 * @param {string} currency0
 * @param {string} currency1
 * @param {bigint} amount0Max
 * @param {bigint} amount1Max
 */
export const quoteAddLiquidity = async (chainId, currency0, currency1, amount0Max, amount1Max) => {
  const publicClient = getPublicClient(chainId)
  const quoter = getQuoterAddress(chainId)
  const { liquidity, amount0Desired, amount1Desired } = await _quoteAddLiquidity(publicClient, quoter, currency0, currency1, amount0Max, amount1Max)
  return { currency0, currency1, liquidity, amount0Max: amount0Desired, amount1Max: amount1Desired }
}

/**
 * @param {import('@/types').AddLiquidityParams} params
 */
export const addLiquidity = async params => {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  const deadline = getStamp() + DURATION
  const value = isNative(params.currency0) ? params.amount0Max : 0n

  return _addLiquidity({ publicClient, walletClient }, getManagerAddress(chainId), encodeAddLiquidityData(params), deadline, { value })
}

/**
 * @param {number} chainId
 * @param {string} currency0
 * @param {string} currency1
 * @param {bigint} liquidity
 * @returns {Promise<import('@/types').QuoteRemoveLiquidityData>}
 */
export const quoteRemoveLiquidity = async (chainId, currency0, currency1, liquidity) => {
  const publicClient = getPublicClient(chainId)
  const quoter = getQuoterAddress(chainId)
  const { amount0Min, amount1Min } = await _quoteRemoveLiquidity(publicClient, quoter, currency0, currency1, liquidity)
  return { currency0, currency1, liquidity, amount0Min, amount1Min }
}

/**
 * @param {import('@/types').RemoveLiquidityParams} params
 */
export const removeLiquidity = async params => {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  const deadline = getStamp() + DURATION

  return _removeLiquidity({ publicClient, walletClient }, getManagerAddress(chainId), encodeRemoveLiquidityData(params), deadline)
}

/**
 * @param {number} chainId
 * @param {import('@/types').Token[][]} tokenPaths
 * @param {bigint} amountSpecified
 * @returns {Promise<import('@/types').QuoteSwapData>}
 */
export const quoteSwap = async (chainId, tokenPaths, amountSpecified) => {
  const publicClient = getPublicClient(chainId)
  const quoter = getQuoterAddress(chainId)
  const isExactIn = amountSpecified < 0n
  const result = await pMap(tokenPaths, async tokens => {
    const paths = tokens.map(it => it.address)
    const {amountIn, amountOut} = await _quoteSwap(publicClient, quoter, paths, amountSpecified)

    return {
      paths,
      amountSpecified,
      amountIn: isExactIn  ? amountIn : amountIn * (DENOMINATOR + SLIPPAGE) / DENOMINATOR,
      amountOut: isExactIn ? amountOut * (DENOMINATOR - SLIPPAGE) / DENOMINATOR : amountOut,
    }
  }, { concurrency: 3 })

  return isExactIn ? maxBy(result, "amountOut") : minBy(result, "amountIn")
}

/**
 * @param {import('@/types').SwapParams} params
 * @param {bigint} swapFee
 */
export const swap = async (params, swapFee) => {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  const deadline = getStamp() + DURATION
  const value = isNative(params.paths[0]) ? (params.amountSpecified < 0 ? -params.amountSpecified : params.amountDesired) + swapFee : swapFee

  return _swap({ publicClient, walletClient }, getManagerAddress(chainId), encodeSwapData(params), deadline, { value })
}

/**
 * @param {import('@/types').ExchangeParams} params
 * @param {bigint} exchangeFee
 */
export const exchange = async (params, exchangeFee) => {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  const value = isNative(params.currency) && params.amountSpecified < 0 ? exchangeFee - params.amountSpecified : exchangeFee

  return _exchange({ publicClient, walletClient }, getManagerAddress(chainId), encodeExchangeData(params), { value })
}

/**
 * @param {import('@/types').PoolMeta} pool
 * @param {string} account
 * @param {bigint} amount
 * @param {string} spender
 */
export const checkLiquidityAllowance = async (pool, account, amount, spender = '') => {
  const { chainId, id } = pool
  const publicClient = getPublicClient(chainId)
  const address = getLiquidityAddress(chainId)
  spender = spender || getManagerAddress(chainId)
  const [approved, value] = await Promise.all([
    isOperator(publicClient, address, account, spender),
    allowance(publicClient, address, account, spender, BigInt(id))
  ])

  return approved || value >= amount
}

/**
 * @param {import('@/types').PoolMeta} pool
 * @param {string} spender
 * @param {bigint} amount
 */
export const approveLiquidity = async (pool, spender, amount) => {
  const { chainId, id } = pool
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const address = getLiquidityAddress(chainId)

  return approve({ publicClient, walletClient }, address, spender, BigInt(id), amount)
}

/**
 * @param {import('@/types').Token} inputToken
 * @param {import('@/types').Token} outputToken
 * @param {import('@/types').QuoteSwapData} quote
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
