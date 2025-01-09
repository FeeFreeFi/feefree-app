import { BigNumber } from "bignumber.js"

const UNITS = [
  { value: 1e12, name: "T" },
  { value: 1e9, name: "B" },
  { value: 1e6, name: "M" },
]

type Value = BigNumber|string|number|bigint

export const toBytes32 = (value: bigint) => `0x${value.toString(16).padStart(64, "0")}`

const toBigInt = (value: BigNumber|string|number) => BigInt(value.toString(10))

export const fromValue = (value: Value) => new BigNumber(value.toString(10))

export const fromDecimals = (value: Value, decimals: number) => new BigNumber(value.toString(10)).times(10 ** decimals)

export const byDecimals = (value: Value, decimals: number) => new BigNumber(value.toString(10)).div(10 ** decimals)

export const parseAmount = (value: Value, decimals: number) => toBigInt(fromDecimals(value, decimals).dp(0))

export const toAmount = (value: Value, decimals: number, dp: number|undefined = undefined) => byDecimals(value, decimals).dp(dp === undefined ? decimals : dp).toString(10)

export const toBalance = (value: Value, dp = 0) => fromValue(value).dp(dp).toFormat()

export const toBalanceWithUnit = (value: Value, decimals: number, dp = 6) => {
  const amount = byDecimals(value, decimals)
  const unit = UNITS.find(it => amount.gte(it.value))
  return unit ? `${toBalance(amount.div(unit.value), dp)}${unit.name}` : toBalance(amount, dp)
}

export const sumValues = (values: BigNumber[]) => {
  return values.length === 0 ? new BigNumber(0) : BigNumber.sum(...values)
}

export const maxValue = (values: BigNumber[]) => {
  return values.length === 0 ? new BigNumber(0) : BigNumber.maximum(...values)
}

export const minValue = (values: BigNumber[]) => {
  return values.length === 0 ? new BigNumber(0) : BigNumber.minimum(...values)
}
