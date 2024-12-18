import { ref } from "vue"
import { getFees } from "@/contracts/Quoter"
import { getPublicClient } from "./useClient"
import { getQuoterAddress, getSupportedChains } from "./useManager"

/**
 * @type {import('vue').Ref<{[chainId:number]: {swapFee:bigint, exchangeFee:bigint, lpFee:bigint}}>}
 */
const config = ref({})

export const fetchFees = async () => {
  const chains = getSupportedChains()
  await Promise.all(chains.map(async ({ chainId }) => {
    const publicClient = getPublicClient(chainId)
    const quoter = getQuoterAddress(chainId)
    const { swapFee, exchangeFee, lpFee } = await getFees(publicClient, quoter)
    config.value[chainId] = { swapFee, exchangeFee, lpFee }
  }))
}

/**
 * @param {number} chainId
 */
const getFee = chainId => config.value[chainId]

/**
 * @param {number} chainId
 */
export const getSwapFee = chainId => {
  const fee = getFee(chainId)
  return fee?.swapFee || 0n
}

/**
 * @param {number} chainId
 */
export const getExchangeFee = chainId => {
  const fee = getFee(chainId)
  return fee?.exchangeFee || 0n
}

/**
 * @param {number} chainId
 */
export const getLpFee = chainId => {
  const fee = getFee(chainId)
  return fee?.lpFee || 0n
}
