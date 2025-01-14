import type { Ref } from 'vue'
import type { PoolMeta } from '@/types'
import { balanceOf } from '@/contracts/ERC6909'
import { getPublicClient } from './useClient'
import { createCache } from './useCache'
import { createDebounceUpdate } from './useTimer'
import { getLiquidityAddress } from './useManager'

const cache = createCache()

const getValue = (id: string) => {
  return cache.getValue(id, 0n) as bigint
}

const updateValue = async (account: string, chainId: number, id: string) => {
  const publicClient = getPublicClient(chainId)
  const address = getLiquidityAddress(chainId)
  const balance = await balanceOf(publicClient, address, account, BigInt(id)).catch(() => 0n)
  cache.setValue(id, balance)
}

const reset = () => {
  cache.reset()
}

export const createLiquidityState = (account: Ref<string>, pool: Ref<PoolMeta | undefined>, state: Ref<bigint>) => {
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
    if (account.value) {
      doUpdate()
    } else {
      reset()
    }
  })

  watch(pool, doUpdate)

  return debounceUpdate
}
