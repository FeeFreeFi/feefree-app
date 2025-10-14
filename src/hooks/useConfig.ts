import { getManagers, getPools, getTokens } from '@/api'
import { addTokens, loadCachedTokens } from './useToken'
import { addManagers } from './useManager'
import { addPools } from './usePool'
import { fetchFees } from './useFee'

let fetchConfigPromise: Promise<void>

async function fetchManagers() {
  const res = await getManagers()
  if (!res || res.code !== 0) {
    console.log(res.message)
    return
  }

  addManagers(res.data)
}

async function fetchTokens() {
  const res = await getTokens()
  if (!res || res.code !== 0) {
    console.log(res.message)
    return
  }

  addTokens(res.data.map(it => ({ ...it, hot: true })))
}

async function fetchPools() {
  const res = await getPools()
  if (!res || res.code !== 0) {
    console.log(res.message)
    return
  }

  addPools(res.data)
}

export function fetchConfig() {
  if (!fetchConfigPromise) {
    fetchConfigPromise = Promise.all([
      fetchManagers().then(fetchFees),
      fetchTokens().then(loadCachedTokens),
    ]).then(fetchPools)
  }

  return fetchConfigPromise
}

export async function configReady() {
  await fetchConfigPromise
}
