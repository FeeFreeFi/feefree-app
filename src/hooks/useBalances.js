import pMap from "p-map"
import debounce from "lodash-es/debounce"
import { ref, readonly, watch, onMounted, onBeforeUnmount } from "vue"
import { getPublicClient } from "./useClient"
import { balanceOf } from "./useCurrency"
import { createCache } from "./useDataCache"
import { createInterval } from "./useTimer"

const cache = createCache()

/**
 * @param {{chainId:number, address:string}} token
 */
const getTokenKey = token => `${token.chainId}:${token.address}`

/**
 * @param {string} account
 * @param {{chainId:number, address:string}} token
 * @returns {bigint}
 */
export const getBalance = (account, token) => {
  return cache.getValue(account, getTokenKey(token), 0n)
}

/**
 * @param {number} chainId
 * @param {string} account
 * @param {{chainId:number, address:string}[]} tokens
 * @returns {bigint[]}
 */
export const getBalances = (account, tokens) => {
  const keys = tokens.map(token => getTokenKey(token))
  return cache.getValues(account, keys, 0n)
}

/**
 * @param {string} account
 * @param {{chainId:number, address:string}[]} tokens
 */
export const updateBalances = async (account, tokens) => {
  const items = await pMap(tokens, async token => {
    const balance = await balanceOf(getPublicClient(token.chainId), token.address, account).catch(() => 0n)
    const key = getTokenKey(token)
    return [key, balance]
  }, { concurrency: 3 })

  const balances = Object.fromEntries(items)
  cache.setValues(account, balances)
}

export const resetBalances = () => {
  cache.reset()
}

/**
 * @param {import('vue').Ref<string>} account
 * @param {{chainId:number, address:string, symbol:string}[]} tokens
 */
export const createBalanceStates = (account, tokens) => {
  const states = ref(tokens.map(() => 0n))

  const doUpdate = async () => {
    if (!account.value) {
      return
    }

    // console.log(`update token balances: ${tokens.map(it => it.symbol).join(",")}`)
    states.value = getBalances(account.value, tokens)
    await updateBalances(account.value, tokens)
    states.value = getBalances(account.value, tokens)
  }
  const debounceUpdate = debounce(doUpdate, 100, { leading: false, trailing: true })
  const { start: startUpdate, stop: stopUpdate } = createInterval(debounceUpdate, 60 * 1000)

  const update = (force = false) => {
    force ? doUpdate() : debounceUpdate()
  }

  onMounted(() => {
    debounceUpdate()

    onBeforeUnmount(() => {
      debounceUpdate.cancel()
    })
  })

  onMounted(() => {
    const stopWatch = watch(account, () => {
      states.value = tokens.map(() => 0n)

      debounceUpdate.cancel()
      if (account.value) {
        doUpdate()
      } else {
        resetBalances()
      }
    })

    onBeforeUnmount(stopWatch)
  })

  return {
    states: readonly(states),
    update,
    startUpdate,
    stopUpdate,
  }
}

/**
 * @param {import('vue').Ref<string>} account
 * @param {import('vue').ComputedRef<{chainId:number, address:string, symbol:string}[]>} tokens
 */
export const createBalanceStates2 = (account, tokens) => {
  const initState = tokens.value.map(() => 0n)
  const states = ref([...initState])

  const doUpdate = async () => {
    if (!account.value) {
      return
    }

    const list = [...tokens.value]
    const owner = account.value
    const getValues = () => list.map(token => token ? getBalance(owner, token) : 0n)

    states.value = getValues()
    await updateBalances(owner, list.filter(Boolean))
    states.value = getValues()
  }
  const debounceUpdate = debounce(doUpdate, 100, { leading: false, trailing: true })
  const { start: startUpdate, stop: stopUpdate } = createInterval(debounceUpdate, 60 * 1000)

  const update = (force = false) => {
    force ? doUpdate() : debounceUpdate()
  }

  onMounted(() => {
    debounceUpdate()

    onBeforeUnmount(() => {
      debounceUpdate.cancel()
    })
  })

  onMounted(() => {
    const stopWatch = watch(account, () => {
      states.value = [...initState]

      debounceUpdate.cancel()
      if (account.value) {
        doUpdate()
      } else {
        resetBalances()
      }
    })

    onBeforeUnmount(stopWatch)
  })

  return {
    states: readonly(states),
    update,
    startUpdate,
    stopUpdate,
  }
}
