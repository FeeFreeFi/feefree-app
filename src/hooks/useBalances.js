import pMap from "p-map"
import { getPublicClient } from "./useClient"
import { balanceOf } from "./useCurrency"
import { createCache } from "./useDataCache"

const cache = createCache()

/**
 * @param {{chainId:number, address:string}} token
 */
const getTokenKey = token => `${token.chainId}:${token.address}`

/**
 * @param {string} account
 * @param {{chainId:number, address:string}} token
 * @returns {bigint}
 */
export const getBalance = (account, token) => {
  return cache.getValue(account, getTokenKey(token), 0n)
}

/**
 * @param {number} chainId
 * @param {string} account
 * @param {{chainId:number, address:string}[]} tokens
 * @returns {bigint[]}
 */
export const getBalances = (account, tokens) => {
  const keys = tokens.map(token => getTokenKey(token))
  return cache.getValues(account, keys, 0n)
}

/**
 * @param {string} account
 * @param {{chainId:number, address:string}[]} tokens
 */
export const updateBalances = async (account, tokens) => {
  const items = await pMap(tokens, async token => {
    const balance = await balanceOf(getPublicClient(token.chainId), token.address, account).catch(() => 0n)
    const key = getTokenKey(token)
    return [key, balance]
  }, { concurrency: 3 })

  const balances = Object.fromEntries(items)
  cache.setValues(account, balances)
}

export const resetBalances = () => {
  cache.reset()
}
