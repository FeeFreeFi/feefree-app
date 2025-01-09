import { ref } from "vue"

export const createCache = () => {
  const data = ref<Record<string, unknown>>({})

  const getValue = (key: string, defaultValue: unknown = undefined) => {
    const value = data.value[key]
    return value !== undefined ? value : defaultValue
  }

  const getValues = (keys: string[], defaultValue: unknown = undefined) => {
    return keys.map(key => getValue(key, defaultValue))
  }

  const setValue = (key: string, value: unknown) => {
    data.value[key] = value
  }

  const setValues = (items: Record<string, unknown>) => {
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
