import pMap from "p-map"
import { getPublicClient } from "./useClient"
import { getTxMeta } from "@/utils/getTxMeta"
import {
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"
import { getChain } from "./useChains"
import { createCache } from "./useDataCache"

const CONFIG = [
  {
    chainId: CHAIN_ID_BASE_SEPOLIA,
    contracts: [
      { label: "FFGenesisNFT", address: "0xf70cF082332eD4a3f76E0c19D9E1B2D6f93e8dbB", name: "FFGenesisNFT", symbol: "FFG" },
      { label: "FFWeekNFT(202416)", address: "0x0726b9554e459B862DAC048ff3989901F74F1d66", name: "FFWeekNFT", symbol: "FFW" },
    ],
  },
]
const CONFIG_MAP = Object.fromEntries(CONFIG.map(c => [c.chainId, c]))

const ABI_MINT = [
  {
    name: "mint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
]

const ABI_MINTED = [
  {
		name: "minted",
		type: "function",
    stateMutability: "view",
    inputs: [
			{
				name: "",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
  }
]

const cache = createCache()

/**
 * @param {{chainId:number, address:string}} token
 */
const getNftKey = nft => `${nft.chainId}:${nft.address}`

/**
 * @param {string} account
 * @param {{chainId:number, address:string}} nfts
 * @returns {(bigint|false)[]}
 */
export const getStates = (account, nfts) => {
  const keys = nfts.map(nft => getNftKey(nft))
  return cache.getValues(account, keys, false)
}

/**
 * @param {string} account
 * @param {{chainId:number, address:string}} nfts
 */
export const updateStates = async (account, nfts) => {
  const items = await pMap(nfts, async nft => {
    const tokenId = await minted(getPublicClient(nft.chainId), nft.address, account).catch(() => 0n)
    const state = tokenId !== 0n ? tokenId : false
    const key = getNftKey(nft)
    return [key, state]
  }, { concurrency: 3 })

  const states = Object.fromEntries(items)
  cache.setValues(account, states)
}

export const resetStates = () => {
  cache.reset()
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}}
 * @param {stirng} address
 */
export const mint = async ({ publicClient, walletClient }, address) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_MINT,
    functionName: 'mint',
  })
  const hash = await walletClient.writeContract(request)

  return getTxMeta(hash, publicClient.chain)
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {stirng} address
 * @param {string} account
 * @returns {bigint}
 */
export const minted = async (publicClient, address, account) => {
  return publicClient.readContract({
    address,
    abi: ABI_MINTED,
    functionName: 'minted',
    args: [account],
  })
}

/**
 * @param {number} chainId
 */
export const getNftList = chainId => (CONFIG_MAP[chainId]?.contracts || []).map(it => ({ ...it, chainId }))

/**
 * @param {number} chainId
 * @param {string} address
 * @param {bigint} id
 */
export const getNftExplorerUrl = (chainId, address, id) => {
  const { blockExplorers } = getChain(chainId)
  let url = blockExplorers.default.url
  url = url.endsWith("/") ? url.slice(0, -1) : url

  return `${url}/token/${address}?a=${id}`
}
