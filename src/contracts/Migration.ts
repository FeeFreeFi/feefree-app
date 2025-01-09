import type { PoolKey } from "@/types"
import type { PublicClient, WalletClient, Abi, Address } from "viem"

const ABI_MIGRATE_LIQUIDITY: Abi = [
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

const ABI_REMOVE_LIQUIDITY: Abi = [
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

const ABI_UNEXCHANGE: Abi = [
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

export const unexchange = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, currency: string, options: { value: bigint }) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_UNEXCHANGE,
    functionName: 'unexchange',
    args: [currency],
    value: options.value,
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}

export const removeLiquidity = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, key: PoolKey) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_REMOVE_LIQUIDITY,
    functionName: 'removeLiquidity',
    args: [key],
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}

export const migrateLiquidity = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, key: PoolKey) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_MIGRATE_LIQUIDITY,
    functionName: 'migrateLiquidity',
    args: [key],
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}

