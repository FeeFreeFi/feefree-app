import { Type } from "@sinclair/typebox"
import type { Static, TSchema } from "@sinclair/typebox"
import {
  TPrices,
  TLoginData,
  TInviter,
  TManager,
  TToken,
  TNft,
  TNotice,
  TPoolInfo,
  TProfile,
  TReward,
  TFans,
  TClaim,
  TPoints,
} from './type.d'

const TGeneralResponse = Type.Object({
  code: Type.Integer(),
  message: Type.String(),
})
const TGenericsResponse = <T extends TSchema>(data: T) => Type.Composite([
  TGeneralResponse,
  Type.Object({
    data,
  })
])

const TGenericsOptionalResponse = <T extends TSchema>(data: T) => TGenericsResponse(Type.Optional(data))
const TPageableResponse = <T extends TSchema>(data: T) => TGenericsOptionalResponse(Type.Object({
  total: Type.Number(),
  list: Type.Array(data),
}))

export type GeneralResponse = Static<typeof TGeneralResponse>

const TPricesResponse = TGenericsResponse<typeof TPrices>()
export type PricesResponse = Static<typeof TPricesResponse>

const TLoginResponse = TGenericsOptionalResponse<typeof TLoginData>()
export type LoginResponse = Static<typeof TLoginResponse>

const TInviterResponse = TGenericsOptionalResponse<typeof TInviter>()
export type InviterResponse = Static<typeof TInviterResponse>

const TManagerList = Type.Array(TManager)
const TManagersResponse = TGenericsResponse<typeof TManagerList>()
export type ManagersResponse = Static<typeof TManagersResponse>

const TTokenList = Type.Array(TToken)
const TTokensResponse = TGenericsResponse<typeof TTokenList>()
export type TokensResponse = Static<typeof TTokensResponse>

const TPoolList = Type.Array(TPoolInfo)
const TPoolsResponse = TGenericsResponse<typeof TPoolList>()
export type PoolsResponse = Static<typeof TPoolsResponse>

const TNftList = Type.Array(TNft)
const TNftsResponse = TGenericsResponse<typeof TNftList>()
export type NftsResponse = Static<typeof TNftsResponse>

const TNoticeResponse = TGenericsResponse<typeof TNotice>()
export type NoticeResponse = Static<typeof TNoticeResponse>

const TProfileResponse = TGenericsOptionalResponse<typeof TProfile>()
export type ProfileResponse = Static<typeof TProfileResponse>

const TRewards = Type.Object({
  current: Type.Union([Type.BigInt(), Type.String()]),
  claimed: Type.Union([Type.BigInt(), Type.String()]),
  available: Type.Union([Type.BigInt(), Type.String()]),
  list: Type.Array(TReward),
})
const TRewardsResponse = TGenericsOptionalResponse<typeof TRewards>()
export type RewardsResponse = Static<typeof TRewardsResponse>

const TFansList = Type.Array(TFans)
const TFansResponse = TGenericsOptionalResponse<typeof TFansList>()
export type FansResponse = Static<typeof TFansResponse>

const TClaimsResponse = TPageableResponse<typeof TClaim>()
export type ClaimsResponse = Static<typeof TClaimsResponse>

const TPointsResponse = TPageableResponse<typeof TPoints>()
export type PointsResponse = Static<typeof TPointsResponse>
