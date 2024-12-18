import { toBytes32 } from '@/utils/bn'
import { isNative } from '@/utils/ethereum'

const ABI_ADD_LIQUIDITY = [
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

const ABI_REMOVE_LIQUIDITY = [
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

const ABI_SWAP = [
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

const ABI_GET_POOL_STATE = [
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

const ABI_GET_POOL_META = [
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

const ABI_GET_POOL_IDS = [
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

const ABI_GET_LOCK_DATAS = [
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

const ABI_GET_TOKEN_META = [
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

const ABI_GET_FEES = [
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

const ABI_GET_MINTED = [
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

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} id
 */
export const getPoolState = async (publicClient, address, id) => {
  const result = await publicClient.readContract({
    address,
    abi: ABI_GET_POOL_STATE,
    functionName: 'getPoolState',
    args: [id],
  })

  /**
   * @type {bigint[]}
   */
  const [sqrtPriceX96, liquidity] = result

  return { sqrtPriceX96, liquidity }
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} id
 */
export const getPoolMeta = async (publicClient, address, id) => {
  const chainId = publicClient.chain.id
  const result = await publicClient.readContract({
    address,
    abi: ABI_GET_POOL_META,
    functionName: 'getPoolMeta',
    args: [id],
  })

  /**
   * @type {{token0:{address:string, name:string, symbol:string, decimals:bigint}, token1:{address:string, name:string, symbol:string, decimals:bigint}, id:string, tag:bigint}}
   */
  const { token0, token1, tag } = result

  return {
    currency0: { ...token0, decimals: Number(token0.decimals), chainId },
    currency1: { ...token1, decimals: Number(token1.decimals), chainId },
    id,
    tag,
  }
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} account
 * @returns {Promise<string[]>}
 */
export const getPoolIds = async (publicClient, address, account) => {
  return publicClient.readContract({
    address,
    abi: ABI_GET_POOL_IDS,
    functionName: 'getPoolIds',
    args: [account],
  })
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} account
 * @param {string} id
 * @returns {Promise<import('@/types').LockData[]>}
 */
export const getLockDatas = async (publicClient, address, account, id) => {
  /** @type {{lockId:string, token:string, tokenId:bigint, amount:bigint, unlockTime:bigint, owner:string, unlocked:boolean}[]} */
  const result = await publicClient.readContract({
    address,
    abi: ABI_GET_LOCK_DATAS,
    functionName: 'getLockDatas',
    args: [account, id],
  })

  return result.map(it => ({
    ...it,
    tokenId: toBytes32(it.tokenId),
    unlockTime: parseInt(it.unlockTime, 10),
  }))
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} token
 */
export const getTokenMeta = async (publicClient, address, token) => {
  if (isNative(token)) {
    const { name, symbol, decimals } = publicClient.chain.nativeCurrency
    return { name, symbol, decimals }
  }

  const result = await publicClient.readContract({
    address,
    abi: ABI_GET_TOKEN_META,
    functionName: 'getTokenMeta',
    args: [token],
  }).catch(() => {})

  if (!result) {
    return null
  }

  /**
   * @type {{name:string, symbol:string, decimals:bigint}}
   */
  const { name, symbol, decimals } = result

  return { name, symbol, decimals: Number(decimals) }
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 */
export const getFees = async (publicClient, address) => {
  const result = await publicClient.readContract({
    address,
    abi: ABI_GET_FEES,
    functionName: 'getFees',
  })

  /**
   * @type {bigint[]}
   */
  const [swapFee, exchangeFee, lpFee] = result

  return { swapFee, exchangeFee, lpFee }
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string[]} nfts
 * @returns {Promise<bigint[]>}
 */
export const getMinted = async (publicClient, address, nfts) => {
  return publicClient.readContract({
    address,
    abi: ABI_GET_MINTED,
    functionName: 'getMinted',
    args: [nfts],
  })
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} currency0
 * @param {string} currency1
 * @param {bigint} amount0Max
 * @param {bigint} amount1Max
 */
export const addLiquidity = async (publicClient, address, currency0, currency1, amount0Max, amount1Max) => {
  const result = await publicClient.readContract({
    address,
    abi: ABI_ADD_LIQUIDITY,
    functionName: 'addLiquidity',
    args: [{ currency0, currency1, amount0Max, amount1Max }],
  })

  /**
   * @type {bigint[]}
   */
  const [amount0Desired, amount1Desired, liquidity] = result

  return {
    amount0Desired,
    amount1Desired,
    liquidity,
  }
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} currency0
 * @param {string} currency1
 * @param {bigint} liquidity
 */
export const removeLiquidity = async (publicClient, address, currency0, currency1, liquidity) => {
  const result = await publicClient.readContract({
    address,
    abi: ABI_REMOVE_LIQUIDITY,
    functionName: 'removeLiquidity',
    args: [{ currency0, currency1, liquidity }],
  })

  /**
   * @type {bigint[]}
   */
  const [amount0Min, amount1Min] = result

  return {
    amount0Min,
    amount1Min,
  }
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string[]} paths
 * @param {bigint} amountSpecified
 */
export const swap = async (publicClient, address, paths, amountSpecified) => {
  const { result } = await publicClient.simulateContract({
    address,
    abi: ABI_SWAP,
    functionName: 'swap',
    args: [{ paths, amountSpecified }],
  })

  /**
   * @type {bigint[]}
   */
  const [amountIn, amountOut] = result

  return {
    amountIn,
    amountOut,
  }
}
