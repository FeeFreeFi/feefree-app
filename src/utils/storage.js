import store from "store2"

export const getStorage = (key, defaultValue = undefined) => {
  try {
    return store.get(key, defaultValue)
  } catch(err) {
    console.log(err)
    return defaultValue
  }
}

export const setStorage = (key, value) => {
  try {
    store.set(key, value)
  } catch(err) {
    console.log(err)
  }
}
