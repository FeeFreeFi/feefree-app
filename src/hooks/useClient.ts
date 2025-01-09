import type { PublicClient, Hash } from "viem"
import { createPublicClient, http, fallback } from "viem"
import { getChain, getRpcUrls } from "./useChains"

const publicClients: {[chainId: number]: PublicClient} = {}

const createTransport = (urls: string[]) => {
  return fallback(urls.map(url => http(url, { batch: true })))
}

export const getPublicClient = (chainId: number) => {
  if (!publicClients[chainId]) {
    const publicClient = createPublicClient({
      chain: getChain(chainId),
      transport: createTransport(getRpcUrls(chainId)),
    })
    publicClients[chainId] = publicClient! as PublicClient
  }

  return publicClients[chainId]
}

export const getBlockNumber = async (chainId: number) => {
  return getPublicClient(chainId).getBlockNumber({ cacheTime: 1000 })
}

export const getTransactionReceipt = async (chainId: number, hash: string) => {
  return getPublicClient(chainId).getTransactionReceipt({ hash: hash as Hash })
}

export const waitForTransactionReceipt = async (chainId: number, hash: string, confirms = 1) => {
  return new Promise(resolve => {
    const diff = BigInt(confirms - 1)
    const publicClient = getPublicClient(chainId)
    const unwatch = publicClient.watchBlockNumber({
      pollingInterval: 2000,
      onBlockNumber: async blockNumber => {
        const receipt = await publicClient.getTransactionReceipt({ hash: hash as Hash }).catch(() => {})
        if (!receipt || blockNumber - receipt.blockNumber < diff) {
          return
        }

        unwatch()
        resolve(receipt)
      },
    })
  })
}
