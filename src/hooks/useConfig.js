import { getManagers, getPools, getTokens } from "@/api"
import { addTokens, loadCachedTokens } from "./useToken"
import { addManagers } from "./useManager"
import { addPools } from "./usePool"
import { fetchFees } from "./useFee"

/** @type {Promise<void>} */
let fetchConfigPromise

const fetchManagers = async () => {
  const res = await getManagers()
  if (!res || res.code !== 0) {
    console.log(res.message)
    return
  }

  addManagers(res.data)
}

const fetchTokens = async () => {
  const res = await getTokens()
  if (!res || res.code !== 0) {
    console.log(res.message)
    return
  }

  addTokens(res.data.map(it => ({ ...it, hot: true })))
}

const fetchPools = async () => {
  const res = await getPools()
  if (!res || res.code !== 0) {
    console.log(res.message)
    return
  }

  addPools(res.data)
}

export const fetchConfig = () => {
  if (!fetchConfigPromise) {
    fetchConfigPromise = Promise.all([
      fetchManagers().then(fetchFees),
      fetchTokens().then(loadCachedTokens),
    ]).then(fetchPools)
  }

  return fetchConfigPromise
}

export const configReady = async () => {
  await fetchConfigPromise
}
