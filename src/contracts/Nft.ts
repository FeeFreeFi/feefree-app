import type { PublicClient, WalletClient, Abi, Address } from 'viem'

const ABI_MINT: Abi = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
    ],
    outputs: [],
  },
]

const ABI_TOTAL_SUPPLY: Abi = [
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        type: 'uint256',
      },
    ],
  },
]

export async function totalSupply(publicClient: PublicClient, address: string) {
  return publicClient.readContract({
    address: address as Address,
    abi: ABI_TOTAL_SUPPLY,
    functionName: 'totalSupply',
  }) as Promise<bigint>
}

export async function mint(client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, options: { value: bigint }) {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_MINT,
    functionName: 'mint',
    args: [account],
    value: options.value,
  })
  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}
