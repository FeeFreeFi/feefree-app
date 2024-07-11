import store from "store2"

/**
 * @param {string} key
 * @param {any} defaultValue
 */
export const getStorage = (key, defaultValue = undefined) => {
  try {
    return store.get(key, defaultValue)
  } catch(err) {
    console.log(err)
    return defaultValue
  }
}

/**
 * @param {string} key
 * @param {any} value
 */
export const setStorage = (key, value) => {
  try {
    store.set(key, value)
  } catch(err) {
    console.log(err)
  }
}

/**
 * @param {string} key
 */
export const removeStorage = key => {
  try {
    store.remove(key)
  } catch(err) {
    console.log(err)
  }
}
