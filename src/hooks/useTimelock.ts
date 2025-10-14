import type { LockData, PoolMeta } from '@/types'
import { unlock as _unlock, lock as _lock } from '@/contracts/Timelock'
import { getLockDatas as _getLockDatas } from '@/contracts/Quoter'
import { allowance, isOperator, approve as _approve } from '@/contracts/ERC6909'
import { getPublicClient } from './useClient'
import { getManager, getQuoterAddress } from './useManager'
import { getWalletClient, walletChainId } from './useWallet'
import { createCache } from './useCache'

const cache = createCache()

const getKey = (chainId: number, poolId: string) => `${chainId}:${poolId}`

function getValues(chainId: number, poolId: string) {
  return cache.getValue(getKey(chainId, poolId)) as LockData[]
}

export async function getLockDatas(pool: PoolMeta, account: string, force = false) {
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

export async function checkAllowance(pool: PoolMeta, account: string, amount: bigint) {
  const { chainId, id } = pool
  const publicClient = getPublicClient(chainId)
  const { timelock, liquidity } = getManager(chainId)
  const [approved, value] = await Promise.all([
    isOperator(publicClient, liquidity, account, timelock),
    allowance(publicClient, liquidity, account, timelock, BigInt(id)),
  ])

  return approved || value >= amount
}

export async function approve(pool: PoolMeta, amount: bigint) {
  const { chainId, id } = pool
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const { timelock, liquidity } = getManager(chainId)

  return _approve({ publicClient, walletClient }, liquidity, timelock, BigInt(id), amount)
}

export async function lock(pool: PoolMeta, amount: bigint, unlockTime: number, recipient: string) {
  const { chainId, id } = pool
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const account = walletClient.account!.address
  const { timelock, liquidity } = getManager(chainId)

  return _lock({ publicClient, walletClient }, timelock, liquidity, account, BigInt(id), amount, unlockTime, recipient)
}

export async function unlock(lockId: string, recipient: string) {
  const chainId = walletChainId.value
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const { timelock } = getManager(chainId)

  return _unlock({ publicClient, walletClient }, timelock, lockId, recipient)
}
