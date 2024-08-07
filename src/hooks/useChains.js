import {
  CHAIN_ID_ZORA,
  CHAIN_ID_BASE,
  CHAIN_ID_SCROLL,
  CHAIN_ID_LINEA,
  CHAIN_ID_ZKSYNC,
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"
import {
  zora,
  base,
  scroll,
  linea,
  zkSync,
  baseSepolia,
} from "viem/chains"

const CHAINS = Object.freeze([
  zora,
  base,
  scroll,
  linea,
  zkSync,
  baseSepolia,
])
const CHAINS_MAP = Object.fromEntries(CHAINS.map(chain => [chain.id, chain]))
const CHAIN_IDS_MAP = Object.fromEntries(CHAINS.map(chain => [chain.id, true]))

const CHAIN_EXTRAS = [
  {
    id: CHAIN_ID_ZORA,
    key: "zora",
    name: "Zora",
    symbol: "ETH",
    extraRpcUrls: [
    ],
    gasType: "maxFeePerGas",
    isZkEVM: false,
  },
  {
    id: CHAIN_ID_BASE,
    key: "base",
    name: "Base",
    symbol: "ETH",
    extraRpcUrls: [
      "https://base.llamarpc.com",
      "https://base.drpc.org",
    ],
    gasType: "maxFeePerGas",
    isZkEVM: false,
  },
  {
    id: CHAIN_ID_SCROLL,
    key: "scroll",
    name: "Scroll",
    symbol: "ETH",
    extraRpcUrls: [
      "https://scroll.drpc.org",
      "https://rpc.ankr.com/scroll",
    ],
    gasType: "maxFeePerGas",
    isZkEVM: true,
  },
  {
    id: CHAIN_ID_LINEA,
    key: "linea",
    name: "Linea",
    symbol: "ETH",
    extraRpcUrls: [
      "https://linea.drpc.org",
      "https://1rpc.io/linea",
    ],
    gasType: "maxFeePerGas",
    isZkEVM: true,
  },
  {
    id: CHAIN_ID_ZKSYNC,
    key: "zksync",
    name: "zkSync Era",
    symbol: "ETH",
    extraRpcUrls: [
      "https://zksync.drpc.org",
      "https://zksync-era.blockpi.network/v1/rpc/public",
    ],
    gasType: "maxFeePerGas",
    isZkEVM: true,
  },
  {
    id: CHAIN_ID_BASE_SEPOLIA,
    key: "base-sepolia",
    name: "Base Sepolia",
    symbol: "ETH",
    extraRpcUrls: [
      "https://base-sepolia-rpc.publicnode.com",
      "https://base-sepolia.blockpi.network/v1/rpc/public",
    ],
    gasType: "maxFeePerGas",
    isZkEVM: false,
  },
]
const CHAIN_EXTRAS_MAP = Object.fromEntries(CHAIN_EXTRAS.map(chain => [chain.id, chain]))

const RPC_URLS_MAP = Object.fromEntries(CHAINS.map(chain => {
  const defaultUrl = chain.rpcUrls.default.http[0]
  return [chain.id, [defaultUrl, ...CHAIN_EXTRAS_MAP[chain.id].extraRpcUrls]]
}))

/**
 * @param {number} chainId
 */
const getChainExtra = chainId => CHAIN_EXTRAS_MAP[chainId]

/**
 * @param {number} chainId
 */
export const isSupportChain = chainId => CHAIN_IDS_MAP[chainId]

export const getChains = () => CHAINS

export const getDefaultChain = () => CHAINS[0]

/**
 * @param {number} chainId
 */
export const getChain = chainId => {
  if (!isSupportChain(chainId)) {
    throw new Error(`Unknown chain, chainId: "${chainId}"`)
  }

  return CHAINS_MAP[chainId]
}

export const getRpcUrls = chainId => RPC_URLS_MAP[chainId] || []

/**
 * @param {number} chainId
 */
export const getChainName = chainId => getChainExtra(chainId).name

/**
 * @param {number} chainId
 */
export const getGasType = chainId => getChainExtra(chainId).gasType

/**
 * @param {number} chainId
 */
export const isZkEVM = chainId => getChainExtra(chainId).isZkEVM

/**
 * @param {number} chainId
 */
export const getChainSymbol = chainId => CHAIN_EXTRAS_MAP[chainId].symbol

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
export const getChainIdByKey = key => CHAIN_EXTRAS.find(it => it.key === key)?.id || 0

/**
 * @param {number} chainId
 */
export const getChainKey = chainId => CHAIN_EXTRAS_MAP[chainId]?.key || ""
