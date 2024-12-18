import type { Token } from "./type.d"

export type TokenMetadata = {
  name: string;
  symbol: string;
  decimals: number;
}

export type LaunchParams = {
  name: string;
  symbol: string;
  asset: string;
  amount: bigint;
  totalSupply: bigint;
  recipient: string;
  duration: number;
}

export type InitializeParams = {
  currency0: string;
  currency1: string;
  amount0: bigint;
  amount1: bigint;
  recipient: string;
  duration: number;
}

export type AddLiquidityParams = {
  currency0: string;
  currency1: string;
  liquidity: bigint;
  amount0Max: bigint;
  amount1Max: bigint;
  recipient: string;
}

export type RemoveLiquidityParams = {
  currency0: string;
  currency1: string;
  liquidity: bigint;
  amount0Min: bigint;
  amount1Min: bigint;
  recipient: string;
}

export type SwapParams = {
  paths: string[];
  amountSpecified: bigint;
  amountDesired: bigint;
  recipient: string;
}

export type ExchangeParams = {
  currency: string;
  amountSpecified: bigint;
  recipient: string;
}

export type PoolMeta = {
  chainId: number;
  currency0: Token;
  currency1: Token;
  id: string;
}

export type PoolKey = {
  currency0: string;
  currency1: string;
  fee: bigint;
  tickSpacing: bigint;
  hooks: string;
}

export type PoolData = {
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

// export type Nft = {
//   chainId: number;
//   label: string;
//   address: string;
//   name: string;
//   symbol: string;
//   price: bigint;
//   free: boolean,
//   image: string;
//   cap: bigint;
//   capLabel: string;
// }

export type Tx = {
  chainId: number;
  hash: string;
  explorerUrl: string;
}

export type LockData = {
  lockId: string;
  token: string;
  tokenId: string;
  amount: bigint;
  unlockTime: number;
  owner: string;
  unlocked: boolean;
}

export type QuoteSwapData = {
  paths: string[];
  amountSpecified: bigint;
  amountIn: bigint;
  amountOut: bigint;
}

export type QuoteAddLiquidityData = {
  currency0: string;
  currency1: string;
  liquidity: bigint;
  amount0Max: bigint;
  amount1Max: bigint;
}

export type QuoteRemoveLiquidityData = {
  currency0: string;
  currency1: string;
  liquidity: bigint;
  amount0Min: bigint;
  amount1Min: bigint;
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
