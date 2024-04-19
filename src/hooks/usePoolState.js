import { ref, onMounted, onBeforeUnmount, readonly, watch } from "vue"
import debounce from "lodash-es/debounce"
import { getPoolState, getPoolStates, updatePoolState, updatePoolStates } from "./useSwap"
import { createInterval } from "./useTimer"

/**
 * @param {string} id
 */
export const createPoolState = id => {
  const state = ref(getPoolState(id))

  const doUpdate = async () => {
    // console.log(`update pool state: ${id}`)
    state.value = getPoolState(id)
    await updatePoolState(id)
    state.value = getPoolState(id)
  }
  const debounceUpdate = debounce(doUpdate, 100, { leading: false, trailing: true })
  const { start: startUpdate, stop: stopUpdate } = createInterval(debounceUpdate, 60 * 1000)

  const update = (force = false) => {
    force ? doUpdate() : debounceUpdate()
  }

  onMounted(() => {
    startUpdate()

    onBeforeUnmount(stopUpdate)
  })

  return {
    state: readonly(state),
    update,
    startUpdate,
    stopUpdate,
  }
}

/**
 * @param {import('vue').Ref<string[]>} ids
 */
export const createPoolStates = ids => {
  const states = ref(getPoolStates(ids.value))

  const doUpdate = async () => {
    const poolIds = ids.value
    // console.log(`update pool states`)
    states.value = getPoolStates(poolIds)
    await updatePoolStates(poolIds)
    states.value = getPoolStates(poolIds)
  }
  const debounceUpdate = debounce(doUpdate, 100, { leading: false, trailing: true })
  const { start: startUpdate, stop: stopUpdate } = createInterval(debounceUpdate, 60 * 1000)

  const update = (force = false) => {
    force ? doUpdate() : debounceUpdate()
  }

  onMounted(() => {
    startUpdate()

    onBeforeUnmount(stopUpdate)
  })

  onMounted(() => {
    const stopWatch = watch(ids, () => {
      states.value = getPoolStates(ids.value)
      debounceUpdate.cancel()
      debounceUpdate()
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
