import { watch } from "vue"
import { balanceOf } from "./useToken"
import { createCache } from "./useCache"
import { createDebounceUpdate } from "./useTimer"
import pMap from "p-map"

const cache = createCache()

/**
 * @param {import('@/types').Token} token
 */
const getKey = token => `${token.chainId}:${token.address}`

/**
 * @param {import('@/types').Token} token
 * @returns {bigint}
 */
const getValue = token => {
  return cache.getValue(getKey(token), 0n)
}

/**
 * @param {import('@/types').Token[]} tokens
 * @returns {bigint[]}
 */
const getValues = tokens => {
  return tokens.map(token => token ? cache.getValue(getKey(token), 0n) : 0n)
}

/**
 * @param {{[address:string]: import('@/types').Token}} tokens
 * @returns {{[address:string]: [balance:bigint]}}
 */
const getMappedValues = tokens => {
  return Object.fromEntries(Object.values(tokens).map(token => [token.address, token ? cache.getValue(getKey(token), 0n) : 0n]))
}

/**
 * @param {string} account
 * @param {import('@/types').Token} token
 */
const updateValue = async (account, token) => {
  const balance = await balanceOf(token, account)
  cache.setValue(getKey(token), balance)
}

/**
 * @param {string} account
 * @param {import('@/types').Token[]} tokens
 */
const updateValues = async (account, tokens) => {
  const values = {}
  await pMap(tokens.filter(Boolean), async token => {
    const balance = await balanceOf(token, account)
    values[getKey(token)] = balance
  }, { concurrency: 3 })

  cache.setValues(values)
}

const reset = () => {
  cache.reset()
}

/**
 * @param {import('vue').Ref<string>} account
 * @param {import('vue').Ref<import('@/types').Token>} token
 * @param {import('vue').Ref<bigint>} state
 */
export const createTokenState = (account, token, state) => {
  state.value = 0n

  const doUpdate = async () => {
    if (!account.value || !token.value) {
      state.value = 0n
      return
    }

    const _token = token.value
    state.value = getValue(_token)
    await updateValue(account.value, _token)
    state.value = getValue(_token)
  }

  const { debounceUpdate } = createDebounceUpdate(doUpdate)

  watch(account, () => {
    state.value = 0n

    debounceUpdate.cancel()
    account.value ? doUpdate() : reset()
  })

  watch(token, doUpdate)

  return debounceUpdate
}

/**
 * @param {import('vue').Ref<string>} account
 * @param {import('vue').Ref<import('@/types').Token[]>} tokens
 * @param {import('vue').Ref<bigint[]>} states
 */
export const createTokenStates = (account, tokens, states) => {
  const getDefaults = () => tokens.value.map(() => 0n)

  states.value = getDefaults()

  const doUpdate = async () => {
    if (!account.value) {
      states.value = getDefaults()
      return
    }

    const _tokens = tokens.value
    states.value = getValues(_tokens)
    await updateValues(account.value, _tokens)
    states.value = getValues(_tokens)
  }

  const { debounceUpdate } = createDebounceUpdate(doUpdate)

  watch(account, () => {
    states.value = getDefaults()

    debounceUpdate.cancel()
    account.value ? doUpdate() : reset()
  })

  watch(tokens, doUpdate)

  return debounceUpdate
}

/**
 * @param {import('vue').Ref<string>} account
 * @param {import('vue').Ref<import('@/types').Token[]>} tokens
 * @param {import('vue').Ref<{[address:string]: [balance:bigint]}>} states
 */
export const createTokenStatesForMap = (account, tokens, states) => {
  const getDefaults = () => Object.fromEntries(Object.keys(tokens.value).map(address => [address, 0n]))

  states.value = getDefaults()

  const doUpdate = async () => {
    if (!account.value) {
      states.value = getDefaults()
      return
    }

    const _tokens = tokens.value
    states.value = getMappedValues(_tokens)
    await updateValues(account.value, _tokens)
    states.value = getMappedValues(_tokens)
  }

  const { debounceUpdate } = createDebounceUpdate(doUpdate)

  watch(account, () => {
    states.value = getDefaults()

    debounceUpdate.cancel()
    account.value ? doUpdate() : reset()
  })

  watch(tokens, doUpdate, { deep: true })

  return debounceUpdate
}
