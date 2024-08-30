import { createFetch } from "ofetch"
import { API_BASE } from "@/config"
import { clearAuth, getAccessToken, getRefreshToken } from "@/hooks/useAuth"
import { refreshToken as _refreshToken, login as _login } from "@/hooks/useLogin"

const service = createFetch({
  defaults: {
    baseURL: API_BASE,
    timeout: 10000,
    method: "POST",
  },
})

/**
 * @param {import('axios').AxiosRequestConfig} config
 * @param {boolean} withToken
 * @returns {Promise<{code:number, data:any, message:string}>}
 */
const fetch = async (config, withToken = true) => {
  if (withToken) {
    if (!getAccessToken()) {
      if (getRefreshToken()) {
        await _refreshToken()
      } else {
        await _login()
      }
    }

    const accessToken = getAccessToken()
    if (accessToken) {
      config = {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`
        }
      }
    }
  }

  const { url, data, headers, ...rest } = config

  const res = await service(url, {
    headers,
    body: data,
    ...rest,
  }).catch(err => {
    console.error(err)
    return { code: -1, message: err.message || err }
  })

  if (res.code === 401) {
    clearAuth()
    setTimeout(_login, 0)
  }

  return res
}

/**
 * @param {{account:string, chainId:number, nonce:string, timestamp:number, expire:number, signature:string}} data
 * @returns {Promise<{code:number, message:string, data:{accessToken:string, refreshToken:string}}>}
 */
export const login = data => {
  return fetch({
    url: "/sys/login",
    data,
  }, false)
}

/**
 * @param {{refreshToken:string}} data
 * @returns {Promise<{code:number, message:string, data:{accessToken:string, refreshToken:string}}>}
 */
export const refreshToken = data => {
  return fetch({
    url: "/sys/refreshToken",
    data,
  }, false)
}

/**
 * @returns {Promise<{code:number, message:string}>}
 */
export const logout = () => {
  return fetch({
    url: "/sys/logout",
    data: {},
  })
}

/**
 * @returns {Promise<{code:number, message:string, data:{[name:string]:[price:number]}}>}
 */
export const getPrices = () => {
  return fetch({
    url: "/general/prices",
    data: {},
  }, false)
}

/**
 * @returns {Promise<{code:number, message:string, data:import('@/types').Profile}>}
 */
export const getUserProfile = () => {
  return fetch({
    url: "/user/profile",
    data: {},
  })
}

/**
 * @param {{nickname:string}} data
 * @returns {Promise<{code:number, message:string}>}
 */
export const updateUserInfo = data => {
  return fetch({
    url: "/user/update",
    data,
  })
}

/**
 * @param {{page:number, limit:number}} data
 * @returns {Promise<{code:number, message:string, data:{total:number, list:{id:string, account:string, nickname:string, acceptAt:string}[]}}>}
 */
export const getInvitedUsers = data => {
  return fetch({
    url: "/user/invited",
    data,
  })
}

/**
 * @param {{referral:string}} data
 * @returns {Promise<{code:number, message:string, data:{id:string, account:string, nickname:string}}>}
 */
export const getInviter = data => {
  return fetch({
    url: "/referral/inviter",
    data,
  })
}

/**
 * @param {{referral:string}} data
 * @returns {Promise<{code:number, message:string}>}
 */
export const acceptInvite = data => {
  return fetch({
    url: "/referral/accept",
    data,
  })
}

/**
 * @returns {Promise<{code:number, message:string, data:import('@/types').ClaimData[]}>}
 */
export const getClaims = () => {
  return fetch({
    url: "/claim/list",
    data: {},
  })
}

/**
 * @param {{page:number, limit:number}} data
 * @returns {Promise<{code:number, message:string, data:{total:number, list:{chainId:number, transactionHash:string, amount:string, claimedAt:string}[]}[]}>}
 */
export const getClaimHistory = data => {
  return fetch({
    url: "/claim/history",
    data,
  })
}
