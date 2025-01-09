import type { Auth } from "@/types"
import { readonly, ref } from "vue"
import { decodeJwt } from "jose"
import { CACHE_AUTH, JWT_ISSUER } from "@/config"
import { getStorage, removeStorage, setStorage, getStamp, isExpired, isSelfAccount } from "@/utils"

type AuthMeta = {
  accessToken: string;
  refreshToken: string;
}

type AuthJwt = {
  valid: boolean;
  exp?: number;
  id?: string;
}

const parseJwt = (token: string) => {
  try {
    const payload = decodeJwt(token)

    return {
      valid: payload.iss === JWT_ISSUER,
      exp: payload.exp,
      id: payload.id as string,
    } as AuthJwt
  } catch {
    return { valid: false } as AuthJwt
  }
}

const authRef = ref<Auth>()
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

const doLoadAuth = () => {
  const cache = getStorage(CACHE_AUTH)
  if (!cache) {
    return
  }

  const auth = parseAuth(cache as AuthMeta)
  if (!auth) {
    removeStorage(CACHE_AUTH)
    return
  }

  return auth
}

const parseAuth = (authMeta: AuthMeta) => {
  const { accessToken, refreshToken } = authMeta
  const res1 = parseJwt(accessToken)
  const res2 = parseJwt(refreshToken)

  const now = getStamp()
  if (!res1.valid || !res2.valid || res1.id !== res2.id) {
    return
  }

  const expired1 = res1.valid ? res1.exp! <= now : false
  const expired2 = res2.valid ? res2.exp! <= now : false
  if (expired1 && expired2) {
    return
  }

  return {
    accessToken: expired1 ? undefined : { value: accessToken, exp: res1.exp! },
    refreshToken: expired2 ? undefined : { value: refreshToken, exp: res2.exp! },
    id: res1.id,
  } as Auth
}

export const loadAuth = () => {
  authRef.value = doLoadAuth()
}

export const setAuth = (authMeta: AuthMeta) => {
  const auth = parseAuth(authMeta)
  if (auth) {
    authRef.value = auth
    const { accessToken, refreshToken } = authMeta
    setStorage(CACHE_AUTH, { accessToken, refreshToken })
  }
}

export const clearAuth = () => {
  authRef.value = undefined
  removeStorage(CACHE_AUTH)
}

export const isMatchAccount = (account: string) => {
  return authRef.value ? isSelfAccount(account, authRef.value.id) : false
}
