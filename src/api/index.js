import { createFetch } from "ofetch"
import { API_BASE } from "@/config"
import { clearAuth, getAccessToken } from "@/hooks/useAuth"

const service = createFetch({
  defaults: {
    baseURL: API_BASE,
    timeout: 10000,
    method: "POST",
    async onResponseError({ response }) {
      if (response.status === 401) {
        // Unauthorized
        clearAuth()
      }
    },
  },
})

/**
 * @param {import('axios').AxiosRequestConfig} config
 * @param {boolean} withToken
 * @returns {Promise<{code:number, data:Object, message:string}>}
 */
const fetch = (config, withToken = true) => {
  const _config = withToken ? {...config, headers: { ...config.headers, Authorization: `Bearer ${getAccessToken()}` } } : config
  const { url, data, headers, ...rest } = _config

  return service(url, {
    headers,
    body: data,
    ...rest,
  })
}

export const getPrices = () => {
  return fetch({
    url: "/g/prices",
  }, false)
}

/**
 * @param {{account:string, chainId:number, nonce:string, timestamp:number, expire:number, signature:string}} data
 */
export const login = data => {
  return fetch({
    url: "/s/login",
    data,
  }, false)
}

/**
 * @param {{refreshToken:string}} data
 */
export const refreshToken = data => {
  return fetch({
    url: "/s/refreshToken",
    data,
  }, false)
}

export const logout = () => {
  return fetch({
    url: "/s/logout",
  })
}

export const getUserProfile = () => {
  return fetch({
    url: "/u/profile",
  })
}

/**
 * @param {{nickname:string}} data
 */
export const updateUserInfo = data => {
  return fetch({
    url: "/u/update",
    data,
  })
}

/**
 * @param {{page:number, limit:number}} data
 */
export const getInvitedUsers = data => {
  return fetch({
    url: "/u/invited",
    data,
  })
}

/**
 * @param {{referral:string}} data
 */
export const getInviter = data => {
  return fetch({
    url: "/r/inviter",
    data,
  })
}

/**
 * @param {{referral:string}} data
 */
export const acceptInvite = data => {
  return fetch({
    url: "/r/accept",
    data,
  })
}
