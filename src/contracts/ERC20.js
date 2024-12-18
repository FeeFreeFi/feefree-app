import { isNative } from '@/utils/ethereum'

const ABI_NAME = [
  {
    type: 'function',
    name: 'name',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        type: 'string',
      },
    ],
  },
]

const ABI_SYMBOL = [
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        type: 'string',
      },
    ],
  },
]

const ABI_DEDIMALS = [
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        type: 'uint8',
      },
    ],
  },
]

const ABI_TOTAL_SUPPLY = [
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

const ABI_BALANCE_OF = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [
      {
        name: 'account',
        type: 'address',
      },
    ],
    outputs: [
      {
        type: 'uint256',
      },
    ],
  },
]

const ABI_ALLOWANCE = [
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'spender',
        type: 'address',
      },
    ],
    outputs: [
      {
        type: 'uint256',
      },
    ],
  },
]

const ABI_APPROVE = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'spender',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        type: 'bool',
      },
    ],
  },
]

const ABI_TRANSFER = [
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'recipient',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        type: 'bool',
      },
    ],
  },
]

const MAX_BALANCE = 115792089237316195423570985008687907853269984665640564039457584007913129639935n

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @returns {Promise<string>}
 */
export const name = async (publicClient, address) => {
  if (isNative(address)) {
    return publicClient.chain.nativeCurrency.name
  }

  return publicClient.readContract({
    address,
    abi: ABI_NAME,
    functionName: 'name',
  })
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @returns {Promise<string>}
 */
export const symbol = async (publicClient, address) => {
  if (isNative(address)) {
    return publicClient.chain.nativeCurrency.symbol
  }

  return publicClient.readContract({
    address,
    abi: ABI_SYMBOL,
    functionName: 'symbol',
  })
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @returns {Promise<bigint>}
 */
export const decimals = async (publicClient, address) => {
  if (isNative(address)) {
    return publicClient.chain.nativeCurrency.decimals
  }

  return publicClient.readContract({
    address,
    abi: ABI_DEDIMALS,
    functionName: 'decimals',
  })
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @returns {Promise<import('@/types').TokenMetadata>}
 */
export const metadata = async (publicClient, address) => {
  if (isNative(address)) {
    return publicClient.chain.nativeCurrency
  }

  const [_name, _symbol, _decimals] = await Promise.all([
    name(publicClient, address),
    symbol(publicClient, address),
    decimals(publicClient, address),
  ])

  return { name: _name, symbol: _symbol, decimals: _decimals }
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @returns {Promise<bigint>}
 */
export const totalSupply = async (publicClient, address) => {
  if (isNative(address)) {
    throw new Error("native currency does not support totalSupply")
  }

  return publicClient.readContract({
    address,
    abi: ABI_TOTAL_SUPPLY,
    functionName: 'totalSupply',
  })
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} account
 * @returns {Promise<bigint>}
 */
export const balanceOf = async (publicClient, address, account) => {
  if (isNative(address)) {
    return publicClient.getBalance({ address: account })
  }

  return publicClient.readContract({
    address,
    abi: ABI_BALANCE_OF,
    functionName: 'balanceOf',
    args: [account],
  })
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @param {string} owner
 * @param {string} spender
 * @returns {Promise<bigint>}
 */
export const allowance = async (publicClient, address, owner, spender) => {
  if (isNative(address)) {
    return MAX_BALANCE
  }

  return publicClient.readContract({
    address,
    abi: ABI_ALLOWANCE,
    functionName: 'allowance',
    args: [owner, spender],
  }).catch(() => 0n)
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} spender
 * @param {bigint} amount
 */
export const approve = async ({ publicClient, walletClient }, address, spender, amount) => {
  if (isNative(address)) {
    throw new Error("native currency does not require approval")
  }

  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_APPROVE,
    functionName: 'approve',
    args: [spender, amount],
  })
  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} to
 * @param {bigint} amount
 */
export const transfer = async ({ publicClient, walletClient }, address, to, amount) => {
  const account = walletClient.account.address
  let hash

  if (isNative(address)) {
    hash = await walletClient.sendTransaction({
      account,
      to,
      value: amount,
    })
  } else {
    const { request } = await publicClient.simulateContract({
      account,
      address,
      abi: ABI_TRANSFER,
      functionName: 'transfer',
      args: [to, amount],
    })
    hash = await walletClient.writeContract(request)
  }

  return { chainId: publicClient.chain.id, hash }
}
