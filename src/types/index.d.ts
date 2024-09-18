import { Type } from "@sinclair/typebox"
import type { Static, TSchema } from "@sinclair/typebox"

export type Token = {
  chainId: number;
  address: string;
  symbol: string;
  decimals: number;
  dp: number;
  key: string;
}

export type Pool = {
  chainId: number;
  name: string;
  currency0: Token;
  currency1: Token;
  currencyLiquidity: Token;
  id: string;
}

export type PoolState = {
  sqrtPriceX96: bigint;
  liquidity: bigint;
  balance0: bigint;
  balance1: bigint;
  tvl: bigint;
  price0: number;
  price1: number;
  percent0: string;
  percent1: string;
}

export type Nft = {
  chainId: number;
  label: string;
  address: string;
  name: string;
  symbol: string;
  price: bigint;
  free: boolean,
  image: string;
  cap: bigint;
  capLabel: string;
}

export type Tx = {
  chainId: number;
  hash: string;
  explorerUrl: string;
}

export interface ModalAction {
  show: boolean;
  state: 'initial' | 'pending' | 'success' | 'fail';
  title: string;
  data: object;
  tx: Tx;
  error: string;
}

export interface ApprovalAction extends ModalAction {
  data: {
    token: Token;
    amount: bigint;
  }
}

export interface SwapAction extends ModalAction {
  data: {
    inputToken: Token;
    outputToken: Token;
    amountIn: bigint;
    amountOut: bigint;
    fee: bigint;
  }
}

export interface ExchangeAction extends ModalAction {
  data: {
    inputToken: Token;
    outputToken: Token;
    amountIn: bigint;
    amountOut: bigint;
    fee: bigint;
  }
}

export interface DepositAction extends ModalAction {
  data: {
    currency0: Token;
    currency1: Token;
    amount0: bigint;
    amount1: bigint;
  }
}

export interface WithdrawAction extends ModalAction {
  data: {
    currency0: Token;
    currency1: Token;
    amount0: bigint;
    amount1: bigint;
    liquidity: bigint;
  }
}

export interface MintAction extends ModalAction {
  data: {
    nft: Nft,
  }
}

export interface ClaimAction extends ModalAction {
  data: {
    chainId: number;
    amount: bigint;
    nonce: string;
    proof: string[];
    root: string;
  }
}

export type SwapQuoteData = {
  deltaAmounts: bigint[];
  sqrtPriceX96Afters: bigint[];
  amountIn: bigint;
  amountOut: bigint;
  paths: string[];
  amountSpecified: bigint;
}

export type DepositQuoteData = {
  amount0Min: bigint;
  amount1Min: bigint;
  liquidity: bigint;
}

export type WithdrawQuoteData = {
  amount0: bigint;
  amount1: bigint;
}

export type ValueChangedData = {
  inputToken: Token;
  outputToken: Token;
  amountIn: bigint;
  amountOut: bigint;
  inputValue: Number;
  outputValue: Number;
  percent: Number;
}

export type SignatureData = {
  account: string;
  chainId: number;
  nonce: string;
  timestamp: number;
  expire: number;
  signature: string;
}

export type JwtToken = {
  value: String;
  exp: number;
}

export type Auth = {
  id: string;
  accessToken: JwtToken;
  refreshToken: JwtToken;
}

const PricesData = Type.Record(Type.String(), Type.Number())
export type PricesData = Static<typeof PricesData>

const LoginData = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
})
export type LoginData = Static<typeof LoginData>

const Profile = Type.Object({
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
export type Profile = Static<typeof Profile>

const Fans = Type.Object({
  id: Type.String(),
  account: Type.String(),
  nickname: Type.String(),
  level: Type.Integer(),
  acceptAt: Type.String(),
})
const FansList = Type.Array(Fans)
export type Fans = Static<typeof Fans>

const Inviter = Type.Object({
  id: Type.String(),
  account: Type.String(),
  nickname:Type.String(),
  fans: Type.Number(),
})
export type Inviter = Static<typeof Inviter>

const Reward = Type.Object({
  chainId: Type.Number(),
  amount: Type.Union([Type.BigInt(), Type.String()]),
  nonce: Type.String(),
  proof: Type.Array(Type.String()),
  root: Type.String(),
  deadline: Type.Number(),
  updatedAt: Type.String(),
})
export type Reward = Static<typeof Reward>
const Rewards = Type.Object({
  current: Type.Union([Type.BigInt(), Type.String()]),
  claimed: Type.Union([Type.BigInt(), Type.String()]),
  available: Type.Union([Type.BigInt(), Type.String()]),
  list: Type.Array(Reward),
})

const Points = Type.Object({
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
export type Points = Static<typeof Points>

const GeneralResponse = Type.Object({
  code: Type.Integer(),
  message: Type.String(),
})
export type GeneralResponse = Static<typeof GeneralResponse>

const GenericsResponse = <T extends TSchema>(data: T) => Type.Composite([
  GeneralResponse,
  Type.Object({
    data,
  })
])
const GenericsResponseSchema = GenericsResponse<TSchema>()
export type GenericsResponse = Static<typeof GenericsResponseSchema>
const GenericsOptionalResponse = <T extends TSchema>(data: T) => GenericsResponse(Type.Optional(data))

const LoginResponse = GenericsOptionalResponse<typeof LoginData>()
export type LoginResponse = Static<typeof LoginResponse>

const PricesResponse = GenericsResponse<typeof PricesData>()
export type PricesResponse = Static<typeof PricesResponse>

const InviterResponse = GenericsOptionalResponse<typeof Inviter>()
export type InviterResponse = Static<typeof InviterResponse>

const ProfileResponse = GenericsOptionalResponse<typeof Profile>()
export type ProfileResponse = Static<typeof ProfileResponse>

const RewardsResponse = GenericsOptionalResponse<typeof Rewards>()
export type RewardsResponse = Static<typeof RewardsResponse>

const FansResponse = GenericsOptionalResponse<typeof FansList>()
export type FansResponse = Static<typeof FansResponse>

const PagedData = <T extends TSchema>(data: T) => Type.Object({
  total: Type.Number(),
  list: Type.Array(data),
})

const Claim = Type.Object({
  chainId: Type.Number(),
  transactionHash: Type.String(),
  amount: Type.Union([Type.BigInt(), Type.String()]),
  claimedAt: Type.Optional(Type.String()),
})
export type Claim = Static<typeof Claim>

const PagedClaims = PagedData<typeof Claim>()
const ClaimsResponse = GenericsOptionalResponse<typeof PagedClaims>()
export type ClaimsResponse = Static<typeof ClaimsResponse>

const PagedPoints = PagedData<typeof Points>()
const PointsResponse = GenericsOptionalResponse<typeof PagedPoints>()
export type PointsResponse = Static<typeof PointsResponse>
