import type { Address, WalletClient, EIP1193Provider, ProviderConnectInfo } from "viem"
import type { Wallet, WalletInfo } from "@/types"
import { computed, readonly, ref } from "vue"
import { createWalletClient, custom, getAddress, SwitchChainError } from "viem"
import { ADDRESS_ZERO } from "@/utils"
import { balanceOf } from "@/contracts/ERC20"
import { getChain, getChainName, isSupportChain, DEFAULT_CHAIN_ID, getNativeCurrency } from "./useChains"
import { getPublicClient } from "./useClient"

const walletChainIdRef = ref(0)
const accountRef = ref("")
const nativeBalanceRef = ref(0n)
const chainSupportedRef = ref(false)

const walletInfoRef = ref<WalletInfo>()

let walletClient: WalletClient|undefined = undefined
let cachedProvider: EIP1193Provider|undefined = undefined

const getCachedProvider = () => {
  if (!cachedProvider) {
    throw new Error("Wallet not connected!")
  }

  return cachedProvider
}

const replaceWalletClient = (provider: EIP1193Provider, chainId: number, account: string) => {
  chainId = chainId || walletChainIdRef.value
  walletClient = createWalletClient({
    chain: getChain(chainId),
    account: (account || accountRef.value) as Address,
    transport: custom(provider),
  })
}

const getChainId = async (provider: EIP1193Provider) => {
  const chainId = await provider.request({ method: 'eth_chainId' }) as string
  return parseInt(chainId, 16)
}

const getAccounts = async (provider: EIP1193Provider) => {
  return provider.request({ method: 'eth_accounts' }) as Promise<string[]>
}

const init = async (provider: EIP1193Provider, info: WalletInfo, account: string, chainId: number, targetChainId: number|undefined = undefined) => {
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
    replaceWalletClient(provider, targetChainId, account)
    await switchChain(targetChainId)
    return
  }

  await update(chainId, account)
}

const clear = () => {
  const provider = cachedProvider
  if (provider) {
    provider.removeListener("connect", onConnect)
    provider.removeListener("chainChanged", onChainChanged)
    provider.removeListener("accountsChanged", onAccountsChanged)
    provider.removeListener("disconnect", onDisconnect)
    cachedProvider = undefined
  }

  reset()
}

const reset = () => {
  accountRef.value = ""
  walletChainIdRef.value = 0
  nativeBalanceRef.value = 0n
  chainSupportedRef.value = false
  walletInfoRef.value = undefined
  walletClient = undefined
}

const update = async (chainId: number, account = '') => {
  if (!isSupportChain(chainId)) {
    reset()
    console.warn(`chainId "${chainId}" not support`)
    return false
  }

  const provider = getCachedProvider()
  if (!account) {
    [account] =  await getAccounts(provider)
  }
  account = getAddress(account)

  replaceWalletClient(provider, chainId, account)

  accountRef.value = account
  walletChainIdRef.value = chainId
  chainSupportedRef.value = true

  updateNativeBalance()
}

const addChain = async (chainId: number) => {
  const chain = getChain(chainId)
  const client = getWalletClient()
  await client.addChain({ chain })
}

const onConnect = async (connectInfo: ProviderConnectInfo) => {
  await update(parseInt(connectInfo.chainId, 16))
}

const onChainChanged = async (chainId: string) => {
  await update(parseInt(chainId, 16))
}

const onAccountsChanged = async (accounts: Address[]) => {
  if (!accounts || accounts.length === 0) {
    reset()
    return
  }

  const chainId = await getChainId(getCachedProvider())
  await update(chainId, accounts[0])
}

const onDisconnect = () => {
  reset()
}

export const connect = async (wallet: Wallet, targetChainId: number|undefined = undefined) => {
  const { provider, info } = wallet
  const accounts = info.name === "Safe" ? await provider.request({ method: 'eth_accounts' }) : await provider.request({ method: 'eth_requestAccounts' })
  if (!accounts) {
    return false
  }

  if (cachedProvider !== provider) {
    clear()
  }

  const chainId = await getChainId(provider as EIP1193Provider)
  await init(provider as EIP1193Provider, info, (accounts as string)[0], chainId, targetChainId)

  return true
}

export const autoConnect = async (wallet: Wallet) => {
  const accounts = await getAccounts(wallet.provider as EIP1193Provider)
  if (accounts.length === 0) {
    return false
  }

  return connect(wallet)
}

export const disconnect = () => {
  clear()
}

export const switchChain = async (chainId: number) => {
  try {
    const client = getWalletClient()
    await client.switchChain({ id: chainId })
  } catch (err: unknown) {
    if (err instanceof SwitchChainError) {
      await addChain(chainId)
    } else {
      throw err
    }
  }
}

export const getWalletClient = () => {
  if (!walletClient) {
    throw new Error("Wallet not connected!")
  }

  return walletClient
}

export const updateNativeBalance = async () => {
  if (!walletChainIdRef.value || !accountRef.value) {
    nativeBalanceRef.value = 0n
    return
  }

  nativeBalanceRef.value = await balanceOf(getPublicClient(walletChainIdRef.value), ADDRESS_ZERO, accountRef.value)
}

export const nativeCurrency = computed(() => getNativeCurrency(walletChainIdRef.value))

export const chainName = computed(() => getChainName(walletChainIdRef.value) || walletClient?.chain!.name || '')

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
