import pMap from "p-map"
import debounce from "lodash-es/debounce"
import { ref, readonly, onMounted, onBeforeUnmount } from "vue"
import { getTxMeta } from "@/utils/getTxMeta"
import {
  CHAIN_ID_ZORA,
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"
import { getPublicClient } from "./useClient"
import { getChain } from "./useChains"
import { createInterval } from "./useTimer"

/**
 * @param {{chainId:number, address:string}[]} nft
 */
const getNftKey = nft => `${nft.chainId}: ${nft.address}`

const cache = ref({})

const CONFIG = [
  {
    chainId: CHAIN_ID_ZORA,
    contracts: [
      {
        label: "FFGenesisNFT",
        address: "0xfDd0874588cAF4Df6E9AE26dACe1906c65292646",
        name: "FFGenesisNFT",
        symbol: "FFG",
        price: 10000000000000000n,
        free: false,
        image: "FFGenesisNFT.jpg",
        cap: 1000000n,
      },
      {
        label: "FFWeekNFT(202417)",
        address: "0x318f574DCb48Aa0ea12a7B0103009514d3A7C271",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-1.jpg",
        cap: 1000000n,
      },
      {
        label: "FFWeekNFT(202418)",
        address: "0x81d0fCD3a651f7ceB3Fb01358aE9E732d5271d5d",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-2.jpg",
        cap: 1000000n,
      },
    ],
  },
  {
    chainId: CHAIN_ID_BASE_SEPOLIA,
    contracts: [
      {
        label: "FFGenesisNFT",
        address: "0x570E588fe0e73A1E38Fade5cCa196030eb0E3c16",
        name: "FFGenesisNFT",
        symbol: "FFG",
        price: 10000000000000000n,
        free: false,
        image: "FFGenesisNFT.jpg",
        cap: 1000000n,
      },
      {
        label: "FFWeekNFT(202416)",
        address: "0xf2923d8c0E80d1a014681C86D6eEC4b6f09cAfB0",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-1.jpg",
        cap: 1000000n,
      },
      {
        label: "FFWeekNFT(202417)",
        address: "0x6354f5eBEd382aCbF0EbA6F7C46435D99a352170",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-2.jpg",
        cap: 1000000n,
      },
    ],
  },
]
const CONFIG_MAP = Object.fromEntries(CONFIG.map(c => [c.chainId, c]))

const ABI_MINT = [
  {
    name: "mint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "to",
				type: "address"
      }
    ],
    outputs: [],
  },
]

const ABI_TOTAL_SUPPLY = [
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        type: 'uint256',
      },
    ],
  },
]

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}}
 * @param {stirng} address
 * @param {stirng} to
 * @param {bigint} price
 */
export const mint = async ({ publicClient, walletClient }, address, to, price) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_MINT,
    functionName: 'mint',
    args: [to],
    value: price,
  })
  const hash = await walletClient.writeContract(request)

  return getTxMeta(hash, publicClient.chain)
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {stirng} address
 * @returns {bigint}
 */
export const totalSupply = async (publicClient, address) => {
  return publicClient.readContract({
    address,
    abi: ABI_TOTAL_SUPPLY,
    functionName: 'totalSupply',
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

/**
 * @param {{chainId:number, address:string}} nft
 * @returns {bigint}
 */
const getState = nft => {
  const key = getNftKey(nft)
  return cache.value[key] || 0n
}

/**
 * @param {{chainId:number, address:string}[]} nfts
 */
const getStates = nfts => {
  return nfts.map(nft => getState(nft))
}

/**
 * @param {{chainId:number, address:string}[]} nfts
 */
const updateStates = async nfts => {
  const items = await pMap(nfts, async nft => {
    /**
     * @type {bigint}
     */
    const total = await totalSupply(getPublicClient(nft.chainId), nft.address).catch(() => 0n)
    return [getNftKey(nft), total]
  }, { concurrency: 3 })

  const values = Object.fromEntries(items)

  cache.value = {
    ...cache.value,
    ...values,
  }
}

/**
 * @param {import('vue').ComputedRef<{chainId:number, address:string, symbol:string}[]>} nfts
 */
export const createNftStates = nfts => {
  const states = ref(nfts.value.map(() => 0n))

  const doUpdate = async () => {
    const list = [...nfts.value]
    states.value = getStates(list)
    await updateStates(list)
    states.value = getStates(list)
  }
  const debounceUpdate = debounce(doUpdate, 100, { leading: false, trailing: true })
  const { start: startUpdate, stop: stopUpdate } = createInterval(debounceUpdate, 60 * 1000)

  const update = (force = false) => {
    force ? doUpdate() : debounceUpdate()
  }

  onMounted(() => {
    debounceUpdate()

    onBeforeUnmount(() => {
      debounceUpdate.cancel()
    })
  })

  return {
    states: readonly(states),
    update,
    startUpdate,
    stopUpdate,
  }
}
