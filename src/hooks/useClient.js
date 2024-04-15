import { createPublicClient, http, fallback } from "viem"
import { getChain, getGasType, getRpcUrls } from "./useChains"

const publicClients = {}

const createTransport = urls => {
  return fallback(urls.map(url => http(url, { batch: true, wait: 50 })))
}

/**
 * @param {number} chainId
 * @returns {import('viem').PublicClient}
 */
export const getPublicClient = chainId => {
  if (!publicClients[chainId]) {
    const chain = getChain(chainId)
    const publicClient = createPublicClient({
      chain,
      transport: createTransport(getRpcUrls(chain.id)),
    })

    publicClients[chainId] = publicClient
  }

  return publicClients[chainId]
}

/**
 * @param {number} chainId
 */
export const getBlockNumber = async chainId => {
  return getPublicClient(chainId).getBlockNumber({ cacheTime: 1000 })
}

/**
 * @param {number} chainId
 * @param {string} hash
 */
export const getTransactionReceipt = async (chainId, hash) => {
  return getPublicClient(chainId).getTransactionReceipt({ hash })
}

/**
 * @param {number} chainId
 * @param {string} hash
 * @param {number} confirms
 */
export const waitForTransactionReceipt = async (chainId, hash, confirms = 1) => {
  return new Promise(resolve => {
    const diff = BigInt(confirms - 1)
    const publicClient = getPublicClient(chainId)
    const unwatch = publicClient.watchBlockNumber({
      onBlockNumber: async blockNumber => {
        const receipt = await publicClient.getTransactionReceipt({ hash }).catch(() => false)
        if (!receipt || blockNumber - receipt.blockNumber < diff) {
          return
        }

        unwatch()
        resolve(receipt)
      },
    })
  })
}

/**
 * @param {number} chainId
 */
export const getGasPrice = async chainId => {
  const gasType = getGasType(chainId)
  const publicClient = getPublicClient(chainId)
  if (gasType === "gasPrice") {
    return publicClient.getGasPrice()
  }

  const { maxFeePerGas } = await publicClient.estimateFeesPerGas()
  return maxFeePerGas
}

/**
 * @param {number} chainId
 * @param {import('viem').EstimateContractGasParameters} data
 */
export const estimateGas = async (chainId, data) => {
  const publicClient = getPublicClient(chainId)

  const [gas, gasPrice] = await Promise.all([
    publicClient.estimateContractGas(data),
    getGasPrice(chainId),
  ])

  return {
    gas,
    gasPrice,
    transactionFee: gas * gasPrice,
  }
}
