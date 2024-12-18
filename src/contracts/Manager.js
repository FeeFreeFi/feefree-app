import { encodeAbiParameters } from "viem"

// const ABI_INITIALIZE_EVENT = [{
//   type: "event",
//   name: "Initialize",
//   inputs: [
//     {
//       name: "id",
//       type: "bytes32",
//       indexed: true,
//     },
//     {
//       name: "currency0",
//       type: "address",
//       indexed: true,
//     },
//     {
//       name: "currency1",
//       type: "address",
//       indexed: true,
//     },
//     {
//       name: "fee",
//       type: "uint24",
//       indexed: false,
//     },
//     {
//       name: "tickSpacing",
//       type: "int24",
//       indexed: false,
//     },
//     {
//       name: "hooks",
//       type: "address",
//       indexed: false,
//     },
//     {
//       name: "sqrtPriceX96",
//       type: "uint160",
//       indexed: false,
//     },
//     {
//       name: "tick",
//       type: "int24",
//       indexed: false,
//     }
//   ],
// }]

const ABI_LAUNCH = [
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

const ABI_INITIALIZE = [
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

const ABI_ADD_LIQUIDITY = [
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

const ABI_REMOVE_LIQUIDITY = [
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

const ABI_SWAP = [
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

const ABI_EXCHANGE = [
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

const ACTION_PARAMS = [
  { name: "action", type: "uint256" },
  { name: "params", type: "bytes" },
]

const LAUNCH_PARAMS = [{
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

const INITIALIZE_PARAMS = [{
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

const ADD_LIQUIDITY_PARAMS = [{
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

const REMOVE_LIQUIDITY_PARAMS = [{
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

const SWAP_PARAMS = [{
  name: "params",
  type: "tuple",
  components: [
    { name: "paths", type: "address[]" },
    { name: "amountSpecified", type: "int128" },
    { name: "amountDesired", type: "uint128" },
    { name: "recipient", type: "address" },
  ]
}]

const EXCHANGE_PARAMS = [{
  name: "params",
  type: "tuple",
  components: [
    { name: "currency", type: "address" },
    { name: "amountSpecified", type: "int128" },
    { name: "recipient", type: "address" },
  ]
}]

/**
 * @param {import('@/types').LaunchParams} params
 */
export const encodeLaunchData = params => {
  return encodeAbiParameters(ACTION_PARAMS, [Actions.LAUNCH, encodeAbiParameters(LAUNCH_PARAMS, [params])])
}

/**
 * @param {import('@/types').InitializeParams} params
 */
export const encodeInitializeData = params => {
  return encodeAbiParameters(ACTION_PARAMS, [Actions.INITIALIZE, encodeAbiParameters(INITIALIZE_PARAMS, [params])])
}

/**
 * @param {import('@/types').AddLiquidityParams} params
 */
export const encodeAddLiquidityData = params => {
  return encodeAbiParameters(ACTION_PARAMS, [Actions.ADD_LIQUIDITY, encodeAbiParameters(ADD_LIQUIDITY_PARAMS, [params])])
}

/**
 * @param {import('@/types').RemoveLiquidityParams} params
 */
export const encodeRemoveLiquidityData = params => {
  return encodeAbiParameters(ACTION_PARAMS, [Actions.REMOVE_LIQUIDITY, encodeAbiParameters(REMOVE_LIQUIDITY_PARAMS, [params])])
}

/**
 * @param {import('@/types').SwapParams} params
 */
export const encodeSwapData = params => {
  return encodeAbiParameters(ACTION_PARAMS, [Actions.SWAP, encodeAbiParameters(SWAP_PARAMS, [params])])
}

/**
 * @param {import('@/types').ExchangeParams} params
 */
export const encodeExchangeData = params => {
  return encodeAbiParameters(ACTION_PARAMS, [Actions.EXCHANGE, encodeAbiParameters(EXCHANGE_PARAMS, [params])])
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} data
 * @param {{value:bigint}} options
 */
export const launch = async ({ publicClient, walletClient }, address, data, { value = 0n }) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_LAUNCH,
    functionName: 'launch',
    args: [data],
    value,
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} data
 * @param {{value:bigint}} options
 */
export const initialize = async ({ publicClient, walletClient }, address, data, { value = 0n }) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_INITIALIZE,
    functionName: 'initialize',
    args: [data],
    value,
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} data
 * @param {number} deadline
 * @param {{value:bigint}} options
 */
export const addLiquidity = async ({ publicClient, walletClient }, address, data, deadline, { value = 0n }) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_ADD_LIQUIDITY,
    functionName: 'addLiquidity',
    args: [data, deadline],
    value,
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} data
 * @param {number} deadline
 */
export const removeLiquidity = async ({ publicClient, walletClient }, address, data, deadline) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_REMOVE_LIQUIDITY,
    functionName: 'removeLiquidity',
    args: [data, deadline],
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} data
 * @param {number} deadline
 * @param {{value:bigint}} options
 */
export const swap = async ({ publicClient, walletClient }, address, data, deadline, { value = 0n }) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_SWAP,
    functionName: 'swap',
    args: [data, deadline],
    value,
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} data
 * @param {{value:bigint}} options
 */
export const exchange = async ({ publicClient, walletClient }, address, data, { value = 0n }) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_EXCHANGE,
    functionName: 'exchange',
    args: [data],
    value,
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

// /**
//  * @param {import('viem').PublicClient} publicClient
//  * @param {{hash?:string, receipt?:import('viem').TransactionReceipt}} args
//  * @returns {Promise<import('@/types').PoolInfo[]>}
//  */
// export const parseInitializeEvents = async (publicClient, args) => {
//   const chainId = publicClient.chain.id
//   let receipt = args.receipt
//   if (!receipt) {
//     receipt = await publicClient.getTransactionReceipt({ hash: args.hash })
//   }

//   const logs =  parseEventLogs({
//     abi: ABI_INITIALIZE_EVENT,
//     eventName: "Initialize",
//     logs: receipt.logs,
//   })

//   return logs.map(log => ({
//     id: log.args.id,
//     currency0: log.args.currency0,
//     currency1: log.args.currency1,
//     chainId,
//   }))
// }
