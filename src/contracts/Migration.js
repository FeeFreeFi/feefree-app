const ABI_MIGRATE_LIQUIDITY = [
  {
    type: "function",
    name: "migrateLiquidity",
    inputs: [
      {
        name: "key",
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
            name: "fee",
            type: "uint24",
          },
          {
            name: "tickSpacing",
            type: "int24",
          },
          {
            name: "hooks",
            type: "address",
          }
        ]
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
]

const ABI_REMOVE_LIQUIDITY = [
  {
    type: "function",
    name: "removeLiquidity",
    inputs: [
      {
        name: "key",
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
            name: "fee",
            type: "uint24",
          },
          {
            name: "tickSpacing",
            type: "int24",
          },
          {
            name: "hooks",
            type: "address",
          }
        ]
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
]

const ABI_UNEXCHANGE = [
  {
    type: "function",
    name: "unexchange",
    inputs: [
      {
        name: "currency",
        type: "address",
      }
    ],
    outputs: [],
    stateMutability: "payable"
  }
]

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} currency
 * @param {{value:bigint}} options
 */
export const unexchange = async ({ publicClient, walletClient }, address, currency,  { value }) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_UNEXCHANGE,
    functionName: 'unexchange',
    args: [currency],
    value,
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {{currency0:string, currency1:string, fee:number, tickSpacing:number, hooks:string}} key
 */
export const removeLiquidity = async ({ publicClient, walletClient }, address, key) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_REMOVE_LIQUIDITY,
    functionName: 'removeLiquidity',
    args: [key],
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {{currency0:string, currency1:string, fee:number, tickSpacing:number, hooks:string}} key
 */
export const migrateLiquidity = async ({ publicClient, walletClient }, address, key) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_MIGRATE_LIQUIDITY,
    functionName: 'migrateLiquidity',
    args: [key],
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

