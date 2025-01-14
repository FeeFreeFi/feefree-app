import type { Ref } from 'vue'
import type { PoolData, PoolMeta } from '@/types'
import { createDebounceUpdate } from './useTimer'
import { getPoolData, getPoolDatas, updatePoolDatas } from './usePool'

export const createPoolState = (pool: Ref<PoolMeta | undefined>, state: Ref<PoolData>) => {
  state.value = getPoolData(pool.value)

  const doUpdate = async () => {
    state.value = getPoolData(pool.value)
    const items = [pool.value].filter(it => !!it)
    if (items.length === 0) {
      return
    }

    await updatePoolDatas(items)
    state.value = getPoolData(pool.value)
  }

  watch(pool, doUpdate)

  const { debounceUpdate } = createDebounceUpdate(doUpdate, 1000, 60000)

  return debounceUpdate
}

export const createPoolStates = (pools: Ref<PoolMeta[]>, states: Ref<Record<string, PoolData>>) => {
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
