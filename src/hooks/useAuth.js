import { readonly, ref } from "vue"
import { decodeJwt } from "jose"
import { CACHE_AUTH, JWT_ISSUER } from "@/config"
import { getStorage, removeStorage, setStorage } from "@/utils/storage"
import { getStamp } from "@/utils/date"
import { isSelfAccount } from "@/utils/accountHash"

/**
 *
 * @param {string} token
 * @returns {{valid:boolean, expired?:boolean, id?:string}}
 */
const checkJwt = token => {
  try {
    const payload = decodeJwt(token)
    const now = getStamp()
    return {
      expired: payload.exp <= now,
      valid: payload.iss === JWT_ISSUER,
      id: payload.id,
    }
  } catch {
    return { valid: false }
  }
}

/**
 * @type {import('vue').Ref<{accessToken:string, refreshToken:string, id:string}>}
 */
const authRef = ref(null)
export const auth = readonly(authRef)

export const getAccessToken = () => authRef.value?.accessToken
export const getRefreshToken = () => authRef.value?.refreshToken

const doLoadAuth = () => {
  const auth = getStorage(CACHE_AUTH, null)
  if (!auth) {
    return null
  }

  const { accessToken, refreshToken } = auth
  const res1 = checkJwt(accessToken)
  const res2 = checkJwt(refreshToken)

  if (!res1.valid || !res2.valid || res1.id !== res2.id || (res1.expired && res2.expired)) {
    removeStorage(CACHE_AUTH)
    return null
  }

  return {
    accessToken: res1.expired ? '' : accessToken,
    refreshToken: res2.expired ? '' : refreshToken,
    id: res1.id,
  }
}

export const loadAuth = () => {
  authRef.value = doLoadAuth()
}

/**
 * @param {{accessToken:string, refreshToken:string}}
*/
export const setAuth = ({ accessToken, refreshToken }) => {
  authRef.value = { accessToken, refreshToken }

  setStorage(CACHE_AUTH, { accessToken, refreshToken })
}

export const clearAuth = () => {
  authRef.value = null
  removeStorage(CACHE_AUTH)
}

export const isMatchAccount = account => {
  return authRef.value && isSelfAccount(account, authRef.value.id)
}
