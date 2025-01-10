import type { Token, TokenRaw } from '@/types'
import { ref } from 'vue'
import { CACHE_TOKENS } from '@/config'
import { ADDRESS_ZERO, isSame, getStorage, setStorage } from '@/utils'
import { approve as _approve, allowance as _allowance, balanceOf as _balanceOf, totalSupply as _totalSupply } from '@/contracts/ERC20'
import { getTokenMeta as _getTokenMeta } from '@/contracts/Quoter'
import { getPublicClient } from './useClient'
import { getQuoterAddress } from './useManager'
import { getWalletClient } from './useWallet'

const config = ref<Record<number, Record<string, Token>>>({})

const cachedTokens = ref<Token[]>([])

export const getToken = (chainId: number, address: string) => config.value[chainId]?.[address]

export const getTokens = (chainId: number, hot: boolean | undefined = undefined) => {
  const tokens = Object.values(config.value[chainId] || {})
  return hot === undefined ? tokens : tokens.filter(it => it.hot === hot)
}

export const getCachedTokens = (chainId: number) => {
  return cachedTokens.value.filter(it => it.chainId === chainId)
}

export const cacheTokens = (tokens: Token[]) => {
  tokens.forEach(it => {
    if (it && !it.hot && !cachedTokens.value.find(t => isSame(t, it))) {
      cachedTokens.value.push(it)
    }
  })

  setStorage(CACHE_TOKENS, cachedTokens.value)
}

export const getNativeToken = (chainId: number) => {
  const tokens = Object.values(config.value[chainId] || {})
  return tokens.find(it => it.address === ADDRESS_ZERO)
}

export const addTokens = (tokens: Token[]) => {
  tokens.forEach(token => {
    config.value[token.chainId] ||= {}
    const group = config.value[token.chainId]
    group[token.address] = token
  })
}

export const loadCachedTokens = () => {
  const tokens = getStorage(CACHE_TOKENS)
  if (!tokens) {
    return
  }

  cachedTokens.value = (tokens as Token[]).filter(it => it.chainId && it.address && !getToken(it.chainId, it.address))
  addTokens(cachedTokens.value)
}

export const fetchToken = async (chainId: number, address: string) => {
  address ||= ADDRESS_ZERO

  let token = getToken(chainId, address)
  if (!token) {
    const publicClient = getPublicClient(chainId)
    const meta = await _getTokenMeta(publicClient, getQuoterAddress(chainId), address).catch(() => {})
    if (meta) {
      const { name, symbol, decimals } = meta
      token = { chainId, address, name, symbol, decimals, dp: 4, hot: false, key: '', icon: '' }
      addTokens([token])
    }
  }

  return token
}

export const populateToken = (tokenRaw: TokenRaw, cached = true) => {
  const { chainId, address, name, symbol, decimals } = tokenRaw
  let token = getToken(chainId, address)
  if (!token) {
    token = { chainId, address, name, symbol, decimals, dp: 4, hot: false, key: '', icon: '' }
    addTokens([token])
    if (cached) {
      cacheTokens([token])
    }
  }

  return token
}

export const approve = async (token: Token, spender: string, amount: bigint) => {
  const { address, chainId } = token
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  return _approve({ publicClient, walletClient }, address, spender, amount)
}

export const allowance = async (token: Token, owner: string, spender: string) => {
  const { address, chainId } = token

  return _allowance(getPublicClient(chainId), address, owner, spender).catch(() => 0n)
}

export const balanceOf = async (token: Token, account: string) => {
  const { address, chainId } = token

  return _balanceOf(getPublicClient(chainId), address, account).catch(() => 0n)
}

export const totalSupply = async (token: Token) => {
  const { address, chainId } = token

  return _totalSupply(getPublicClient(chainId), address).catch(() => 0n)
}
