import { BigNumber } from "bignumber.js"

const UNITS = [
  { value: 1e12, name: "T" },
  { value: 1e9, name: "B" },
  { value: 1e6, name: "M" },
]

/**
 * @param {bigint} value
 */
export const toBytes32 = value => `0x${value.toString(16).padStart(64, "0")}`

/**
 * @param {BigNumber|string|number} value
 */
const toBigInt = value => BigInt(value.toString(10))

/**
 * @param {BigNumber|string|number|bigint} value
 */
export const fromValue = value => new BigNumber(value.toString(10))

/**
 * @param {BigNumber|string|number|bigint} value
 * @param {number} decimals
 */
export const fromDecimals = (value, decimals) => new BigNumber(value.toString(10)).times(10 ** decimals)

/**
 * @param {BigNumber|string|number|bigint} value
 * @param {number} decimals
 */
export const byDecimals = (value, decimals) => new BigNumber(value.toString(10)).div(10 ** decimals)

/**
 * @param {BigNumber|string|number|bigint} value
 * @param {number} decimals
 */
export const parseAmount = (value, decimals) => toBigInt(fromDecimals(value, decimals).dp(0))

/**
 * @param {BigNumber|string|number|bigint} value
 * @param {number} decimals
 * @param {number} dp
 */
export const toAmount = (value, decimals, dp = undefined) => byDecimals(value, decimals).dp(dp === undefined ? decimals : dp).toString(10)

/**
 * @param {BigNumber|string|number|bigint} value
 * @param {number} dp
 */
export const toBalance = (value, dp = 0) => fromValue(value).dp(dp).toFormat()

/**
 * @param {BigNumber|string|number|bigint} value
 * @param {number} decimals
 * @param {number} dp
 */
export const toBalanceWithUnit = (value, decimals, dp = 6) => {
  const amount = byDecimals(value, decimals)
  const unit = UNITS.find(it => amount.gte(it.value))
  return unit ? `${toBalance(amount.div(unit.value), dp)}${unit.name}` : toBalance(amount, dp)
}

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
