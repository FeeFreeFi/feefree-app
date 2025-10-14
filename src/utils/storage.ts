import store from 'store2'

export function getStorage(key: string, defaultValue: unknown = undefined) {
  try {
    return store.get(key, defaultValue)
  }
  catch (err) {
    console.log(err)
    return defaultValue
  }
}

export function setStorage(key: string, value: unknown) {
  try {
    store.set(key, value)
  }
  catch (err) {
    console.log(err)
  }
}

export function removeStorage(key: string) {
  try {
    store.remove(key)
  }
  catch (err) {
    console.log(err)
  }
}
