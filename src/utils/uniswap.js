import BigNumber from "bignumber.js"

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

/**
 * @param {bigint} a
 * @param {bigint} b
 * @param {bigint} c
 */
export const mulDiv = (a, b, c) => {
  return BigInt(new BigNumber(a).times(b).div(c).dp(0).toString(10))
}

/**
 * @param {bigint} sqrtPriceX96
 * @param {bigint} liquidity
 */
export const getAmount0FromSqrtPriceAndLiquidity = (sqrtPriceX96, liquidity) => mulDiv(liquidity, Q96, sqrtPriceX96)

/**
 * @param {bigint} amount1
 * @param {bigint} sqrtPriceX96
 */
export const getAmount0FromAmount1AndSqrtPrice = (amount1, sqrtPriceX96) => mulDiv(amount1, Q192, sqrtPriceX96 * sqrtPriceX96)

/**
 * @param {bigint} amount1
 * @param {bigint} liquidity
 */
export const getAmount0FromAmount1AndLiquidity = (amount1, liquidity) => mulDiv(liquidity, liquidity, amount1)

/**
 * @param {bigint} sqrtPriceX96
 * @param {bigint} liquidity
 */
export const getAmount1FromSqrtPriceAndLiquidity = (sqrtPriceX96, liquidity) => mulDiv(liquidity, sqrtPriceX96, Q96)

/**
 * @param {bigint} amount0
 * @param {bigint} liquidity
 */
export const getAmount1FromAmount0AndLiquidity = (amount0, liquidity) => mulDiv(liquidity, liquidity, amount0)

/**
 * @param {bigint} amount0
 * @param {bigint} sqrtPriceX96
 */
export const getAmount1FromAmount0AndSqrtPrice = (amount0, sqrtPriceX96) => mulDiv(sqrtPriceX96 * sqrtPriceX96, amount0, Q192)

/**
 * @param {bigint} amount0
 * @param {bigint} amount1
 */
export const getSqrtPriceXFromAmounts = (amount0, amount1) => {
  return BigInt(new BigNumber(amount1).times(Q192).div(amount0).sqrt().dp(0, BigNumber.ROUND_DOWN).toString(10))
}

/**
 * @param {bigint} amount0
 * @param {bigint} liquidity
 */
export const getSqrtPriceXFromAmount0AndLiquidity = (amount0, liquidity) => mulDiv(liquidity, Q96, amount0)

/**
 * @param {bigint} amount1
 * @param {bigint} liquidity
 */
export const getSqrtPriceXFromAmount1AndLiquidity = (amount1, liquidity) => mulDiv(amount1, Q96, liquidity)
