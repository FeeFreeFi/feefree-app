import { watch } from "vue"
import { createDebounceUpdate } from "./useTimer"
import { getPoolData, getPoolDatas, updatePoolDatas } from "./usePool"

/**
 * @param {import('vue').Ref<import('@/types').PoolMeta>} pool
 * @param {import('vue').Ref<import('@/types').PoolData>} state
 */
export const createPoolState = (pool, state) => {
  state.value = getPoolData(pool.value)

  const doUpdate = async () => {
    state.value = getPoolData(pool.value)
    const items = [pool.value].filter(Boolean)
    if (items.length === 0) {
      return
    }

    await updatePoolDatas(items)
    state.value = getPoolData(pool.value)
  }

  watch(pool, doUpdate)

  const { debounceUpdate } =  createDebounceUpdate(doUpdate, 1000, 60000)

  return debounceUpdate
}

/**
 * @param {import('vue').Ref<import('@/types').PoolMeta[]>} pools
 * @param {import('vue').Ref<{[id:string]: import('@/types').PoolData}>} states
 */
export const createPoolStates = (pools, states) => {
  states.value = getPoolDatas(pools.value)

  const doUpdate = async () => {
    states.value = getPoolDatas(pools.value)
    const items = pools.value.filter(Boolean)
    if (items.length === 0) {
      return
    }

    await updatePoolDatas(items)
    states.value = getPoolDatas(pools.value)
  }

  watch(pools, doUpdate)

  return createDebounceUpdate(doUpdate, 1000, 60000)
}

