import {
  CHAIN_ID_ZORA,
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"
import {
  zora,
  baseSepolia,
} from "viem/chains"

const CHAINS = Object.freeze([
  zora,
  baseSepolia,
])
const CHAINS_MAP = Object.fromEntries(CHAINS.map(chain => [chain.id, chain]))
const CHAIN_IDS_MAP = Object.fromEntries(CHAINS.map(chain => [chain.id, true]))

const CHAIN_EXTRAS = [
  {
    id: CHAIN_ID_ZORA,
    name: "Zora",
    symbol: "ETH",
    extraRpcUrls: [
    ],
    gasType: "maxFeePerGas",
    isZkEVM: false,
  },
  {
    id: CHAIN_ID_BASE_SEPOLIA,
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
