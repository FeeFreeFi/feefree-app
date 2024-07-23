import { extend } from "dayjs";

export interface Token {
  chainId: number;
  address: string;
  symbol: string;
  decimals: number;
  dp: number;
  key: string;
}

export interface Pool {
  chainId: number;
  name: string;
  currency0: Token;
  currency1: Token;
  currencyLiquidity: Token;
  id: string;
}

export interface PoolState {
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

export interface Nft {
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

export interface Tx {
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

export interface SwapQuoteData {
  deltaAmounts: bigint[];
  sqrtPriceX96Afters: bigint[];
  amountIn: bigint;
  amountOut: bigint;
  paths: string[];
  amountSpecified: bigint;
}

export interface DepositQuoteData {
  amount0Min: bigint;
  amount1Min: bigint;
  liquidity: bigint;
}

export interface WithdrawQuoteData {
  amount0: bigint;
  amount1: bigint;
}

export interface ValueChangedData {
  inputToken: Token;
  outputToken: Token;
  amountIn: bigint;
  amountOut: bigint;
  inputValue: Number;
  outputValue: Number;
  percent: Number;
}

export interface SignatureData {
  account: string;
  chainId: number;
  nonce: string;
  timestamp: number;
  expire: number;
}

export interface Profile {
  uid: string;
  account: string;
  nickname: string;
  score: number;
  referral: string;
  inviter: string;
}

export interface JwtToken {
  value: String;
  exp: number;
}

export interface Auth {
  accessToken: JwtToken;
  refreshToken: JwtToken;
  uid: string;
}
