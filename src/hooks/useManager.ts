import type { AddLiquidityParams, ExchangeParams, LaunchParams, InitializeParams, Manager, PoolMeta, QuoteAddLiquidityData, QuoteRemoveLiquidityData, QuoteSwapData, RemoveLiquidityParams, SwapParams, Token } from '@/types'
import { ref } from 'vue'
import pMap from 'p-map'
import { maxBy, minBy } from 'lodash-es'
import { isNative, getStamp, byDecimals } from '@/utils'
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
} from '@/contracts/Manager'
import {
  addLiquidity as _quoteAddLiquidity,
  removeLiquidity as _quoteRemoveLiquidity,
  swap as _quoteSwap,
} from '@/contracts/Quoter'
import { allowance, isOperator, approve } from '@/contracts/ERC6909'
import { getPublicClient } from './useClient'
import { getWalletClient, walletChainId } from './useWallet'
import { getPrice } from './usePrices'
import { SLIPPAGE } from '@/config'

const DURATION = 600

const DENOMINATOR = 10000n

const config = ref<Record<number, Manager>>({})

export const getManager = (chainId: number) => config.value[chainId]

export const getManagerAddress = (chainId: number) => getManager(chainId)?.address

export const getQuoterAddress = (chainId: number) => getManager(chainId)?.quoter

export const getPoolAddress = (chainId: number) => getManager(chainId)?.pool

export const getLiquidityAddress = (chainId: number) => getManager(chainId)?.liquidity

export const addManagers = (managers: Manager[]) => {
  managers.forEach(manager => {
    config.value[manager.chainId] = manager
  })
}

export const isSupportChain = (chainId: number) => !!getManager(chainId)

export const getSupportedChains = () => Object.keys(config.value).map(chainId => ({ chainId: Number.parseInt(chainId, 10) }))

export const launch = async (params: LaunchParams) => {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  const value = isNative(params.asset) ? params.amount : 0n

  return _launch({ publicClient, walletClient }, getManagerAddress(chainId), encodeLaunchData(params), { value })
}

export const initialize = async (params: InitializeParams) => {
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

export const quoteAddLiquidity = async (chainId: number, currency0: string, currency1: string, amount0Max: bigint, amount1Max: bigint) => {
  const publicClient = getPublicClient(chainId)
  const quoter = getQuoterAddress(chainId)
  const { liquidity, amount0Desired, amount1Desired } = await _quoteAddLiquidity(publicClient, quoter, currency0, currency1, amount0Max, amount1Max)
  return { currency0, currency1, liquidity, amount0Max: amount0Desired, amount1Max: amount1Desired } as QuoteAddLiquidityData
}

export const addLiquidity = async (params: AddLiquidityParams) => {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  const deadline = getStamp() + DURATION
  const value = isNative(params.currency0) ? params.amount0Max : 0n

  return _addLiquidity({ publicClient, walletClient }, getManagerAddress(chainId), encodeAddLiquidityData(params), deadline, { value })
}

export const quoteRemoveLiquidity = async (chainId: number, currency0: string, currency1: string, liquidity: bigint) => {
  const publicClient = getPublicClient(chainId)
  const quoter = getQuoterAddress(chainId)
  const { amount0Min, amount1Min } = await _quoteRemoveLiquidity(publicClient, quoter, currency0, currency1, liquidity)
  return { currency0, currency1, liquidity, amount0Min, amount1Min } as QuoteRemoveLiquidityData
}

export const removeLiquidity = async (params: RemoveLiquidityParams) => {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  const deadline = getStamp() + DURATION

  return _removeLiquidity({ publicClient, walletClient }, getManagerAddress(chainId), encodeRemoveLiquidityData(params), deadline)
}

export const quoteSwap = async (chainId: number, tokenPaths: Token[][], amountSpecified: bigint) => {
  const publicClient = getPublicClient(chainId)
  const quoter = getQuoterAddress(chainId)
  const isExactIn = amountSpecified < 0n
  const result = await pMap(tokenPaths, async tokens => {
    const paths = tokens.map(it => it.address)
    const { amountIn, amountOut } = await _quoteSwap(publicClient, quoter, paths, amountSpecified)

    return {
      paths,
      amountSpecified,
      amountIn: isExactIn ? amountIn : amountIn * (DENOMINATOR + SLIPPAGE) / DENOMINATOR,
      amountOut: isExactIn ? amountOut * (DENOMINATOR - SLIPPAGE) / DENOMINATOR : amountOut,
    }
  }, { concurrency: 3 })

  return (isExactIn ? maxBy(result, 'amountOut') : minBy(result, 'amountIn')) as QuoteSwapData
}

export const swap = async (params: SwapParams, swapFee: bigint) => {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  const deadline = getStamp() + DURATION
  const value = isNative(params.paths[0]) ? (params.amountSpecified < 0 ? -params.amountSpecified : params.amountDesired) + swapFee : swapFee

  return _swap({ publicClient, walletClient }, getManagerAddress(chainId), encodeSwapData(params), deadline, { value })
}

export const exchange = async (params: ExchangeParams, exchangeFee: bigint) => {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  const value = isNative(params.currency) && params.amountSpecified < 0 ? exchangeFee - params.amountSpecified : exchangeFee

  return _exchange({ publicClient, walletClient }, getManagerAddress(chainId), encodeExchangeData(params), { value })
}

export const checkLiquidityAllowance = async (pool: PoolMeta, account: string, amount: bigint, spender = '') => {
  const { chainId, id } = pool
  const publicClient = getPublicClient(chainId)
  const address = getLiquidityAddress(chainId)
  spender ||= getManagerAddress(chainId)
  const [approved, value] = await Promise.all([
    isOperator(publicClient, address, account, spender),
    allowance(publicClient, address, account, spender, BigInt(id)),
  ])

  return approved || value >= amount
}

export const approveLiquidity = async (pool: PoolMeta, spender: string, amount: bigint) => {
  const { chainId, id } = pool
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const address = getLiquidityAddress(chainId)

  return approve({ publicClient, walletClient }, address, spender, BigInt(id), amount)
}

export const checkValueChange = (inputToken: Token, outputToken: Token, quote: QuoteSwapData) => {
  const inputValue = byDecimals(quote.amountIn, inputToken.decimals).times(getPrice(inputToken.symbol)).dp(inputToken.dp!).toNumber()
  const outputValue = byDecimals(quote.amountOut, outputToken.decimals).times(getPrice(outputToken.symbol)).dp(outputToken.dp!).toNumber()

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
