import { computed, readonly, ref } from "vue"
import { createWalletClient, custom } from "viem"
import { eip712WalletActions } from 'viem/zksync'
import { balanceOf } from "./useCurrency"
import { getChain, getChainName, isSupportChain, getDefaultChain, getNativeCurrency, isZkEVM } from "./useChains"
import { getPublicClient } from "./useClient"

const walletChainIdRef = ref(0)
const accountRef = ref("")
const nativeBalanceRef = ref(0n)
const walletNameRef = ref("")
const chainSupportedRef = ref(false)

let walletClient = null
let cachedProvider = null

const toHex = value => `0x${value.toString(16)}`

const replaceWalletClient = (chainId, account) => {
  chainId = chainId || walletChainIdRef.value
  walletClient = createWalletClient({
    chain: getChain(chainId),
    account: account || accountRef.value,
    transport: custom(cachedProvider),
  })

  if (isZkEVM(chainId)) {
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

  await update(chainId, account)
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
  walletChainIdRef.value = 0
  nativeBalanceRef.value = 0n
  chainSupportedRef.value = false
  walletNameRef.value = ""
  walletClient = null
}

/**
 * @param {number} chainId
 * @param {string} account
 */
const update = async (chainId, account = '') => {
  if (!isSupportChain(chainId)) {
    reset()
    console.warn(`chainId "${chainId}" not support`)
    return false
  }

  if (!account) {
    [account] =  await getAccounts(cachedProvider)
  }
  accountRef.value = account
  walletChainIdRef.value = chainId
  chainSupportedRef.value = true

  updateNativeBalance()
  replaceWalletClient(chainId, account)
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

const onConnect = async ({ chainId }) => {
  await update(parseInt(chainId, 16))
}

const onChainChanged = async (chainId) => {
  await update(parseInt(chainId, 16))
}

const onAccountsChanged = async (accounts) => {
  if (!accounts || accounts.length === 0) {
    reset()
    return
  }

  const chainId = await getChainId(cachedProvider)
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

export const updateNativeBalance = async () => {
  if (!walletChainIdRef.value || !accountRef.value) {
    nativeBalanceRef.value = 0n
    return
  }

  nativeBalanceRef.value = await balanceOf(getPublicClient(walletChainIdRef.value), "", accountRef.value)
}

/**
 * @type {import('vue').ComputedRef<{name: string, symbol: string, decimals: number}> }
 */
export const nativeCurrency = computed(() => getNativeCurrency(walletChainIdRef.value))

/**
 * @type {import('vue').ComputedRef<string> }
 */
export const chainName = computed(() => getChainName(walletChainIdRef.value) || walletClient?.chain.name)

const readonlyWalletChainId = readonly(walletChainIdRef)
const readonlyAccount = readonly(accountRef)
const readonlyNativeBalance = readonly(nativeBalanceRef)
const readonlyWalletName= readonly(walletNameRef)
const readonlyChainSupported = readonly(chainSupportedRef)

export {
  readonlyWalletChainId as walletChainId,
  readonlyAccount as account,
  readonlyNativeBalance as nativeBalance,
  readonlyWalletName as walletName,
  readonlyChainSupported as chainSupported,
}
