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
 * @returns {Promise<{code:number, data:Object, message:string}>}
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
