import type { PublicClient, WalletClient, Abi, Address } from "viem"

const ABI_BALANCE_OF: Abi = [
  {
    inputs: [
      {
        name: "owner",
        type: "address"
      },
      {
        name: "id",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    name: "balanceOf",
    outputs: [
      {
        name: "amount",
        type: "uint256"
      }
    ]
  },
]

const ABI_ALLOWANCE: Abi = [
  {
    inputs: [
      {
        name: "owner",
        type: "address"
      },
      {
        name: "spender",
        type: "address"
      },
      {
        name: "id",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    name: "allowance",
    outputs: [
      {
        name: "amount",
        type: "uint256"
      }
    ]
  }
]

const ABI_IS_OPERATOR: Abi = [
  {
    inputs: [
      {
        name: "owner",
        type: "address"
      },
      {
        name: "spender",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function",
    name: "isOperator",
    outputs: [
      {
        name: "approved",
        type: "bool"
      }
    ]
  },
]

const ABI_SET_OPERATOR: Abi = [
  {
    inputs: [
      {
        name: "operator",
        type: "address"
      },
      {
        name: "approved",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "setOperator",
    outputs: [
      {
        type: "bool"
      }
    ]
  },
]

const ABI_APPROVE: Abi = [
  {
    inputs: [
      {
        name: "spender",
        type: "address"
      },
      {
        name: "id",
        type: "uint256"
      },
      {
        name: "amount",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "approve",
    outputs: [
      {
        type: "bool"
      }
    ]
  },
]

const ABI_TRANSFER: Abi = [
  {
    inputs: [
      {
        name: "receiver",
        type: "address"
      },
      {
        name: "id",
        type: "uint256"
      },
      {
        name: "amount",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "transfer",
    outputs: [
      {
        type: "bool"
      }
    ]
  },
]

export const balanceOf = async (publicClient: PublicClient, address: string, owner: string, id: bigint) => {
  return publicClient.readContract({
    address: address as Address,
    abi: ABI_BALANCE_OF,
    functionName: 'balanceOf',
    args: [owner, id],
  }) as Promise<bigint>
}

export const allowance = async (publicClient: PublicClient, address: string, owner: string, spender: string, id: bigint) => {
  return publicClient.readContract({
    address: address as Address,
    abi: ABI_ALLOWANCE,
    functionName: 'allowance',
    args: [owner, spender, id],
  }).catch(() => 0n) as Promise<bigint>
}

export const isOperator = async (publicClient: PublicClient, address: string, owner: string, spender: string) => {
  return publicClient.readContract({
    address: address as Address,
    abi: ABI_IS_OPERATOR,
    functionName: 'isOperator',
    args: [owner, spender],
  }) as Promise<boolean>
}

export const approve = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, spender: string, id: bigint, amount: bigint) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_APPROVE,
    functionName: 'approve',
    args: [spender, id, amount],
  })
  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}

export const setOperator = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, operator: string, approved: boolean) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_SET_OPERATOR,
    functionName: 'setOperator',
    args: [operator, approved],
  })
  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} receiver
 * @param {bigint} id
 * @param {bigint} amount
 */
export const transfer = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, receiver: string, id: bigint, amount: bigint) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_TRANSFER,
    functionName: 'transfer',
    args: [receiver, id, amount],
  })
  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}
