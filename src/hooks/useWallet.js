import { computed, readonly, ref } from "vue"
import { createWalletClient, custom, getAddress } from "viem"
import { ADDRESS_ZERO } from "@/utils/ethereum"
import { balanceOf } from "@/contracts/ERC20"
import { getChain, getChainName, isSupportChain, DEFAULT_CHAIN_ID, getNativeCurrency } from "./useChains"
import { getPublicClient } from "./useClient"

const walletChainIdRef = ref(0)
const accountRef = ref("")
const nativeBalanceRef = ref(0n)
const chainSupportedRef = ref(false)

/**
 * @type {import('vue').Ref<import('@/types').WalletInfo>}
 */
const walletInfoRef = ref(null)

/**
 * @type {import('viem').WalletClient}
 */
let walletClient = null
/**
 * @type {import('viem').EIP1193Provider}
 */
let cachedProvider = null

/**
 * @param {number} value
 */
const toHex = value => `0x${value.toString(16)}`

/**
 * @param {number} chainId
 * @param {string} account
 */
const replaceWalletClient = (chainId, account) => {
  chainId = chainId || walletChainIdRef.value
  walletClient = createWalletClient({
    chain: getChain(chainId),
    account: account || accountRef.value,
    transport: custom(cachedProvider),
  })
}

/**
 * @param {import('viem').EIP1193Provider} provider
 */
const getChainId = async provider => {
  const chainId = await provider.request({ method: 'eth_chainId' })
  return parseInt(chainId, 16)
}

/**
 * @param {import('viem').EIP1193Provider} provider
 * @returns {Promise<string[]>}
 */
const getAccounts = async provider => {
  return provider.request({ method: 'eth_accounts' })
}

/**
 * @param {import('viem').EIP1193Provider} provider
 * @param {import('@/types').WalletInfo} info
 * @param {string} account
 * @param {number} chainId
 * @param {number} targetChainId
 */
const init = async (provider, info, account, chainId, targetChainId) => {
  if (cachedProvider !== provider) {
    provider.on("connect", onConnect)
    provider.on("chainChanged", onChainChanged)
    provider.on("accountsChanged", onAccountsChanged)
    provider.on("disconnect", onDisconnect)
    cachedProvider = provider
  }

  walletInfoRef.value = info

  if (!isSupportChain(chainId) || (targetChainId && chainId !== targetChainId)) {
    targetChainId = targetChainId || DEFAULT_CHAIN_ID
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
  walletInfoRef.value = null
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
  account = getAddress(account)

  replaceWalletClient(chainId, account)

  accountRef.value = account
  walletChainIdRef.value = chainId
  chainSupportedRef.value = true

  updateNativeBalance()
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
 * @param {{chainId:number}} e
 */
const onConnect = async ({ chainId }) => {
  await update(parseInt(chainId, 16))
}

/**
 * @param {number} chainId
 */
const onChainChanged = async (chainId) => {
  await update(parseInt(chainId, 16))
}

/**
 * @param {string[]} accounts
 */
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
 * @param {{provider:import('viem').EIP1193Provider, info: import('@/types').WalletInfo}} wallet
 * @param {number} targetChainId
 */
export const connect = async (wallet, targetChainId = undefined) => {
  const { provider, info } = wallet
  const accounts = info.name === "Safe" ? await provider.request({ method: 'eth_accounts' }) : await provider.request({ method: 'eth_requestAccounts' })
  if (!accounts) {
    return false
  }

  if (cachedProvider !== provider) {
    clear()
  }

  const chainId = await getChainId(provider)
  await init(provider, info, accounts[0], chainId, targetChainId)

  return true
}

/**
 * @param {{provider:import('viem').EIP1193Provider, info: import('@/types').WalletInfo}} wallet
 */
export const autoConnect = async wallet => {
  const accounts = await getAccounts(wallet.provider)
  if (accounts.length === 0) {
    return false
  }

  return connect(wallet)
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

  nativeBalanceRef.value = await balanceOf(getPublicClient(walletChainIdRef.value), ADDRESS_ZERO, accountRef.value)
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
const readonlyChainSupported = readonly(chainSupportedRef)
const readonlyWalletInfo = readonly(walletInfoRef)

export const walletName= computed(() => walletInfoRef.value?.name)

export {
  readonlyWalletChainId as walletChainId,
  readonlyAccount as account,
  readonlyNativeBalance as nativeBalance,
  readonlyChainSupported as chainSupported,
  readonlyWalletInfo as walletInfo,
}
