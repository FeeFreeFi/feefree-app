import { createPublicClient, http, fallback } from "viem"
import { getChain, getRpcUrls } from "./useChains"

/** @type {{[chainId:number]: import('viem').PublicClient}} */
const publicClients = {}

/**
 * @param {string[]} urls
 */
const createTransport = urls => {
  return fallback(urls.map(url => http(url, { batch: true, wait: 50 })))
}

/**
 * @param {number} chainId
 */
export const getPublicClient = chainId => {
  if (!publicClients[chainId]) {
    publicClients[chainId] = createPublicClient({
      chain: getChain(chainId),
      transport: createTransport(getRpcUrls(chainId)),
    })
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
      pollingInterval: 2000,
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
