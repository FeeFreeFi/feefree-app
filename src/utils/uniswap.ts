import BigNumber from 'bignumber.js'

/**
 * liquidity = Math.sqrt(amount0 * amount1)
 * sqrtPriceX96 = Math.sqrt(amount1 / amount0) * Q96
 * amount0 = liquidity * Q96 / sqrtPriceX96
 * amount1 = liquidity * sqrtPriceX96 / Q96
 */

// 2n ** 96n
export const Q96 = 79228162514264337593543950336n
// 2n ** 192n
export const Q192 = 6277101735386680763835789423207666416102355444464034512896n

export const mulDiv = (a: bigint, b: bigint, c: bigint) => {
  return BigInt(new BigNumber(a.toString(10)).times(b.toString(10)).div(c.toString(10)).dp(0).toString(10))
}

export const getAmount0FromSqrtPriceAndLiquidity = (sqrtPriceX96: bigint, liquidity: bigint) => mulDiv(liquidity, Q96, sqrtPriceX96)

export const getAmount0FromAmount1AndSqrtPrice = (amount1: bigint, sqrtPriceX96: bigint) => mulDiv(amount1, Q192, sqrtPriceX96 * sqrtPriceX96)

export const getAmount0FromAmount1AndLiquidity = (amount1: bigint, liquidity: bigint) => mulDiv(liquidity, liquidity, amount1)

export const getAmount1FromSqrtPriceAndLiquidity = (sqrtPriceX96: bigint, liquidity: bigint) => mulDiv(liquidity, sqrtPriceX96, Q96)

export const getAmount1FromAmount0AndLiquidity = (amount0: bigint, liquidity: bigint) => mulDiv(liquidity, liquidity, amount0)

export const getAmount1FromAmount0AndSqrtPrice = (amount0: bigint, sqrtPriceX96: bigint) => mulDiv(sqrtPriceX96 * sqrtPriceX96, amount0, Q192)

export const getSqrtPriceXFromAmounts = (amount0: bigint, amount1: bigint) => {
  return BigInt(new BigNumber(amount1.toString(10)).times(Q192.toString(10)).div(amount0.toString(10)).sqrt().dp(0, BigNumber.ROUND_DOWN).toString(10))
}

export const getSqrtPriceXFromAmount0AndLiquidity = (amount0: bigint, liquidity: bigint) => mulDiv(liquidity, Q96, amount0)

export const getSqrtPriceXFromAmount1AndLiquidity = (amount1: bigint, liquidity: bigint) => mulDiv(amount1, Q96, liquidity)
