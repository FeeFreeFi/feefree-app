import type { PublicClient, WalletClient, Abi, Address } from 'viem'

const ABI_LOCK: Abi = [
  {
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
      {
        name: 'unlockTime',
        type: 'uint256',
      },
      {
        name: 'owner',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'lock',
    outputs: [
      {
        type: 'bytes32',
      },
    ],
  },
]

const ABI_UNLOCK: Abi = [
  {
    inputs: [
      {
        name: 'lockId',
        type: 'bytes32',
      },
      {
        name: 'recipient',
        type: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'unlock',
  },
]

export const lock = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, token: string, from: string, tokenId: bigint, amount: bigint, unlockTime: number, owner: string) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_LOCK,
    functionName: 'lock',
    args: [token, from, tokenId, amount, unlockTime, owner],
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}

export const unlock = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, lockId: string, recipient: string) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_UNLOCK,
    functionName: 'unlock',
    args: [lockId, recipient],
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}
