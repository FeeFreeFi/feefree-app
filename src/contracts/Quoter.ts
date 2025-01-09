import type { PublicClient, Abi, Address } from "viem"
import type { LockData, Token } from "@/types"
import { toBytes32, isNative } from '@/utils'

const ABI_ADD_LIQUIDITY: Abi = [
  {
    type: "function",
    name: "addLiquidity",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          {
            name: "currency0",
            type: "address",
          },
          {
            name: "currency1",
            type: "address",
          },
          {
            name: "amount0Max",
            type: "uint128",
          },
          {
            name: "amount1Max",
            type: "uint128",
          }
        ]
      }
    ],
    outputs: [
      {
        name: "amount0Desired",
        type: "uint128",
      },
      {
        name: "amount1Desired",
        type: "uint128",
      },
      {
        name: "liquidity",
        type: "uint128",
      }
    ],
    stateMutability: "view"
  },
]

const ABI_REMOVE_LIQUIDITY: Abi = [
  {
    type: "function",
    name: "removeLiquidity",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          {
            name: "currency0",
            type: "address",
          },
          {
            name: "currency1",
            type: "address",
          },
          {
            name: "liquidity",
            type: "uint128",
          }
        ]
      }
    ],
    outputs: [
      {
        name: "amount0Min",
        type: "uint128",
      },
      {
        name: "amount1Min",
        type: "uint128",
      }
    ],
    stateMutability: "view"
  },
]

const ABI_SWAP: Abi = [
  {
    type: "function",
    name: "swap",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          {
            name: "paths",
            type: "address[]",
          },
          {
            name: "amountSpecified",
            type: "int128",
          }
        ]
      }
    ],
    outputs: [
      {
        name: "amountIn",
        type: "uint128",
      },
      {
        name: "amountOut",
        type: "uint128",
      }
    ],
    stateMutability: "nonpayable"
  }
]

const ABI_GET_POOL_STATE: Abi = [
  {
    inputs: [
      {
        name: "id",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function",
    name: "getPoolState",
    outputs: [
      {
        name: "sqrtPriceX96",
        type: "uint160"
      },
      {
        name: "liquidity",
        type: "uint128"
      }
    ]
  },
]

const ABI_GET_POOL_META: Abi = [
  {
    inputs: [
      {
        name: "id",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function",
    name: "getPoolMeta",
    outputs: [
      {
        type: "tuple",
        components: [
          {
            name: "id",
            type: "bytes32"
          },
          {
            name: "token0",
            type: "tuple",
            components: [
              {
                name: "name",
                type: "string"
              },
              {
                name: "symbol",
                type: "string"
              },
              {
                name: "decimals",
                type: "uint8"
              },
              {
                name: "address",
                type: "address"
              }
            ]
          },
          {
            name: "token1",
            type: "tuple",
            components: [
              {
                name: "name",
                type: "string"
              },
              {
                name: "symbol",
                type: "string"
              },
              {
                name: "decimals",
                type: "uint8"
              },
              {
                name: "address",
                type: "address"
              }
            ]
          },
          {
            name: "tag",
            type: "uint8"
          }
        ]
      }
    ]
  },
]

const ABI_GET_POOL_IDS: Abi = [
  {
    type: "function",
    name: "getPoolIds",
    inputs: [
      {
        name: "account",
        type: "address",
      }
    ],
    outputs: [
      {
        type: "bytes32[]",
      }
    ],
    stateMutability: "view"
  },
]

const ABI_GET_LOCK_DATAS: Abi = [
  {
    type: "function",
    name: "getLockDatas",
    inputs: [
      {
        name: "account",
        type: "address",
      },
      {
        name: "id",
        type: "bytes32",
      }
    ],
    outputs: [
      {
        type: "tuple[]",
        components: [
          {
            name: "lockId",
            type: "bytes32",
          },
          {
            name: "token",
            type: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
          },
          {
            name: "amount",
            type: "uint256",
          },
          {
            name: "unlockTime",
            type: "uint256",
          },
          {
            name: "owner",
            type: "address",
          },
          {
            name: "unlocked",
            type: "bool",
          }
        ]
      }
    ],
    stateMutability: "view"
  },
]

const ABI_GET_TOKEN_META: Abi = [
  {
    inputs: [
      {
        name: "currency",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function",
    name: "getTokenMeta",
    outputs: [
      {
        type: "tuple",
        components: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "decimals",
            type: "uint8",
          },
          {
            name: "addr",
            type: "address",
          }
        ]
      }
    ]
  },
]

const ABI_GET_FEES: Abi = [
  {
    inputs: [],
    stateMutability: "view",
    type: "function",
    name: "getFees",
    outputs: [
      {
        name: "swapFee",
        type: "uint256"
      },
      {
        name: "exchangeFee",
        type: "uint256"
      },
      {
        name: "lpFee",
        type: "uint24"
      }
    ]
  },
]

const ABI_GET_MINTED: Abi = [
  {
    inputs: [
      {
        name: "nfts",
        type: "address[]",
      }
    ],
    stateMutability: "view",
    type: "function",
    name: "getMinted",
    outputs: [
      {
        type: "uint256[]"
      },
    ]
  },
]

export const getPoolState = async (publicClient: PublicClient, address: string, id: string) => {
  const result = await publicClient.readContract({
    address: address as Address,
    abi: ABI_GET_POOL_STATE,
    functionName: 'getPoolState',
    args: [id],
  }) as bigint[]

  const [sqrtPriceX96, liquidity] = result

  return { sqrtPriceX96, liquidity }
}

export const getPoolMeta = async (publicClient: PublicClient, address: string, id: string) => {
  const chainId = publicClient.chain!.id
  const result = await publicClient.readContract({
    address: address as Address,
    abi: ABI_GET_POOL_META,
    functionName: 'getPoolMeta',
    args: [id],
  })

  const { token0, token1, tag } = result as { token0: Token, token1: Token, tag: bigint }

  return {
    currency0: { ...token0, decimals: Number(token0.decimals), chainId },
    currency1: { ...token1, decimals: Number(token1.decimals), chainId },
    id,
    tag,
  }
}

export const getPoolIds = async (publicClient: PublicClient, address: string, account: string) => {
  return publicClient.readContract({
    address: address as Address,
    abi: ABI_GET_POOL_IDS,
    functionName: 'getPoolIds',
    args: [account],
  }) as Promise<string[]>
}

export const getLockDatas = async (publicClient: PublicClient, address: string, account: string, id: string) => {
  const result = await publicClient.readContract({
    address: address as Address,
    abi: ABI_GET_LOCK_DATAS,
    functionName: 'getLockDatas',
    args: [account, id],
  }) as LockData[]

  return result.map(it => ({
    ...it,
    tokenId: toBytes32(it.tokenId as bigint),
    unlockTime: parseInt((it.unlockTime as bigint).toString(10), 10),
  }))
}

export const getTokenMeta = async (publicClient: PublicClient, address: string, token: string) => {
  if (isNative(token)) {
    const { name, symbol, decimals } = publicClient.chain!.nativeCurrency
    return { name, symbol, decimals }
  }

  const result = await publicClient.readContract({
    address: address as Address,
    abi: ABI_GET_TOKEN_META,
    functionName: 'getTokenMeta',
    args: [token],
  }).catch(() => {})

  if (!result) {
    return null
  }

  const { name, symbol, decimals } = result as { name:string, symbol: string, decimals: bigint }

  return { name, symbol, decimals: Number(decimals) }
}

export const getFees = async (publicClient: PublicClient, address: string) => {
  const result = await publicClient.readContract({
    address: address as Address,
    abi: ABI_GET_FEES,
    functionName: 'getFees',
  })

  const [swapFee, exchangeFee, lpFee] = result as bigint[]

  return { swapFee, exchangeFee, lpFee }
}

export const getMinted = async (publicClient: PublicClient, address: string, nfts: string[]) => {
  return publicClient.readContract({
    address: address as Address,
    abi: ABI_GET_MINTED,
    functionName: 'getMinted',
    args: [nfts],
  }) as Promise<bigint[]>
}

export const addLiquidity = async (publicClient: PublicClient, address: string, currency0: string, currency1: string, amount0Max: bigint, amount1Max: bigint) => {
  const result = await publicClient.readContract({
    address: address as Address,
    abi: ABI_ADD_LIQUIDITY,
    functionName: 'addLiquidity',
    args: [{ currency0, currency1, amount0Max, amount1Max }],
  })

  const [amount0Desired, amount1Desired, liquidity] = result as bigint[]

  return {
    amount0Desired,
    amount1Desired,
    liquidity,
  }
}

export const removeLiquidity = async (publicClient: PublicClient, address: string, currency0: string, currency1: string, liquidity: bigint) => {
  const result = await publicClient.readContract({
    address: address as Address,
    abi: ABI_REMOVE_LIQUIDITY,
    functionName: 'removeLiquidity',
    args: [{ currency0, currency1, liquidity }],
  })

  const [amount0Min, amount1Min] = result as bigint[]

  return {
    amount0Min,
    amount1Min,
  }
}

export const swap = async (publicClient: PublicClient, address: string, paths: string[], amountSpecified: bigint) => {
  const { result } = await publicClient.simulateContract({
    address: address as Address,
    abi: ABI_SWAP,
    functionName: 'swap',
    args: [{ paths, amountSpecified }],
  })

  const [amountIn, amountOut] = result as bigint[]

  return {
    amountIn,
    amountOut,
  }
}
