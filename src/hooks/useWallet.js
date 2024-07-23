import { computed, readonly, ref } from "vue"
import { createWalletClient, custom } from "viem"
import { eip712WalletActions } from 'viem/zksync'
import { balanceOf } from "./useCurrency"
import { getChain, getChainName, isSupportChain, getDefaultChain, getNativeCurrency, isZkEVM } from "./useChains"
import { getPublicClient } from "./useClient"

const chainIdRef = ref(0)
const accountRef = ref("")
const balanceRef = ref(0n)
const walletNameRef = ref("")
const requireSwitchChainRef = ref(false)

let walletClient = null
let cachedProvider = null

const toHex = value => `0x${value.toString(16)}`

const replaceWalletClient = (chainId = undefined, account = undefined) => {
  const id = chainId || chainIdRef.value
  walletClient = createWalletClient({
    chain: getChain(id),
    account: account || accountRef.value,
    transport: custom(cachedProvider),
  })
  if (isZkEVM(id)) {
    walletClient = walletClient.extend(eip712WalletActions())
  }
}

const getChainId = async provider => {
  const chainId = await provider.request({ method: 'eth_chainId' })
  return parseInt(chainId, 16)
}

/**
 * @returns {Promise<string[]>}
 */
const getAccounts = async provider => {
  return provider.request({ method: 'eth_accounts' })
}

const init = async (provider, walletName, account, chainId, targetChainId) => {
  if (cachedProvider !== provider) {
    provider.on("connect", onConnect)
    provider.on("chainChanged", onChainChanged)
    provider.on("accountsChanged", onAccountsChanged)
    provider.on("disconnect", onDisconnect)
    cachedProvider = provider
  }

  walletNameRef.value = walletName

  if (!isSupportChain(chainId) || (targetChainId && chainId !== targetChainId)) {
    if (!targetChainId) {
      const defaultChain = getDefaultChain()
      targetChainId = defaultChain.id
    }
    replaceWalletClient(targetChainId, account)
    await switchChain(targetChainId)
    return
  }

  chainIdRef.value = chainId
  accountRef.value = account

  updateBalance()
  replaceWalletClient()
}

const clear = () => {
  if (cachedProvider) {
    cachedProvider.removeListener("connect", onConnect)
    cachedProvider.removeListener("chainChanged", onChainChanged)
    cachedProvider.removeListener("accountsChanged", onAccountsChanged)
    cachedProvider.removeListener("disconnect", onDisconnect)
  }
  cachedProvider = null

  reset()
}

const reset = () => {
  accountRef.value = ""
  chainIdRef.value = 0
  balanceRef.value = 0n
  walletNameRef.value = ""
  walletClient = null
  requireSwitchChainRef.value = false
}

const checkChain = chainId => {
  if (!isSupportChain(chainId)) {
    console.log(`chainId "${chainId}" not support`)
    reset()
    return false
  }

  return true
}

const update = async (chainId = 0, account = '') => {
  if (!account) {
    [account] =  await getAccounts(cachedProvider)
  }

  requireSwitchChainRef.value = false
  accountRef.value = account
  chainIdRef.value = chainId

  updateBalance()
  replaceWalletClient()
}

const onConnect = async (connectInfo) => {
  let { chainId } = connectInfo

  chainId = parseInt(chainId, 16)
  if (!checkChain(chainId)) {
    requireSwitchChainRef.value = true
    return
  }

  await update(chainId)
}

const onChainChanged = async (chainId) => {
  chainId = parseInt(chainId, 16)
  if (!checkChain(chainId)) {
    requireSwitchChainRef.value = true
    return
  }

  await update(chainId)
}

const onAccountsChanged = async (accounts) => {
  if (!accounts || accounts.length === 0) {
    reset()
    return
  }

  const chainId = await getChainId(cachedProvider)
  if (!checkChain(chainId)) {
    requireSwitchChainRef.value = true
    return
  }

  await update(chainId, accounts[0])
}

const onDisconnect = () => {
  reset()
}

/**
 * @param {*} provider
 * @param {string} walletName
 * @param {number} targetChainId
 */
export const connect = async (provider, walletName, targetChainId = undefined) => {
  const accounts = await provider.request({ method: 'eth_requestAccounts' })
  if (!accounts) {
    return false
  }

  if (cachedProvider !== provider) {
    clear()
  }

  const chainId = await getChainId(provider)
  await init(provider, walletName, accounts[0], chainId, targetChainId)

  return true
}

export const autoConnect = async (provider, walletName) => {
  const accounts = await getAccounts(provider)
  if (accounts.length === 0) {
    return false
  }

  return connect(provider, walletName)
}

export const disconnect = () => {
  clear()
}

/**
 * @param {number} chainId
 */
const addChain = async chainId => {
  const { id, name, nativeCurrency, rpcUrls, blockExplorers } = getChain(chainId)
  const params = [
    {
      chainId: toHex(id),
      chainName: name,
      nativeCurrency,
      rpcUrls: rpcUrls.default.http,
      blockExplorerUrls: blockExplorers ? Object.values(blockExplorers).map(({ url }) => url) : undefined,
    },
  ]
  await cachedProvider.request({ method: 'wallet_addEthereumChain', params })
}

/**
 * @param {number} chainId
 */
export const switchChain = async chainId => {
  if (!cachedProvider) {
    throw new Error("Wallet not connected")
  }

  try {
    await cachedProvider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: toHex(chainId) }] })
  } catch(err) {
    if (err.code === 4902) {
      await addChain(chainId)
    }

    throw err
  }
}

/**
 * @returns {import('viem').WalletClient}
 */
export const getWalletClient = () => walletClient

export const updateBalance = async () => {
  if (!chainIdRef.value || !accountRef.value) {
    balanceRef.value = 0n
    return
  }

  balanceRef.value = await balanceOf(getPublicClient(chainIdRef.value), "", accountRef.value)
}

const readonlyChainId = readonly(chainIdRef)
const readonlyAccount = readonly(accountRef)
const readonlyBalance = readonly(balanceRef)
const readonlyWalletName= readonly(walletNameRef)
const readonlyRequireSwitchChain = readonly(requireSwitchChainRef)

/**
 * @type {import('vue').ComputedRef<{name: string, symbol: string, decimals: number}> }
 */
export const nativeCurrency = computed(() => getNativeCurrency(chainIdRef.value))

/**
 * @type {import('vue').ComputedRef<string> }
 */
export const chainName = computed(() => getChainName(chainIdRef.value) || walletClient?.chain.name)

export {
  readonlyChainId as chainId,
  readonlyAccount as account,
  readonlyBalance as balance,
  readonlyWalletName as walletName,
  readonlyRequireSwitchChain as requireSwitchChain,
}
