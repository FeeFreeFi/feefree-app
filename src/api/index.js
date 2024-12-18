import { createFetch } from "ofetch"
import { decode } from "cbor-x/decode"
import { API_BASE } from "@/config"
import { clearAuth, getAccessToken, getRefreshToken } from "@/hooks/useAuth"
import { refreshToken as _refreshToken, login as _login } from "@/hooks/useLogin"

const ACCEPT = "application/x-buffer"

const service = createFetch({
  defaults: {
    baseURL: API_BASE,
    timeout: 10000,
    method: "POST",
    headers: { Accept: ACCEPT },
  },
})

/**
 * @param {{url:string, data?:unknown, headers?:unknown}} options
 * @param {boolean} withToken
 * @returns {Promise<import('@/types').GeneralResponse>}
 */
const fetch = async (options, withToken = true) => {
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
      options = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`
        }
      }
    }
  }

  const { url, data = {}, headers } = options

  let result = await service(url, {
    headers,
    body: data,
  }).catch(err => {
    console.error(err)
    return { code: -1, message: err.message || err }
  })

  if (result instanceof Blob && result.type === ACCEPT) {
    const buffer = await result.arrayBuffer()
    result = decode(new Uint8Array(buffer))
  }

  if (result.code === 401) {
    clearAuth()
    setTimeout(_login, 0)
  }

  return result
}

/**
 * @returns {Promise<import("@/types").PricesResponse>}
 */
export const getPrices = () => {
  return fetch({
    url: "/general/prices",
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
 * @returns {Promise<import("@/types").ManagersResponse>}
 */
export const getManagers = () => {
  return fetch({
    url: "/general/managers",
  }, false)
}

/**
 * @returns {Promise<import("@/types").TokensResponse>}
 */
export const getTokens = () => {
  return fetch({
    url: "/general/tokens",
  }, false)
}

/**
 * @returns {Promise<import("@/types").PoolsResponse>}
 */
export const getPools = () => {
  return fetch({
    url: "/general/pools",
  }, false)
}

/**
 * @returns {Promise<import("@/types").NftsResponse>}
 */
export const getNfts = () => {
  return fetch({
    url: "/general/nfts",
  }, false)
}

/**
 * @returns {Promise<import("@/types").NoticeResponse>}
 */
export const getNotice = () => {
  return fetch({
    url: "/general/notice",
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
  })
}

/**
 * @returns {Promise<import("@/types").ProfileResponse>}
 */
export const getProfile = () => {
  return fetch({
    url: "/user/profile",
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
