const ABI_BALANCE_OF = [
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

const ABI_ALLOWANCE = [
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

const ABI_IS_OPERATOR = [
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

const ABI_SET_OPERATOR = [
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

const ABI_APPROVE = [
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

const ABI_TRANSFER = [
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

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} owner
 * @param {bigint} id
 * @returns {Promise<bigint>}
 */
export const balanceOf = async (publicClient, address, owner, id) => {
  return publicClient.readContract({
    address,
    abi: ABI_BALANCE_OF,
    functionName: 'balanceOf',
    args: [owner, id],
  })
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} owner
 * @param {string} spender
 * @param {bigint} id
 * @returns {Promise<bigint>}
 */
export const allowance = async (publicClient, address, owner, spender, id) => {
  return publicClient.readContract({
    address,
    abi: ABI_ALLOWANCE,
    functionName: 'allowance',
    args: [owner, spender, id],
  }).catch(() => 0n)
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} owner
 * @param {string} spender
 * @returns {Promise<boolean>}
 */
export const isOperator = async (publicClient, address, owner, spender) => {
  return publicClient.readContract({
    address,
    abi: ABI_IS_OPERATOR,
    functionName: 'isOperator',
    args: [owner, spender],
  })
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} spender
 * @param {bigint} id
 * @param {bigint} amount
 */
export const approve = async ({ publicClient, walletClient }, address, spender, id, amount) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_APPROVE,
    functionName: 'approve',
    args: [spender, id, amount],
  })
  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} operator
 * @param {boolean} approved
 */
export const setOperator = async ({ publicClient, walletClient }, address, operator, approved) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_SET_OPERATOR,
    functionName: 'setOperator',
    args: [operator, approved],
  })
  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} receiver
 * @param {bigint} id
 * @param {bigint} amount
 */
export const transfer = async ({ publicClient, walletClient }, address, receiver, id, amount) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_TRANSFER,
    functionName: 'transfer',
    args: [receiver, id, amount],
  })
  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}
