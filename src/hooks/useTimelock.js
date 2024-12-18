import { unlock as _unlock, lock as _lock } from "@/contracts/Timelock"
import { getLockDatas as _getLockDatas } from "@/contracts/Quoter"
import { allowance, isOperator } from "@/contracts/ERC6909"
import { getPublicClient } from "./useClient"
import { getManager, getQuoterAddress } from "./useManager"
import { getWalletClient, walletChainId } from "./useWallet"
import { createCache } from "./useCache"

const cache = createCache()

/**
 * @param {number} chainId
 * @param {string} poolId
 */
const getKey = (chainId, poolId) => `${chainId}:${poolId}`

/**
 * @param {number} chainId
 * @param {string} poolId
 * @returns {import('@/types').LockData[]}
 */
const getValues = (chainId, poolId )=> {
  return cache.getValue(getKey(chainId, poolId))
}

/**
 * @param {import('@/types').PoolMeta} pool
 * @param {string} account
 * @param {boolean} force
 */
export const getLockDatas = async (pool, account, force = false) => {
  const { chainId, id } = pool
  let result = force ? null : getValues(chainId, id)

  if (!result) {
    const publicClient = getPublicClient(chainId)
    const quoter = getQuoterAddress(chainId)
    result = await _getLockDatas(publicClient, quoter, account, pool.id)

    cache.setValue(getKey(chainId, id), result)
  }

  return result
}

/**
 * @param {import('@/types').PoolMeta} pool
 * @param {string} account
 * @param {bigint} amount
 */
export const checkAllowance = async (pool, account, amount) => {
  const { chainId, id } = pool
  const publicClient = getPublicClient(chainId)
  const { timelock, liquidity } = getManager(chainId)
  const [approved, value] = await Promise.all([
    isOperator(publicClient, liquidity, account, timelock),
    allowance(publicClient, liquidity, account, timelock, BigInt(id))
  ])

  return approved || value >= amount
}

/**
 * @param {import('@/types').PoolMeta} pool
 * @param {string} amount
 */
export const approve = async (pool, amount) => {
  const { chainId, id } = pool
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const { timelock, liquidity } = getManager(chainId)

  return approve({ publicClient, walletClient }, liquidity, timelock, BigInt(id), amount)
}

/**
 * @param {import('@/types').PoolMeta} pool
 * @param {bigint} amount
 * @param {number} unlockTime
 * @param {string} recipient
 */
export const lock = async (pool, amount, unlockTime, recipient) => {
  const { chainId, id } = pool
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const account = walletClient.account.address
  const { timelock, liquidity } = getManager(chainId)

  return _lock({ publicClient, walletClient }, timelock, liquidity, account, BigInt(id), amount, unlockTime, recipient)
}

/**
 * @param {string} lockId
 * @param {string} recipient
 */
export const unlock = async (lockId, recipient) => {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const { timelock } = getManager(chainId)

  return _unlock({ publicClient, walletClient }, timelock, lockId, recipient)
}
