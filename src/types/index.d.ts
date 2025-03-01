export interface Token {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  hot?: boolean
  dp?: number
  key?: string
  icon?: string
}

export interface Manager {
  chainId: number
  address: string
  pool: string
  liquidity: string
  hooks: string
  timelock: string
  quoter: string
}

export interface Nft {
  chainId: number
  address: string
  name: string
  symbol: string
  label: string
  price: bigint
  cap: bigint
  image: string
}

export interface Notice {
  id: string
  content: string
  date: Date
}

export interface PoolInfo {
  chainId: number
  id: string
  currency0: string
  currency1: string
  hot?: boolean
}

export interface TokenMetadata {
  name: string
  symbol: string
  decimals: number
}

export interface TokenRaw {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
}

export interface LaunchParams {
  name: string
  symbol: string
  asset: string
  amount: bigint
  totalSupply: bigint
  recipient: string
  duration: number
}

export interface InitializeParams {
  currency0: string
  currency1: string
  amount0: bigint
  amount1: bigint
  recipient: string
  duration: number
}

export interface AddLiquidityParams {
  currency0: string
  currency1: string
  liquidity: bigint
  amount0Max: bigint
  amount1Max: bigint
  recipient: string
}

export interface RemoveLiquidityParams {
  currency0: string
  currency1: string
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  recipient: string
}

export interface SwapParams {
  paths: string[]
  amountSpecified: bigint
  amountDesired: bigint
  recipient: string
}

export interface ExchangeParams {
  currency: string
  amountSpecified: bigint
  recipient: string
}

export interface PoolMeta {
  chainId: number
  currency0: Token
  currency1: Token
  id: string
  hot?: boolean
}

export interface PoolKey {
  currency0: string
  currency1: string
  fee: bigint
  tickSpacing: bigint
  hooks: string
}

export interface PoolData {
  sqrtPriceX96: bigint
  liquidity: bigint
  balance0: bigint
  balance1: bigint
  tvl: bigint
  price0: number
  price1: number
  percent0: string
  percent1: string
}

export interface Tx {
  chainId: number
  hash: string
  explorerUrl?: string
}

export interface LockData {
  lockId: string
  token: string
  tokenId: string | bigint
  amount: bigint
  unlockTime: number | bigint
  owner: string
  unlocked: boolean
}

export interface QuoteSwapData {
  paths: string[]
  amountSpecified: bigint
  amountIn: bigint
  amountOut: bigint
}

export interface QuoteAddLiquidityData {
  currency0: string
  currency1: string
  liquidity: bigint
  amount0Max: bigint
  amount1Max: bigint
}

export interface QuoteRemoveLiquidityData {
  currency0: string
  currency1: string
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
}

export interface SignatureData {
  account: string
  chainId: number
  nonce: string
  timestamp: number
  expire: number
  signature: string
  origin: string
}

export interface JwtToken {
  value: string
  exp: number
}

export interface Auth {
  id: string
  accessToken: JwtToken
  refreshToken: JwtToken
}

export interface EIP6963ProviderInfo {
  uuid: string
  name: string
  icon: string
  rdns: string
}

export interface EIP1193Provider {
  request: (args: any) => Promise<any>
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: EIP1193Provider
}

export interface EIP6963AnnounceProviderEvent extends CustomEvent<EIP6963ProviderDetail> {
  type: 'eip6963:announceProvider'
}

export type EIP1193ProviderLegacy = EIP1193Provider & Record<string, unknown>

export interface WalletInfo {
  id: string
  name: string
  icon?: string
  origin?: string
  hidden?: boolean
}

export interface Wallet {
  info: WalletInfo
  provider: EIP1193Provider
}

export type Callback = () => void

export type PromiseCallback = () => Promise<void>

export type TimerId = ReturnType<typeof setInterval | typeof setTimeout> | undefined

export interface Pagination {
  page: number
  limit: number
}

export type Prices = Record<string, number>

export interface LoginData {
  accessToken: string
  refreshToken: string
}

export interface Profile {
  id: string
  account: string
  nickname: string
  points: number
  level: number
  exp: number
  nextExp: number
  referral: string
  inviter: string
  fans: number
  reward: bigint | string
}

export interface Fans {
  id: string
  account: string
  nickname: string
  level: number
  acceptAt: string
}

export interface Inviter {
  id: string
  account: string
  nickname: string
  fans: number
}

export interface Reward {
  chainId: number
  address: string
  amount: bigint
  nonce: string
  proof: string[]
  root: string
  deadline: number
  updatedAt: Date
  transactionHash: string
}

type PointsMeta =
  | { chainId: number, transactionHash: string }
  | { account: string }
  | { remark: string }
  | { chainId: number, transactionHash: string, account: string, reason: string }

export interface Points {
  value: number
  date: Date
  reason: string
  meta: PointsMeta
}

export interface Claim {
  chainId: number
  transactionHash: string
  amount: bigint
  claimedAt?: Date
}

export interface ModalAction {
  show: boolean
  state?: number
  title?: string
  message?: string
  data?: object
  tx?: Tx
  error?: string
}

export interface ApprovalAction extends ModalAction {
  data?: {
    chainId: number
    token: Token
    amount: bigint
    spender: string
  }
}

export interface ApprovalLiquidtyAction extends ModalAction {
  data?: {
    chainId: number
    pool: PoolMeta
    amount: bigint
    spender: string
  }
}

export interface LaunchAction extends ModalAction {
  data?: {
    chainId: number
    asset: Token
    amount: bigint
    name: string
    symbol: string
    decimals: number
    totalSupply: bigint
    duration: number
    pools?: PoolMeta[]
  }
}

export interface CreateAction extends ModalAction {
  data?: {
    chainId: number
    token0: Token
    token1: Token
    amount0: bigint
    amount1: bigint
    duration: number
    pool?: PoolMeta
  }
}

export interface SwapAction extends ModalAction {
  data?: {
    chainId: number
    inputToken: Token
    outputToken: Token
    amountIn: bigint
    amountOut: bigint
    fee: bigint
  }
}

export interface AddLiquidityAction extends ModalAction {
  data?: {
    chainId: number
    pool: PoolMeta
    liquidity: bigint
    amount0Max: bigint
    amount1Max: bigint
  }
}

export interface RemoveLiquidityAction extends ModalAction {
  data?: {
    chainId: number
    pool: PoolMeta
    amount0Min: bigint
    amount1Min: bigint
  }
}

export interface UnlockAction extends ModalAction {
  data?: {
    chainId: number
    pool: PoolMeta
    lock: LockData
  }
}

export interface MintAction extends ModalAction {
  data?: {
    chainId: number
    nft: Nft
  }
}

export interface ClaimAction extends ModalAction {
  data?: {
    chainId: number
    reward: Reward
  }
}

export interface ValueChangedData {
  inputToken: Token
  amountIn: bigint
  inputValue: number
  outputToken: Token
  amountOut: bigint
  outputValue: number
}

export interface GeneralResponse {
  code: number
  message: string
}

export interface GenericsResponse<T> {
  code: number
  message: string
  data: T
}

export interface PageableResponse<T> {
  code: number
  message: string
  data: {
    total: number
    list: T[]
  }
}

export type PricesResponse = GenericsResponse<Prices>

export type LoginResponse = GenericsResponse<LoginData>

export type InviterResponse = GenericsResponse<Inviter>

export type ManagersResponse = GenericsResponse<Manager[]>

export type TokensResponse = GenericsResponse<Token[]>

export type PoolsResponse = GenericsResponse<PoolInfo[]>

export type NftsResponse = GenericsResponse<Nft[]>

export type NoticeResponse = GenericsResponse<Notice>

export type ProfileResponse = GenericsResponse<Profile>

interface Rewards {
  current: bigint
  claimed: bigint
  available: bigint
  list: Reward[]
}
export type RewardsResponse = GenericsResponse<Rewards>

export type FansResponse = PageableResponse<Fans>

export type ClaimsResponse = PageableResponse<Claim>

export type PointsResponse = PageableResponse<Points>
