import { watch } from "vue"
import { balanceOf } from "@/contracts/ERC6909"
import { getPublicClient } from "./useClient"
import { createCache } from "./useCache"
import { createDebounceUpdate } from "./useTimer"
import { getLiquidityAddress } from "./useManager"

const cache = createCache()

/**
 * @param {string} id
 * @returns {bigint}
 */
const getValue = id => {
  return cache.getValue(id, 0n)
}

/**
 * @param {string} account
 * @param {number} chainId
 * @param {string} id
 */
const updateValue = async (account, chainId, id) => {
  const publicClient = getPublicClient(chainId)
  const address = getLiquidityAddress(chainId)
  const balance = await balanceOf(publicClient, address, account, BigInt(id)).catch(() => 0n)
  cache.setValue(id, balance)
}

const reset = () => {
  cache.reset()
}

/**
 * @param {import('vue').Ref<string>} account
 * @param {import('vue').Ref<import('@/types').PoolMeta>} pool
 * @param {import('vue').Ref<bigint>} state
 */
export const createLiquidityState = (account, pool, state) => {
  state.value = 0n

  const doUpdate = async () => {
    if (!account.value || !pool.value) {
      state.value = 0n
      return
    }

    state.value = getValue(pool.value.id)
    await updateValue(account.value, pool.value.chainId, pool.value.id)
    state.value = getValue(pool.value.id)
  }

  const { debounceUpdate } = createDebounceUpdate(doUpdate)

  watch(account, () => {
    state.value = 0n

    debounceUpdate.cancel()
    account.value ? doUpdate() : reset()
  })

  watch(pool, doUpdate)

  return debounceUpdate
}
