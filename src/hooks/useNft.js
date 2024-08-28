import pMap from "p-map"
import debounce from "lodash-es/debounce"
import { ref, readonly, onMounted, onBeforeUnmount } from "vue"
import { getTxMeta } from "@/utils/chain"
import {
  CHAIN_ID_ZORA,
  CHAIN_ID_BASE,
  CHAIN_ID_SCROLL,
  CHAIN_ID_LINEA,
  CHAIN_ID_ZKSYNC,
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"
import { getPublicClient } from "./useClient"
import { getChain } from "./useChains"
import { createInterval } from "./useTimer"

/**
 * @param {import('@/types').Nft} nft
 */
const getNftKey = nft => `${nft.chainId}: ${nft.address}`

const cache = ref({})

const CONFIG = [
  {
    chainId: CHAIN_ID_ZORA,
    contracts: [
      {
        label: "FFGenesisNFT",
        address: "0xDA29e0a34d806D2009A2E354B75A0e6C8C76419D",
        name: "FFGenesisNFT",
        symbol: "FFG",
        price: 10000000000000000n,
        free: false,
        image: "FFGenesisNFT.jpg",
        cap: 10000n,
        capLabel: "10K",
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
        capLabel: "1M",
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
        capLabel: "1M",
      },
      {
        label: "FFWeekNFT(202429)",
        address: "0x14CEa96bf423cf47468821bdDF37058Bf1BCB5e5",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-3.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
      {
        label: "FFWeekNFT(202435)",
        address: "0x05B3503723e4b0abf1df520536170d37Cb5597AF",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-4.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
    ],
  },
  {
    chainId: CHAIN_ID_BASE,
    contracts: [
      {
        label: "FFGenesisNFT",
        address: "0x47Fbf1c403eb4366796A363847eB100103b0a829",
        name: "FFGenesisNFT",
        symbol: "FFG",
        price: 10000000000000000n,
        free: false,
        image: "FFGenesisNFT.jpg",
        cap: 10000n,
        capLabel: "10K",
      },
      {
        label: "FFWeekNFT(202419)",
        address: "0x17022A3854AE6d8a0BbcC14934CC219123D96a00",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-1.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
      {
        label: "FFWeekNFT(202420)",
        address: "0x25BA65303D920744da81A847DB923BfCb9cf56Bc",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-2.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
      {
        label: "FFWeekNFT(202429)",
        address: "0x4184b3A9a4b1007865B4Fa5E95FB13f53d04cED9",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-3.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
      {
        label: "FFWeekNFT(202435)",
        address: "0xCe24057359E4e62377E8304dC400721b0D0C2D31",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-4.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
    ],
  },
  {
    chainId: CHAIN_ID_SCROLL,
    contracts: [
      {
        label: "FFGenesisNFT",
        address: "0x6B8fbeadaeBdD3Eb1BB559DebE29cd46c3527cbc",
        name: "FFGenesisNFT",
        symbol: "FFG",
        price: 10000000000000000n,
        free: false,
        image: "FFGenesisNFT.jpg",
        cap: 10000n,
        capLabel: "10K",
      },
      {
        label: "FFWeekNFT(202419)",
        address: "0x8574376DBD1c83009dD806Cd8bAe7AE58Df1c3Ab",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-1.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
      {
        label: "FFWeekNFT(202420)",
        address: "0x0ea46b69fA168644DFEF492321b9E58c5E304Ec4",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-2.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
      {
        label: "FFWeekNFT(202429)",
        address: "0xd96FB475B3A10f2ef62454fDE0e00162aD972166",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-3.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
      {
        label: "FFWeekNFT(202435)",
        address: "0xCfAece28407Ad6F4bde8D58Bc2C0ce53C89f8158",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-4.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
    ],
  },
  {
    chainId: CHAIN_ID_LINEA,
    contracts: [
      {
        label: "FFGenesisNFT",
        address: "0xa803C1D7F10CeEAB2e961A188067fbDF7A5a378a",
        name: "FFGenesisNFT",
        symbol: "FFG",
        price: 10000000000000000n,
        free: false,
        image: "FFGenesisNFT.jpg",
        cap: 10000n,
        capLabel: "10K",
      },
      {
        label: "FFWeekNFT(202431)",
        address: "0x6B8fbeadaeBdD3Eb1BB559DebE29cd46c3527cbc",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-1.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
      {
        label: "FFWeekNFT(202432)",
        address: "0x8574376DBD1c83009dD806Cd8bAe7AE58Df1c3Ab",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-2.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
    ],
  },
  {
    chainId: CHAIN_ID_ZKSYNC,
    contracts: [
      {
        label: "FFGenesisNFT",
        address: "0xA64E69c3f579E08849fbbE16B666E6C4D4B8Bfe4",
        name: "FFGenesisNFT",
        symbol: "FFG",
        price: 10000000000000000n,
        free: false,
        image: "FFGenesisNFT.jpg",
        cap: 10000n,
        capLabel: "10K",
      },
      {
        label: "FFWeekNFT(202419)",
        address: "0x7C32eFd1e91B05891da19812dB33FbF57581ad9e",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-1.jpg",
        cap: 1000000n,
        capLabel: "1M",
      },
      {
        label: "FFWeekNFT(202420)",
        address: "0x6acFa71c90d0b47437468F8FD9C475CcC5055F10",
        name: "FFWeekNFT",
        symbol: "FFW",
        price: 0n,
        free: true,
        image: "FFWeekNFT-2.jpg",
        cap: 1000000n,
        capLabel: "1M",
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
        capLabel: "1M",
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
        capLabel: "1M",
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
        capLabel: "1M",
      },
    ],
  },
]
const CONFIG_MAP = Object.fromEntries(CONFIG.map(c => [c.chainId, c]))
const SUPPORTED_CHAINS = CONFIG.map(c => ({ chainId: c.chainId }))

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

export const getSupportedChains = () => SUPPORTED_CHAINS

/**
 * @param {number} chainId
 */
export const isSupportChain = chainId => !!SUPPORTED_CHAINS.find(it => it.chainId === chainId)

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}}
 * @param {string} address
 * @param {string} to
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
 * @param {string} address
 * @returns {Promise<bigint>}
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
 * @param {import('@/types').Nft} nft
 * @returns {bigint}
 */
const getState = nft => {
  const key = getNftKey(nft)
  return cache.value[key] || 0n
}

/**
 * @param {import('@/types').Nft[]} nfts
 */
const getStates = nfts => {
  return nfts.map(nft => getState(nft))
}

/**
 * @param {import('@/types').Nft[]} nfts
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
 * @param {import('vue').ComputedRef<import('@/types').Nft[]>} nfts
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
