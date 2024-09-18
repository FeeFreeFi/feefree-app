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
 * @returns {Promise<import('@/types').GenericsResponse>}
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
 * @returns {Promise<import("@/types").PricesResponse>}
 */
export const getPrices = () => {
  return fetch({
    url: "/general/prices",
    data: {},
  }, false)
}

/**
 * @param {{referral:string}} data
 * @returns {Promise<import("@/types").InviterResponse>}
 */
export const getInviter = data => {
  return fetch({
    url: "/general/inviter",
    data,
  }, false)
}

/**
 * @param {import("@/types").SignatureData} data
 * @returns {Promise<import("@/types").LoginResponse>}
 */
export const login = data => {
  return fetch({
    url: "/sys/login",
    data,
  }, false)
}

/**
 * @param {{refreshToken:string}} data
 * @returns {Promise<import("@/types").LoginResponse>}
 */
export const refreshToken = data => {
  return fetch({
    url: "/sys/refresh",
    data,
  }, false)
}

/**
 * @returns {Promise<import("@/types").GeneralResponse>}
 */
export const logout = () => {
  return fetch({
    url: "/sys/logout",
    data: {},
  })
}

/**
 * @returns {Promise<import("@/types").ProfileResponse>}
 */
export const getProfile = () => {
  return fetch({
    url: "/user/profile",
    data: {},
  })
}

/**
 * @param {{referral:string}} data
 * @returns {Promise<import("@/types").GeneralResponse>}
 */
export const acceptInvite = data => {
  return fetch({
    url: "/user/accept",
    data,
  })
}

/**
 * @param {{nickname:string}} data
 * @returns {Promise<import("@/types").GeneralResponse>}
 */
export const updateProfile = data => {
  return fetch({
    url: "/user/update",
    data,
  })
}

/**
 * @param {{page:number, limit:number}} data
 * @returns {Promise<import('@/types').FansResponse>}
 */
export const getFans = data => {
  return fetch({
    url: "/user/fans",
    data,
  })
}

/**
 * @param {{page:number, limit:number}} data
 * @returns {Promise<import("@/types").ClaimsResponse>}
 */
export const getClaims = data => {
  return fetch({
    url: "/user/claims",
    data,
  })
}

/**
 * @returns {Promise<import("@/types").RewardsResponse>}
 */
export const getRewards = () => {
  return fetch({
    url: "/user/rewards",
    data: {},
  })
}

/**
 * @param {{page:number, limit:number}} data
 * @returns {Promise<import("@/types").PointsResponse>}
 */
export const getPoints = data => {
  return fetch({
    url: "/user/points",
    data,
  })
}
