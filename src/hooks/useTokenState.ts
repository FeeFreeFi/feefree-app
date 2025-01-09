import type { Token } from "@/types"
import type { Ref } from "vue"
import { watch } from "vue"
import { balanceOf } from "./useToken"
import { createCache } from "./useCache"
import { createDebounceUpdate } from "./useTimer"
import pMap from "p-map"

const cache = createCache()

const getKey = (token: Token) => `${token.chainId}:${token.address}`

const getValue = (token: Token) => {
  return cache.getValue(getKey(token), 0n) as bigint
}

const getValues = (tokens: Token[]) => {
  return tokens.map(token => token ? getValue(token) : 0n)
}

const getMappedValues = (tokens: Token[]) => {
  return Object.fromEntries(tokens.map(token => [token.address, token ? getValue(token) : 0n]))
}

const updateValue = async (account: string, token: Token) => {
  const balance = await balanceOf(token, account)
  cache.setValue(getKey(token), balance)
}

const updateValues = async (account: string, tokens: Token[]) => {
  const values: Record<string, bigint> = {}
  await pMap(tokens.filter(Boolean), async token => {
    const balance = await balanceOf(token, account)
    values[getKey(token)] = balance
  }, { concurrency: 3 })

  cache.setValues(values)
}

const reset = () => {
  cache.reset()
}

export const createTokenState = (account: Ref<string>, token: Ref<Token>, state: Ref<bigint>) => {
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
    if (account.value) {
      doUpdate()
    } else {
      reset()
    }
  })

  watch(token, doUpdate)

  return debounceUpdate
}

export const createTokenStates = (account: Ref<string>, tokens: Ref<Token[]>, states: Ref<bigint[]>) => {
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
    if (account.value) {
      doUpdate()
    } else {
      reset()
    }
  })

  watch(tokens, doUpdate)

  return debounceUpdate
}

export const createTokenStatesForMap = (account: Ref<string>, tokens: Ref<Token[]>, states: Ref<Record<string, bigint>>) => {
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
    if (account.value) {
      doUpdate()
    } else {
      reset()
    }
  })

  watch(tokens, doUpdate, { deep: true })

  return debounceUpdate
}
