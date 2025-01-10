import type { TokenMetadata } from '@/types'
import type {
  Chain,
} from 'viem/chains'
import {
  zora,
  base,
  scroll,
  linea,
  zksync,
} from 'viem/chains'
import {
  CHAIN_ID_ZORA,
  CHAIN_ID_BASE,
  CHAIN_ID_SCROLL,
  CHAIN_ID_LINEA,
  CHAIN_ID_ZKSYNC,
} from '@/config'

interface ChainExtra {
  id: number
  key: string
  name: string
  rpcUrls: string[]
}

const CHAINS = Object.freeze([
  zora,
  base,
  scroll,
  linea,
  zksync,
] as Chain[])
const CHAINS_MAP = Object.fromEntries(CHAINS.map(chain => [chain.id, chain]))

const CHAIN_EXTRAS: Record<number, ChainExtra> = {
  [CHAIN_ID_ZORA]: {
    id: CHAIN_ID_ZORA,
    key: 'zora',
    name: 'Zora',
    rpcUrls: [
      'https://rpc.zora.energy',
      'https://zora.drpc.org',
    ],
  },
  [CHAIN_ID_BASE]: {
    id: CHAIN_ID_BASE,
    key: 'base',
    name: 'Base',
    rpcUrls: [
      'https://mainnet.base.org',
      'https://base.llamarpc.com',
      'https://base.gateway.tenderly.co',
      'https://base.drpc.org',
      'https://base-rpc.publicnode.com',
      'https://base.blockpi.network/v1/rpc/public',
      'https://base-mainnet.public.blastapi.io',
      'https://1rpc.io/base',
    ],
  },
  [CHAIN_ID_SCROLL]: {
    id: CHAIN_ID_SCROLL,
    key: 'scroll',
    name: 'Scroll',
    rpcUrls: [
      // "https://scroll.drpc.org",
      'https://rpc.ankr.com/scroll',
      'https://scroll-rpc.publicnode.com',
      'https://scroll.blockpi.network/v1/rpc/public',
      'https://scroll-mainnet.public.blastapi.io',
      'https://1rpc.io/scroll',
      'https://rpc.scroll.io',
    ],
  },
  [CHAIN_ID_LINEA]: {
    id: CHAIN_ID_LINEA,
    key: 'linea',
    name: 'Linea',
    rpcUrls: [
      'https://rpc.linea.build',
      'https://linea.drpc.org',
      'https://linea.decubate.com',
      'https://linea.blockpi.network/v1/rpc/public',
      'https://1rpc.io/linea',
    ],
  },
  [CHAIN_ID_ZKSYNC]: {
    id: CHAIN_ID_ZKSYNC,
    key: 'zksync',
    name: 'zkSync Era',
    rpcUrls: [
      'https://mainnet.era.zksync.io',
      'https://zksync.drpc.org',
      'https://zksync-era.blockpi.network/v1/rpc/public',
    ],
  },
}

const getChainExtra = (chainId: number) => CHAIN_EXTRAS[chainId]

export const isSupportChain = (chainId: number) => !!CHAINS_MAP[chainId]

export const getChains = () => CHAINS

export const DEFAULT_CHAIN_ID = CHAIN_ID_ZORA

export const getChain = (chainId: number) => {
  if (!isSupportChain(chainId)) {
    throw new Error(`Unknown chain, chainId: "${chainId}"`)
  }

  return CHAINS_MAP[chainId]
}

export const getRpcUrls = (chainId: number) => getChainExtra(chainId)?.rpcUrls || []

export const getChainName = (chainId: number) => getChainExtra(chainId)?.name || ''

export const getNativeCurrency = (chainId: number) => CHAINS_MAP[chainId].nativeCurrency as TokenMetadata

export const getExplorerUrl = (chainId: number) => {
  const chain = getChain(chainId)
  const url = chain.blockExplorers!.default.url

  return url.endsWith('/') ? url.slice(0, -1) : url
}

export const getChainIdByKey = (key: string) => Object.values(CHAIN_EXTRAS).find(it => it.key === key)?.id || 0

export const getChainKey = (chainId: number) => getChainExtra(chainId)?.key || ''

export const getTransactionUrl = (chainId: number, hash: string) => {
  return `${getExplorerUrl(chainId)}/tx/${hash}`
}

export const getContractUrl = (chainId: number, contract: string) => {
  return `${getExplorerUrl(chainId)}/address/${contract}`
}

export const getTokenUrl = (chainId: number, token: string) => {
  return `${getExplorerUrl(chainId)}/token/${token}`
}

export const getHolderUrl = (chainId: number, token: string, holder: string) => {
  return `${getExplorerUrl(chainId)}/token/${token}${holder ? `?a=${holder}` : ''}`
}

export const getAccountUrl = (chainId: number, account: string) => {
  return `${getExplorerUrl(chainId)}/address/${account}`
}

export const getNftUrl = (chainId: number, address: string, id: bigint) => {
  return `${getExplorerUrl(chainId)}/token/${address}?a=${id}`
}
