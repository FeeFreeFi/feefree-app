import { ref } from "vue"
import { CACHE_TOKENS } from "@/config"
import { approve as _approve, allowance as _allowance, balanceOf as _balanceOf, totalSupply as _totalSupply } from "@/contracts/ERC20"
import { getTokenMeta as _getTokenMeta } from "@/contracts/Quoter"
import { getPublicClient } from "./useClient"
import { getQuoterAddress } from "./useManager"
import { ADDRESS_ZERO, isSame } from "@/utils/ethereum"
import { getStorage, setStorage } from "@/utils/storage"
import { getWalletClient } from "./useWallet"

/** @type {import('vue').Ref<{[chainId:number]: {[address:string]: import('@/types').Token}}>} */
const config = ref({})
/** @type {import('vue').Ref<import('@/types').Token[]>} */
const cachedTokens = ref([])

/**
 * @param {number} chainId
 * @param {string} address
 */
export const getToken = (chainId, address) => config.value[chainId]?.[address]

/**
 * @param {number} chainId
 * @param {boolean} hot
 */
export const getTokens = (chainId, hot = undefined) => {
  const tokens = Object.values(config.value[chainId] || {})
  return hot === undefined ? tokens : tokens.filter(it => it.hot === hot)
}

/**
 * @param {number} chainId
 */
export const getCachedTokens = chainId => {
  return cachedTokens.value.filter(it => it.chainId === chainId)
}

/**
 * @param {import('@/types').Token[]} tokens
 */
export const cacheTokens = tokens => {
  tokens.forEach(it => {
    if (it && !it.hot && !cachedTokens.value.find(t => isSame(t, it))) {
      cachedTokens.value.push(it)
    }
  })

  setStorage(CACHE_TOKENS, cachedTokens.value)
}

/**
 * @param {number} chainId
 */
export const getNativeToken = chainId => {
  const tokens = Object.values(config.value[chainId] || {})
  return tokens.find(it => it.address === ADDRESS_ZERO)
}

/**
 * @param {import('@/types').Token[]} tokens
 */
export const addTokens = tokens => {
  tokens.forEach(token => {
    const group = config.value[token.chainId] || (config.value[token.chainId] = {})
    group[token.address] = token
  })
}

export const loadCachedTokens = () => {
  /** @type {import('@/types').Token[]} */
  const tokens = getStorage(CACHE_TOKENS, [])
  cachedTokens.value = tokens.filter(it => it.chainId && it.address && !getToken(it.chainId, it.address))

  addTokens(cachedTokens.value)
}

/**
 * @param {number} chainId
 * @param {string} address
 */
export const fetchToken = async (chainId, address) => {
  address = address || ADDRESS_ZERO

  let token = getToken(chainId, address)
  if (!token) {
    const publicClient = getPublicClient(chainId)
    const meta = await _getTokenMeta(publicClient, getQuoterAddress(chainId), address).catch(() => {})
    if (meta) {
      const { name, symbol, decimals }  = meta
      token = { chainId, address, name, symbol, decimals, dp: 4, hot: false, key: '', icon: '' }
      addTokens([token])
    }
  }

  return token
}

/**
 * @param {{chainId:number, address:string, name:string, symbol:string, decimals:number}} token
 * @param {boolean} cached
 */
export const populateToken = ({ chainId, address, name, symbol, decimals }, cached = true) => {
  let token = getToken(chainId, address)
  if (!token) {
    token = { chainId, address, name, symbol, decimals, dp: 4, hot: false, key: '', icon: '' }
    addTokens([token])
    cached && cacheTokens([token])
  }

  return token
}

/**
 * @param {import('@/types').Token} token
 * @param {string} spender
 * @param {bigint} amount
 */
export const approve = async (token, spender, amount) => {
  const { address, chainId } = token
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  return _approve({ publicClient, walletClient }, address, spender, amount)
}

/**
 * @param {import('@/types').Token} token
 * @param {string} owner
 * @param {string} spender
 */
export const allowance = async (token, owner, spender) => {
  const { address, chainId } = token

  return _allowance(getPublicClient(chainId), address, owner, spender).catch(() => 0n)
}

/**
 * @param {import('@/types').Token} token
 * @param {string} account
 */
export const balanceOf = async (token, account) => {
  const { address, chainId } = token

  return _balanceOf(getPublicClient(chainId), address, account).catch(() => 0n)
}

/**
 * @param {import('@/types').Token} token
 */
export const totalSupply = async token => {
  const { address, chainId } = token

  return _totalSupply(getPublicClient(chainId), address).catch(() => 0n)
}
