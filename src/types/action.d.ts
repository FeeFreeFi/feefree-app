import { Type } from "@sinclair/typebox"
import type { Reward, Token, Nft } from "./type.d"
import type { PoolMeta, LockData, Tx } from "./common.d"

export interface ModalAction {
  show: boolean;
  state: number;
  title: string;
  message: string;
  data: object;
  tx: Tx;
  error: string;
}

export interface ApprovalAction extends ModalAction {
  data: {
    chainId: number;
    token: Token;
    amount: bigint;
    spender: string;
  }
}

export interface ApprovalLiquidtyAction extends ModalAction {
  data: {
    chainId: number;
    pool: PoolMeta;
    amount: bigint;
    spender: string;
  }
}

export interface LaunchAction extends ModalAction {
  data: {
    chainId: number;
    asset: Token;
    amount: bigint;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
    duration: number;
    pools?: PoolMeta[];
  }
}

export interface CreateAction extends ModalAction {
  data: {
    chainId: number;
    token0: Token;
    token1: Token;
    amount0: bigint;
    amount1: bigint;
    duration: number;
    pool?: PoolMeta;
  }
}

export interface SwapAction extends ModalAction {
  data: {
    chainId: number;
    inputToken: Token;
    outputToken: Token;
    amountIn: bigint;
    amountOut: bigint;
    fee: bigint;
  }
}

export interface AddLiquidityAction extends ModalAction {
  data: {
    chainId: number;
    pool: PoolMeta;
    liquidity: bigint;
    amount0Max: bigint;
    amount1Max: bigint;
  }
}

export interface RemoveLiquidityAction extends ModalAction {
  data: {
    chainId: number;
    pool: PoolMeta;
    amount0Min: bigint;
    amount1Min: bigint;
  }
}

export interface UnlockAction extends ModalAction {
  data: {
    chainId: number;
    pool: PoolMeta;
    lock: LockData;
  }
}

export interface MintAction extends ModalAction {
  data: {
    chainId: number;
    nft: Nft;
  }
}

export interface ClaimAction extends ModalAction {
  data: {
    chainId: number;
    reward: Reward;
  }
}
