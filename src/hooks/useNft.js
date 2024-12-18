import pMap from "p-map"
import { groupBy } from "lodash-es"
import { ref, watch } from "vue"
import { getNfts as _getNfts } from "@/api"
import { mint as _mint, totalSupply as _totalSupply } from "@/contracts/Nft"
import { getMinted as _getMinted } from "@/contracts/Quoter"
import { getPublicClient } from "./useClient"
import { createDebounceUpdate } from "./useTimer"
import { getWalletClient } from "./useWallet"
import { createCache } from "./useCache"
import { getQuoterAddress } from "./useManager"

/** @type {import('vue').Ref<{[chainId:number]: import('@/types').Nft[]}>} */
const config = ref(null)

export const fetchNfts = async () => {
  if (config.value) {
    return
  }

  const res = await _getNfts()
  if (res.code !== 0) {
    console.log(res.message)
    return
  }

  config.value = groupBy(res.data, "chainId")
}

export const getSupportedChains = () => Object.keys(config.value).map(chainId => ({ chainId: parseInt(chainId, 10) }))

/**
 * @param {number} chainId
 */
export const getNfts = chainId => config.value?.[chainId] || []

/**
 * @param {import('@/types').Nft} nft
 * @returns {Promise<bigint>}
 */
const totalSupply = async nft => {
  const { chainId, address } = nft
  return _totalSupply(getPublicClient(chainId), address)
}

/**
 * @param {import('@/types').Nft[]} nfts
 */
const getMinted = async nfts => {
  if (nfts.length === 0) {
    return []
  }

  const { chainId } = nfts[0]
  const quoter = getQuoterAddress(chainId)
  if (quoter) {
    const publicClient = getPublicClient(chainId)
    return _getMinted(publicClient, quoter, nfts.map(it => it.address))
  }

  return pMap(nfts, totalSupply, { concurrency: 3 })
}

/**
 * @param {import('@/types').Nft} nft
 */
const getKey = nft => `${nft.chainId}:${nft.address}`

const cache = createCache()

/**
 * @param {import('@/types').Nft[]} nfts
 * @returns {bigint[]}
 */
const getValues = nfts => {
  return nfts.map(nft => nft ? cache.getValue(getKey(nft), 0n) : 0n)
}

/**
 * @param {import('@/types').Nft[]} nfts
 */
const updateValues = async nfts => {
  const values = await getMinted(nfts)
  cache.setValues(Object.fromEntries(nfts.map((it, index) => [getKey(it), values[index]])))
}

/**
 * @param {import('vue').Ref<import('@/types').Nft[]>} nfts
 * @param {import('vue').Ref<bigint[]>} states
 */
export const createNftStates = (nfts, states) => {
  const getDefaults = () => nfts.value.map(() => 0n)

  states.value = getDefaults()

  const doUpdate = async () => {
    const _nfts = nfts.value
    states.value = getValues(_nfts)
    await updateValues(_nfts)
    states.value = getValues(_nfts)
  }

  const { debounceUpdate } = createDebounceUpdate(doUpdate, 1000, 120000)

  watch(nfts, doUpdate)

  return debounceUpdate
}

/**
 * @param {import('@/types').Nft} nft
 */
export const mint = async nft => {
  const { address, chainId, price } = nft

  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  return _mint({ publicClient, walletClient }, address, { value: price })
}
