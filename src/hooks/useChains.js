import {
  zora,
  base,
  scroll,
  linea,
  zksync,
} from "viem/chains"
import {
  CHAIN_ID_ZORA,
  CHAIN_ID_BASE,
  CHAIN_ID_SCROLL,
  CHAIN_ID_LINEA,
  CHAIN_ID_ZKSYNC,
} from "@/config"

/** @type {import('viem').Chain[]} */
const CHAINS = Object.freeze([
  zora,
  base,
  scroll,
  linea,
  zksync,
])
const CHAINS_MAP = Object.fromEntries(CHAINS.map(chain => [chain.id, chain]))

/** @type {{[chainId:number]: {id:number, key:string, name:string, rpcUrls:string[]}}} */
const CHAIN_EXTRAS = {
  [CHAIN_ID_ZORA]: {
    id: CHAIN_ID_ZORA,
    key: "zora",
    name: "Zora",
    rpcUrls: [
      "https://rpc.zora.energy",
      "https://zora.drpc.org",
    ],
  },
  [CHAIN_ID_BASE]: {
    id: CHAIN_ID_BASE,
    key: "base",
    name: "Base",
    rpcUrls: [
      "https://mainnet.base.org",
      "https://base.llamarpc.com",
      "https://base.gateway.tenderly.co",
      "https://base.drpc.org",
      "https://base-rpc.publicnode.com",
      "https://base.blockpi.network/v1/rpc/public",
      "https://base-mainnet.public.blastapi.io",
      "https://1rpc.io/base",
    ],
  },
  [CHAIN_ID_SCROLL]: {
    id: CHAIN_ID_SCROLL,
    key: "scroll",
    name: "Scroll",
    rpcUrls: [
      // "https://scroll.drpc.org",
      "https://rpc.ankr.com/scroll",
      "https://scroll-rpc.publicnode.com",
      "https://scroll.blockpi.network/v1/rpc/public",
      "https://scroll-mainnet.public.blastapi.io",
      "https://1rpc.io/scroll",
      "https://rpc.scroll.io",
    ],
  },
  [CHAIN_ID_LINEA]: {
    id: CHAIN_ID_LINEA,
    key: "linea",
    name: "Linea",
    rpcUrls: [
      "https://rpc.linea.build",
      "https://linea.drpc.org",
      "https://linea.decubate.com",
      "https://linea.blockpi.network/v1/rpc/public",
      "https://1rpc.io/linea",
    ],
  },
  [CHAIN_ID_ZKSYNC]: {
    id: CHAIN_ID_ZKSYNC,
    key: "zksync",
    name: "zkSync Era",
    rpcUrls: [
      "https://mainnet.era.zksync.io",
      "https://zksync.drpc.org",
      "https://zksync-era.blockpi.network/v1/rpc/public",
    ],
  },
}

/**
 * @param {number} chainId
 */
const getChainExtra = chainId => CHAIN_EXTRAS[chainId]

/**
 * @param {number} chainId
 */
export const isSupportChain = chainId => !!CHAINS_MAP[chainId]

export const getChains = () => CHAINS

export const DEFAULT_CHAIN_ID = CHAIN_ID_ZORA

/**
 * @param {number} chainId
 */
export const getChain = chainId => {
  if (!isSupportChain(chainId)) {
    throw new Error(`Unknown chain, chainId: "${chainId}"`)
  }

  return CHAINS_MAP[chainId]
}

/**
 * @param {number} chainId
 */
export const getRpcUrls = chainId => getChainExtra(chainId)?.rpcUrls || []

/**
 * @param {number} chainId
 */
export const getChainName = chainId => getChainExtra(chainId)?.name || ""

/**
 * @param {number} chainId
 */
export const getNativeCurrency = chainId => CHAINS_MAP[chainId].nativeCurrency

/**
 * @param {number} chainId
 */
export const getExplorerUrl = chainId => {
  const chain = getChain(chainId)
  const url = chain.blockExplorers.default.url

  return url.endsWith("/") ? url.slice(0, -1) : url
}

/**
 * @param {string} key
 */
export const getChainIdByKey = key => Object.values(CHAIN_EXTRAS).find(it => it.key === key)?.id || 0

/**
 * @param {number} chainId
 */
export const getChainKey = chainId => getChainExtra(chainId)?.key || ""

/**
 * @param {number} chainId
 * @param {string} hash
 */
export const getTransactionUrl = (chainId, hash) => {
  return `${getExplorerUrl(chainId)}/tx/${hash}`
}

/**
 * @param {number} chainId
 * @param {string} contract
 */
export const getContractUrl = (chainId, contract) => {
  return `${getExplorerUrl(chainId)}/address/${contract}`
}

/**
 * @param {number} chainId
 * @param {string} token
 */
export const getTokenUrl = (chainId, token) => {
  return `${getExplorerUrl(chainId)}/token/${token}`
}

/**
 * @param {number} chainId
 * @param {string} token
 * @param {string} holder
 */
export const getHolderUrl = (chainId, token, holder) => {
  return `${getExplorerUrl(chainId)}/token/${token}${holder ? `?a=${holder}` : ''}`
}

/**
 * @param {number} chainId
 * @param {string} account
 */
export const getAccountUrl = (chainId, account) => {
  return `${getExplorerUrl(chainId)}/address/${account}`
}

/**
 * @param {number} chainId
 * @param {string} address
 * @param {bigint} id
 */
export const getNftUrl = (chainId, address, id) => {
  return `${getExplorerUrl(chainId)}/token/${address}?a=${id}`
}
