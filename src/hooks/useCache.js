import { ref } from "vue"

export const createCache = () => {
  const data = ref({})

  /**
   * @param {string} key
   * @param {any} defaultValue
   */
  const getValue = (key, defaultValue = undefined) => {
    const value = data.value[key]
    return value !== undefined ? value : defaultValue
  }

  /**
   * @param {string[]} keys
   * @param {any} defaultValue
   */
  const getValues = (keys, defaultValue = undefined) => {
    return keys.map(key => getValue(key, defaultValue))
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  const setValue = (key, value) => {
    data.value[key] = value
  }

  /**
   * @param {{[key:string]: [value:any]}} items
   */
  const setValues = items => {
    data.value = { ...data.value, ...items }
  }

  const reset = () => {
    data.value = {}
  }

  return {
    getValue,
    getValues,
    setValue,
    setValues,
    reset,
  }
}
