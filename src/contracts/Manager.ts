import { AddLiquidityParams, ExchangeParams, InitializeParams, LaunchParams, RemoveLiquidityParams, SwapParams } from "@/types"
import type { PublicClient, WalletClient, Abi, Address, AbiParameter } from "viem"
import { encodeAbiParameters } from "viem"

const ABI_LAUNCH: Abi = [
  {
    type: "function",
    name: "launch",
    inputs: [
      {
        name: "data",
        type: "bytes",
      }
    ],
    outputs: [],
    stateMutability: "payable"
  },
]

const ABI_INITIALIZE: Abi = [
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "data",
        type: "bytes",
      }
    ],
    outputs: [],
    stateMutability: "payable"
  },
]

const ABI_ADD_LIQUIDITY: Abi = [
  {
    inputs: [
      {
        name: "data",
        type: "bytes"
      },
      {
        name: "deadline",
        type: "uint256"
      }
    ],
    outputs: [],
    stateMutability: "payable",
    type: "function",
    name: "addLiquidity"
  },
]

const ABI_REMOVE_LIQUIDITY: Abi = [
  {
    inputs: [
      {
        name: "data",
        type: "bytes"
      },
      {
        name: "deadline",
        type: "uint256"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    name: "removeLiquidity"
  },
]

const ABI_SWAP: Abi = [
  {
    inputs: [
      {
        name: "data",
        type: "bytes"
      },
      {
        name: "deadline",
        type: "uint256"
      }
    ],
    outputs: [],
    stateMutability: "payable",
    type: "function",
    name: "swap"
  },
]

const ABI_EXCHANGE: Abi = [
  {
    type: "function",
    name: "exchange",
    inputs: [
      {
        name: "data",
        type: "bytes",
      }
    ],
    outputs: [],
    stateMutability: "payable"
  },
]

const Actions = {
  LAUNCH: 1,
  INITIALIZE: 2,
  ADD_LIQUIDITY: 3,
  REMOVE_LIQUIDITY: 4,
  SWAP: 5,
  EXCHANGE: 6,
}

const ACTION_PARAMS: readonly AbiParameter[] = [
  { name: "action", type: "uint256" },
  { name: "params", type: "bytes" },
]

const LAUNCH_PARAMS: readonly AbiParameter[] = [{
  name: "params",
  type: "tuple",
  components: [
    { name: "name", type: "string" },
    { name: "symbol", type: "string" },
    { name: "asset", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "totalSupply", type: "uint256" },
    { name: "recipient", type: "address" },
    { name: "duration", type: "uint256" },
  ]
}]

const INITIALIZE_PARAMS: readonly AbiParameter[] = [{
  name: "params",
  type: "tuple",
  components: [
    { name: "currency0", type: "address" },
    { name: "currency1", type: "address" },
    { name: "amount0", type: "uint128" },
    { name: "amount1", type: "uint128" },
    { name: "recipient", type: "address" },
    { name: "duration", type: "uint256" },
  ]
}]

const ADD_LIQUIDITY_PARAMS: readonly AbiParameter[] = [{
  name: "params",
  type: "tuple",
  components: [
    { name: "currency0", type: "address" },
    { name: "currency1", type: "address" },
    { name: "liquidity", type: "uint128" },
    { name: "amount0Max", type: "uint128" },
    { name: "amount1Max", type: "uint128" },
    { name: "recipient", type: "address" },
  ]
}]

const REMOVE_LIQUIDITY_PARAMS: readonly AbiParameter[] = [{
  name: "params",
  type: "tuple",
  components: [
    { name: "currency0", type: "address" },
    { name: "currency1", type: "address" },
    { name: "liquidity", type: "uint128" },
    { name: "amount0Min", type: "uint128" },
    { name: "amount1Min", type: "uint128" },
    { name: "recipient", type: "address" },
  ]
}]

const SWAP_PARAMS: readonly AbiParameter[] = [{
  name: "params",
  type: "tuple",
  components: [
    { name: "paths", type: "address[]" },
    { name: "amountSpecified", type: "int128" },
    { name: "amountDesired", type: "uint128" },
    { name: "recipient", type: "address" },
  ]
}]

const EXCHANGE_PARAMS: readonly AbiParameter[] = [{
  name: "params",
  type: "tuple",
  components: [
    { name: "currency", type: "address" },
    { name: "amountSpecified", type: "int128" },
    { name: "recipient", type: "address" },
  ]
}]

export const encodeLaunchData = (params: LaunchParams) => {
  return encodeAbiParameters(ACTION_PARAMS, [Actions.LAUNCH, encodeAbiParameters(LAUNCH_PARAMS, [params])])
}

export const encodeInitializeData = (params: InitializeParams) => {
  return encodeAbiParameters(ACTION_PARAMS, [Actions.INITIALIZE, encodeAbiParameters(INITIALIZE_PARAMS, [params])])
}

export const encodeAddLiquidityData = (params: AddLiquidityParams) => {
  return encodeAbiParameters(ACTION_PARAMS, [Actions.ADD_LIQUIDITY, encodeAbiParameters(ADD_LIQUIDITY_PARAMS, [params])])
}

export const encodeRemoveLiquidityData = (params: RemoveLiquidityParams) => {
  return encodeAbiParameters(ACTION_PARAMS, [Actions.REMOVE_LIQUIDITY, encodeAbiParameters(REMOVE_LIQUIDITY_PARAMS, [params])])
}

export const encodeSwapData = (params: SwapParams) => {
  return encodeAbiParameters(ACTION_PARAMS, [Actions.SWAP, encodeAbiParameters(SWAP_PARAMS, [params])])
}

export const encodeExchangeData = (params: ExchangeParams) => {
  return encodeAbiParameters(ACTION_PARAMS, [Actions.EXCHANGE, encodeAbiParameters(EXCHANGE_PARAMS, [params])])
}

export const launch = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, data: string, { value = 0n }) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_LAUNCH,
    functionName: 'launch',
    args: [data],
    value,
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}

export const initialize = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, data: string, { value = 0n }) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_INITIALIZE,
    functionName: 'initialize',
    args: [data],
    value,
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}

export const addLiquidity = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, data: string, deadline: number, { value = 0n }) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_ADD_LIQUIDITY,
    functionName: 'addLiquidity',
    args: [data, deadline],
    value,
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} data
 * @param {number} deadline
 */
export const removeLiquidity = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, data: string, deadline: number) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_REMOVE_LIQUIDITY,
    functionName: 'removeLiquidity',
    args: [data, deadline],
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}

export const swap = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, data: string, deadline: number, { value = 0n }) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_SWAP,
    functionName: 'swap',
    args: [data, deadline],
    value,
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}

export const exchange = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, data: string, { value = 0n }) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_EXCHANGE,
    functionName: 'exchange',
    args: [data],
    value,
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}
