import store from "store2"

export const getStorage = (key: string, defaultValue: unknown = undefined) => {
  try {
    return store.get(key, defaultValue)
  } catch(err) {
    console.log(err)
    return defaultValue
  }
}

export const setStorage = (key: string, value: unknown) => {
  try {
    store.set(key, value)
  } catch(err) {
    console.log(err)
  }
}

export const removeStorage = (key: string) => {
  try {
    store.remove(key)
  } catch(err) {
    console.log(err)
  }
}
