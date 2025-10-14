import type { Wallet, WalletInfo } from '@/types'
import { computed, readonly, ref } from 'vue'
import type { Address, WalletClient, EIP1193Provider, ProviderConnectInfo } from 'viem'
import { createWalletClient, custom, getAddress, SwitchChainError } from 'viem'
import { ADDRESS_ZERO } from '@/utils'
import { balanceOf } from '@/contracts/ERC20'
import { getChain, getChainName, isSupportChain, DEFAULT_CHAIN_ID, getNativeCurrency } from './useChains'
import { getPublicClient } from './useClient'

const walletChainIdRef = ref(0)
const accountRef = ref('')
const nativeBalanceRef = ref(0n)
const chainSupportedRef = ref(false)

const walletInfoRef = ref<WalletInfo>()

let walletClient: WalletClient | undefined
let cachedProvider: EIP1193Provider | undefined

export function getWalletClient() {
  if (!walletClient) {
    throw new Error('Wallet not connected!')
  }

  return walletClient
}

function getCachedProvider() {
  if (!cachedProvider) {
    throw new Error('Wallet not connected!')
  }

  return cachedProvider
}

function replaceWalletClient(provider: EIP1193Provider, chainId: number, account: string) {
  chainId ||= walletChainIdRef.value
  walletClient = createWalletClient({
    chain: getChain(chainId),
    account: (account || accountRef.value) as Address,
    transport: custom(provider),
  })
}

async function getChainId(provider: EIP1193Provider) {
  const chainId = await provider.request({ method: 'eth_chainId' }) as string
  return Number.parseInt(chainId, 16)
}

async function getAccounts(provider: EIP1193Provider) {
  return provider.request({ method: 'eth_accounts' }) as Promise<string[]>
}

export async function updateNativeBalance() {
  if (!walletChainIdRef.value || !accountRef.value) {
    nativeBalanceRef.value = 0n
    return
  }

  nativeBalanceRef.value = await balanceOf(getPublicClient(walletChainIdRef.value), ADDRESS_ZERO, accountRef.value)
}

function reset() {
  accountRef.value = ''
  walletChainIdRef.value = 0
  nativeBalanceRef.value = 0n
  chainSupportedRef.value = false
  walletInfoRef.value = undefined
  walletClient = undefined
}

async function update(chainId: number, account = '') {
  if (!isSupportChain(chainId)) {
    reset()
    console.warn(`chainId "${chainId}" not support`)
    return false
  }

  const provider = getCachedProvider()
  if (!account) {
    const accounts = await getAccounts(provider)
    account = accounts[0]!
  }
  account = getAddress(account)

  replaceWalletClient(provider, chainId, account)

  accountRef.value = account
  walletChainIdRef.value = chainId
  chainSupportedRef.value = true

  updateNativeBalance()
}

async function onConnect(connectInfo: ProviderConnectInfo) {
  await update(Number.parseInt(connectInfo.chainId, 16))
}

async function onChainChanged(chainId: string) {
  await update(Number.parseInt(chainId, 16))
}

async function onAccountsChanged(accounts: Address[]) {
  if (!accounts || accounts.length === 0) {
    reset()
    return
  }

  const chainId = await getChainId(getCachedProvider())
  await update(chainId, accounts[0])
}

function onDisconnect() {
  reset()
}

function clear() {
  const provider = cachedProvider
  if (provider) {
    provider.removeListener('connect', onConnect)
    provider.removeListener('chainChanged', onChainChanged)
    provider.removeListener('accountsChanged', onAccountsChanged)
    provider.removeListener('disconnect', onDisconnect)
    cachedProvider = undefined
  }

  reset()
}

async function addChain(chainId: number) {
  const chain = getChain(chainId)
  const client = getWalletClient()
  await client.addChain({ chain })
}

export async function switchChain(chainId: number) {
  try {
    const client = getWalletClient()
    await client.switchChain({ id: chainId })
  }
  catch (err: unknown) {
    if (err instanceof SwitchChainError) {
      await addChain(chainId)
    }
    else {
      throw err
    }
  }
}

async function init(provider: EIP1193Provider, info: WalletInfo, account: string, chainId: number, targetChainId: number | undefined = undefined) {
  if (cachedProvider !== provider) {
    provider.on('connect', onConnect)
    provider.on('chainChanged', onChainChanged)
    provider.on('accountsChanged', onAccountsChanged)
    provider.on('disconnect', onDisconnect)
    cachedProvider = provider
  }

  walletInfoRef.value = info

  if (!isSupportChain(chainId) || (targetChainId && chainId !== targetChainId)) {
    targetChainId ||= DEFAULT_CHAIN_ID
    replaceWalletClient(provider, targetChainId, account)
    await switchChain(targetChainId)
    return
  }

  await update(chainId, account)
}

export async function connect(wallet: Wallet, targetChainId: number | undefined = undefined) {
  const { provider, info } = wallet
  const accounts: string[] = info.name === 'Safe' ? await provider.request({ method: 'eth_accounts' }) : await provider.request({ method: 'eth_requestAccounts' })
  if (!accounts || accounts.length === 0) {
    return false
  }

  if (cachedProvider !== provider) {
    clear()
  }

  const chainId = await getChainId(provider as EIP1193Provider)
  await init(provider as EIP1193Provider, info, accounts[0]!, chainId, targetChainId)

  return true
}

export async function autoConnect(wallet: Wallet) {
  const accounts = await getAccounts(wallet.provider as EIP1193Provider)
  if (accounts.length === 0) {
    return false
  }

  return connect(wallet)
}

export function disconnect() {
  clear()
}

export const nativeCurrency = computed(() => getNativeCurrency(walletChainIdRef.value))

export const chainName = computed(() => getChainName(walletChainIdRef.value) || walletClient?.chain!.name || '')

const readonlyWalletChainId = readonly(walletChainIdRef)
const readonlyAccount = readonly(accountRef)
const readonlyNativeBalance = readonly(nativeBalanceRef)
const readonlyChainSupported = readonly(chainSupportedRef)
const readonlyWalletInfo = readonly(walletInfoRef)

export const walletName = computed(() => walletInfoRef.value?.name)

export {
  readonlyAccount as account,
  readonlyChainSupported as chainSupported,
  readonlyNativeBalance as nativeBalance,
  readonlyWalletChainId as walletChainId,
  readonlyWalletInfo as walletInfo,
}
