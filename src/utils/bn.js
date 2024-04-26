import BigNumber from "bignumber.js"

// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = BigInt.prototype.toJSON || function toJSON() { return this.toString() }

/**
 * @param {BigNumber|string|number} value
 */
const toBigInt = value => BigInt(value.toString(10))

/**
 * @param {BigNumber|string|number|BigInt} value
 */
export const fromValue = value => new BigNumber(value.toString(10))

/**
 * @param {BigNumber|string|number|BigInt} value
 * @param {number} decimals
 */
export const fromDecimals = (value, decimals) => new BigNumber(value.toString(10)).times(10 ** decimals)

/**
 * @param {BigNumber|string|number|BigInt} value
 * @param {number} decimals
 */
export const byDecimals = (value, decimals) => new BigNumber(value.toString(10)).div(10 ** decimals)

/**
 * @param {BigNumber|string|number|BigInt} value
 * @param {number} decimals
 */
export const parseAmount = (value, decimals) => toBigInt(fromDecimals(value, decimals).dp(0))

/**
 * @param {BigNumber|string|number|BigInt} value
 * @param {number} decimals
 * @param {number|undefined} dp
 */
export const toAmount = (value, decimals, dp = undefined) => byDecimals(value, decimals).dp(dp === undefined ? decimals : dp).toString(10)

/**
 * @param {BigNumber|string|number|BigInt} value
 * @param {number} decimals
 * @param {number|undefined} dp
 */
export const toBalance = (value, dp = 0) => fromValue(value).dp(dp).toFormat()

/**
 * @param {BigNumber} values
 */
export const sumValues = values => {
  return values.length === 0 ? new BigNumber(0) : BigNumber.sum(...values)
}

/**
 * @param {BigNumber[]} values
 */
export const maxValue = values => {
  return values.length === 0 ? new BigNumber(0) : BigNumber.maximum(...values)
}

/**
 * @param {BigNumber[]} values
 */
export const minValue = values => {
  return values.length === 0 ? new BigNumber(0) : BigNumber.minimum(...values)
}
