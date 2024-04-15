import { ref, readonly } from "vue"
import { getDefaultChain } from "./useChains"

const chainIdRef = ref(getDefaultChain().id)
const readonlyChainId = readonly(chainIdRef)

/**
 * @param {number} chainId
 */
export const setSelectedChainId = chainId => {
  chainIdRef.value = chainId
}

export {
  readonlyChainId as selectedChainId,
}
