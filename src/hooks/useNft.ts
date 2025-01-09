import type { Ref } from "vue"
import type { Nft } from "@/types"
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

const config = ref<{[chainId: number]: Nft[]}>()

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

export const getSupportedChains = () => Object.keys(config.value || {}).map(chainId => ({ chainId: parseInt(chainId, 10) }))

export const getNfts = (chainId: number) => config.value?.[chainId] || []

const totalSupply = async (nft: Nft) => {
  const { chainId, address } = nft
  return _totalSupply(getPublicClient(chainId), address)
}

const getMinted = async (nfts: Nft[]) => {
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

const getKey = (nft: Nft) => `${nft.chainId}:${nft.address}`

const cache = createCache()

const getValues = (nfts: Nft[]) => {
  return nfts.map(nft => nft ? cache.getValue(getKey(nft), 0n) as bigint : 0n)
}

const updateValues = async (nfts: Nft[]) => {
  const values = await getMinted(nfts)
  cache.setValues(Object.fromEntries(nfts.map((it, index) => [getKey(it), values[index]])))
}

export const createNftStates = (nfts: Ref<Nft[]>, states: Ref<bigint[]>) => {
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

export const mint = async (nft: Nft) => {
  const { address, chainId, price } = nft

  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()

  return _mint({ publicClient, walletClient }, address, { value: price })
}
