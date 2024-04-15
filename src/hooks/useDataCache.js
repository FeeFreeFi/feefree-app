import { ref } from "vue"

 /**
  * @param {import('vue').Ref} state
  * @param {string} name
  * @param {string} key
  */
const getValue = (state, name, key, defaultValue = undefined) => {
  const cache = state.value[name] || {}
  return cache[key] || defaultValue
}

/**
 * @param {import('vue').Ref} state
 * @param {string} name
 * @param {string[]} keys
 */
const getValues = (state, name, keys, defaultValue = undefined) => {
  const cache = state.value[name] || {}
  return keys.map(key => cache[key] || defaultValue)
}

/**
 * @param {import('vue').Ref} state
 * @param {string} name
 * @param {{[key:string]: any}} values
 */
const setValues = (state, name, values) => {
  const cache = state.value[name] || {}
  state.value = {
    ...state.value,
    [name]: {
      ...cache,
      ...values,
    }
  }
}

/**
 * @param {import('vue').Ref} state
 */
const reset = state => {
  state.value = {}
}

export const createCache = () => {
  const state = ref({})

  return {
    /**
     * @param {string} name
     * @param {string} key
     * @param {*} defaultValue
     */
    getValue: (name, key, defaultValue = undefined) => getValue(state, name, key, defaultValue),
    /**
     * @param {string} name
     * @param {string[]} keys
     * @param {*} defaultValue
     */
    getValues: (name, keys, defaultValue = undefined) => getValues(state, name, keys, defaultValue),
    /**
     * @param {string} name
     * @param {[key:string]: any} values
     */
    setValues: (name, values) => setValues(state, name, values),
    reset: () => reset(state),
  }
}
