import { readonly, ref } from "vue"
import { decodeJwt } from "jose"
import { CACHE_AUTH, JWT_ISSUER } from "@/config"
import { getStorage, removeStorage, setStorage } from "@/utils/storage"
import { getStamp, isExpired } from "@/utils/date"
import { isSelfAccount } from "@/utils/accountHash"

/**
 *
 * @param {string} token
 * @returns {{valid:boolean, exp?:number, id?:string}}
 */
const parseJwt = token => {
  try {
    const payload = decodeJwt(token)

    return {
      valid: payload.iss === JWT_ISSUER,
      exp: payload.exp,
      id: payload.id,
    }
  } catch {
    return { valid: false }
  }
}

/**
 * @type {import('vue').Ref<import('@/types').Auth>}
 */
const authRef = ref(null)
export const auth = readonly(authRef)

export const getAccessToken = () => {
  if (!authRef.value) {
    return ""
  }

  const { accessToken } = authRef.value
  return !accessToken || isExpired(accessToken.exp) ? "" : accessToken.value
}
export const getRefreshToken = () => {
  if (!authRef.value) {
    return ""
  }

  const { refreshToken } = authRef.value
  return !refreshToken || isExpired(refreshToken.exp) ? "" : refreshToken.value
}

/**
 * @returns {import('@/types').Auth}
 */
const doLoadAuth = () => {
  const cache = getStorage(CACHE_AUTH, null)
  if (!cache) {
    return null
  }

  const { accessToken, refreshToken } = cache
  const auth = parseAuth(accessToken, refreshToken)
  if (!auth) {
    removeStorage(CACHE_AUTH)
  }

  return auth
}

/**
 * @param {string} accessToken
 * @param {string} refreshToken
 * @returns {import('@/types').Auth}
 */
const parseAuth = (accessToken, refreshToken) => {
  const res1 = parseJwt(accessToken)
  const res2 = parseJwt(refreshToken)

  const now = getStamp()
  const expired1 = res1.exp <= now
  const expired2 = res2.exp <= now
  if (!res1.valid || !res2.valid || res1.id !== res2.id || (expired1 && expired2)) {
    return null
  }

  return {
    accessToken: expired1 ? null : { value: accessToken, exp: res1.exp },
    refreshToken: expired2 ? null : { value: refreshToken, exp: res2.exp },
    id: res1.id,
  }
}

export const loadAuth = () => {
  authRef.value = doLoadAuth()
}

/**
 * @param {{accessToken:string, refreshToken:string}} auth
 */
export const setAuth = ({ accessToken, refreshToken }) => {
  authRef.value = parseAuth(accessToken, refreshToken)

  setStorage(CACHE_AUTH, { accessToken, refreshToken })
}

export const clearAuth = () => {
  authRef.value = null
  removeStorage(CACHE_AUTH)
}

export const isMatchAccount = account => {
  return authRef.value && isSelfAccount(account, authRef.value.id)
}
