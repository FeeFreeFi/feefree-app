import type { ClaimsResponse, FansResponse, GeneralResponse, InviterResponse, LoginResponse, ManagersResponse, NftsResponse, NoticeResponse, Pagination, PointsResponse, PoolsResponse, PricesResponse, ProfileResponse, RewardsResponse, SignatureData, TokensResponse } from '@/types'
import { createFetch } from 'ofetch'
import { decode } from 'cbor-x/decode'
import { API_BASE } from '@/config'
import { clearAuth, getAccessToken, getRefreshToken } from '@/hooks/useAuth'
import { refreshToken as _refreshToken, login as _login } from '@/hooks/useLogin'

const ACCEPT = 'application/x-buffer'

const service = createFetch({
  defaults: {
    baseURL: API_BASE,
    timeout: 10000,
    method: 'POST',
    headers: { Accept: ACCEPT },
  },
})

const fetch = async (options: { url: string, data?: object, headers?: object }, withToken = true) => {
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
          Authorization: `Bearer ${accessToken}`,
        },
      }
    }
  }

  const { url, data = {}, headers } = options

  let result = await service(url, {
    headers: { ...headers },
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

  return result as GeneralResponse
}

export const getPrices = () => {
  return fetch({
    url: '/general/prices',
  }, false) as Promise<PricesResponse>
}

export const getInviter = (data: { referral: string }) => {
  return fetch({
    url: '/general/inviter',
    data,
  }, false) as Promise<InviterResponse>
}

export const getManagers = () => {
  return fetch({
    url: '/general/managers',
  }, false) as Promise<ManagersResponse>
}

export const getTokens = () => {
  return fetch({
    url: '/general/tokens',
  }, false) as Promise<TokensResponse>
}

export const getPools = () => {
  return fetch({
    url: '/general/pools',
  }, false) as Promise<PoolsResponse>
}

export const getNfts = () => {
  return fetch({
    url: '/general/nfts',
  }, false) as Promise<NftsResponse>
}

export const getNotice = () => {
  return fetch({
    url: '/general/notice',
  }, false) as Promise<NoticeResponse>
}

export const login = (data: SignatureData) => {
  return fetch({
    url: '/sys/login',
    data,
  }, false) as Promise<LoginResponse>
}

export const refreshToken = (data: { refreshToken: string }) => {
  return fetch({
    url: '/sys/refresh',
    data,
  }, false) as Promise<LoginResponse>
}

export const logout = () => {
  return fetch({
    url: '/sys/logout',
  })
}

export const getProfile = () => {
  return fetch({
    url: '/user/profile',
  }) as Promise<ProfileResponse>
}

export const acceptInvite = (data: { referral: string }) => {
  return fetch({
    url: '/user/accept',
    data,
  })
}

export const updateProfile = (data: { nickname: string }) => {
  return fetch({
    url: '/user/update',
    data,
  })
}

export const getFans = (data: Pagination) => {
  return fetch({
    url: '/user/fans',
    data,
  }) as Promise<FansResponse>
}

export const getClaims = (data: Pagination) => {
  return fetch({
    url: '/user/claims',
    data,
  }) as Promise<ClaimsResponse>
}

export const getRewards = () => {
  return fetch({
    url: '/user/rewards',
  }) as Promise<RewardsResponse>
}

export const getPoints = (data: Pagination) => {
  return fetch({
    url: '/user/points',
    data,
  }) as Promise<PointsResponse>
}
