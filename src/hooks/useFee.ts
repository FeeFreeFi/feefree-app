import { ref } from 'vue'
import { getFees } from '@/contracts/Quoter'
import { getPublicClient } from './useClient'
import { getQuoterAddress, getSupportedChains } from './useManager'

const config = ref<Record<number, { swapFee: bigint, exchangeFee: bigint, lpFee: bigint }>>({})

export const fetchFees = async () => {
  const chains = getSupportedChains()
  await Promise.all(chains.map(async ({ chainId }) => {
    const publicClient = getPublicClient(chainId)
    const quoter = getQuoterAddress(chainId)
    const { swapFee, exchangeFee, lpFee } = await getFees(publicClient, quoter)
    config.value[chainId] = { swapFee, exchangeFee, lpFee }
  }))
}

const getFee = (chainId: number) => config.value[chainId]

export const getSwapFee = (chainId: number) => {
  const fee = getFee(chainId)
  return fee?.swapFee || 0n
}

export const getExchangeFee = (chainId: number) => {
  const fee = getFee(chainId)
  return fee?.exchangeFee || 0n
}

export const getLpFee = (chainId: number) => {
  const fee = getFee(chainId)
  return fee?.lpFee || 0n
}
