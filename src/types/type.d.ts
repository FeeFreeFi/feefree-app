import { Type } from "@sinclair/typebox"
import type { Static } from "@sinclair/typebox"
import type { Tx } from "./common.d"

export const TToken = Type.Object({
  chainId: Type.Integer(),
  address: Type.String(),
  name: Type.String(),
  symbol: Type.String(),
  decimals: Type.Integer(),
  hot: Type.Optional(Type.Boolean()),
  dp: Type.Optional(Type.Integer()),
  key: Type.Optional(Type.String()),
  icon: Type.Optional(Type.String()),
})
export type Token = Static<typeof TToken>

export const TManager = Type.Object({
  chainId: Type.Integer(),
  address: Type.String(),
  pool: Type.String(),
  liquidity: Type.String(),
  hooks: Type.String(),
  timelock: Type.String(),
  quoter: Type.String(),
})
export type Manager = Static<typeof TManager>

export const TNft = Type.Object({
  chainId: Type.Integer(),
  address: Type.String(),
  name: Type.String(),
  symbol: Type.String(),
  label: Type.String(),
  price: Type.Number(),
  cap: Type.Number(),
  image: Type.String(),
})
export type Nft = Static<typeof TNft>

export const TNotice = Type.Object({
  id: Type.String(),
  content: Type.String(),
  date: Type.Date(),
})
export type Notice = Static<typeof TNotice>

export const TPoolInfo = Type.Object({
  chainId: Type.Integer(),
  id: Type.String(),
  currency0: Type.String(),
  currency1: Type.String(),
  hot: Type.Optional(Type.Boolean()),
})
export type PoolInfo = Static<typeof TPoolInfo>

export const TPrices = Type.Record(Type.String(), Type.Number())
export type Prices = Static<typeof TPrices>

export const TLoginData = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
})
export type LoginData = Static<typeof TLoginData>

export const TProfile = Type.Object({
  id: Type.String(),
  account: Type.String(),
  nickname: Type.String(),
  points: Type.Number(),
  level: Type.Number(),
  exp: Type.Number(),
  nextExp: Type.Number(),
  referral: Type.String(),
  inviter: Type.String(),
  fans: Type.Number(),
})
export type Profile = Static<typeof TProfile>

const TFans = Type.Object({
  id: Type.String(),
  account: Type.String(),
  nickname: Type.String(),
  level: Type.Integer(),
  acceptAt: Type.String(),
})
export type Fans = Static<typeof TFans>

export const TInviter = Type.Object({
  id: Type.String(),
  account: Type.String(),
  nickname:Type.String(),
  fans: Type.Number(),
})
export type Inviter = Static<typeof TInviter>

export const TReward = Type.Object({
  chainId: Type.Number(),
  address: Type.String(),
  amount: Type.Union([Type.BigInt(), Type.String()]),
  nonce: Type.String(),
  proof: Type.Array(Type.String()),
  root: Type.String(),
  deadline: Type.Number(),
  updatedAt: Type.String(),
})
export type Reward = Static<typeof TReward>

export const TPoints = Type.Object({
  value: Type.Number(),
  date: Type.String(),
  reason: Type.Integer(),
  meta: Type.Union([
    Type.Object({
      chainId: Type.Integer(),
      transactionHash: Type.String(),
    }),
    Type.Object({
      account: Type.String(),
    }),
    Type.Object({
      remark: Type.String(),
    }),
    Type.Object({
      account: Type.String(),
      chainId: Type.Integer(),
      transactionHash: Type.String(),
      reason: Type.Integer(),
    }),
  ]),
})
export type Points = Static<typeof TPoints>

export const TClaim = Type.Object({
  chainId: Type.Number(),
  transactionHash: Type.String(),
  amount: Type.Union([Type.BigInt(), Type.String()]),
  claimedAt: Type.Optional(Type.String()),
})
export type Claim = Static<typeof TClaim>
