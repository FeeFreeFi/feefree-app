import type { PublicClient, WalletClient, Abi, Address, SendTransactionParameters } from "viem"
import { isNative } from '@/utils'

const ABI_NAME: Abi = [
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

const ABI_SYMBOL: Abi = [
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

const ABI_DEDIMALS: Abi = [
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

const ABI_BALANCE_OF: Abi = [
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

const ABI_ALLOWANCE: Abi = [
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

const ABI_APPROVE: Abi = [
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

const ABI_TRANSFER: Abi = [
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

export const name = async (publicClient: PublicClient, address: string) => {
  if (isNative(address)) {
    return publicClient.chain!.nativeCurrency.name
  }

  return publicClient.readContract({
    address: address as Address,
    abi: ABI_NAME,
    functionName: 'name',
  }) as Promise<string>
}

export const symbol = async (publicClient: PublicClient, address: string) => {
  if (isNative(address)) {
    return publicClient.chain!.nativeCurrency.symbol
  }

  return publicClient.readContract({
    address: address as Address,
    abi: ABI_SYMBOL,
    functionName: 'symbol',
  }) as Promise<string>
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @returns {Promise<bigint>}
 */
export const decimals = async (publicClient: PublicClient, address: string) => {
  if (isNative(address)) {
    return publicClient.chain!.nativeCurrency.decimals
  }

  const result = await publicClient.readContract({
    address: address as Address,
    abi: ABI_DEDIMALS,
    functionName: 'decimals',
  })

  return Number(result as bigint)
}

export const metadata = async (publicClient: PublicClient, address: string) => {
  if (isNative(address)) {
    return publicClient.chain!.nativeCurrency as { name: string, symbol: string, decimals: number }
  }

  const [_name, _symbol, _decimals] = await Promise.all([
    name(publicClient, address),
    symbol(publicClient, address),
    decimals(publicClient, address),
  ])

  return { name: _name, symbol: _symbol, decimals: _decimals }
}

export const totalSupply = async (publicClient: PublicClient, address: string) => {
  if (isNative(address)) {
    throw new Error("native currency does not support totalSupply")
  }

  return publicClient.readContract({
    address: address as Address,
    abi: ABI_TOTAL_SUPPLY,
    functionName: 'totalSupply',
  }) as Promise<bigint>
}

export const balanceOf = async (publicClient: PublicClient, address: string, account: string) => {
  if (isNative(address)) {
    return publicClient.getBalance({ address: account as Address })
  }

  return publicClient.readContract({
    address: address as Address,
    abi: ABI_BALANCE_OF,
    functionName: 'balanceOf',
    args: [account],
  }) as Promise<bigint>
}

export const allowance = async (publicClient: PublicClient, address: string, owner: string, spender: string) => {
  if (isNative(address)) {
    return MAX_BALANCE
  }

  return publicClient.readContract({
    address: address as Address,
    abi: ABI_ALLOWANCE,
    functionName: 'allowance',
    args: [owner, spender],
  }).catch(() => 0n) as Promise<bigint>
}

export const approve = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, spender: string, amount: bigint) => {
  if (isNative(address)) {
    throw new Error("native currency does not require approval")
  }

  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_APPROVE,
    functionName: 'approve',
    args: [spender, amount],
  })
  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}

export const transfer = async (client: { publicClient: PublicClient, walletClient: WalletClient }, address: string, to: string, amount: bigint) => {
  const { publicClient, walletClient } = client
  const account = walletClient.account!.address
  let hash

  if (isNative(address)) {
    hash = await walletClient.sendTransaction({
      account,
      to: to as Address,
      value: amount,
    } as SendTransactionParameters)
  } else {
    const { request } = await publicClient.simulateContract({
      account,
      address: address as Address,
      abi: ABI_TRANSFER,
      functionName: 'transfer',
      args: [to, amount],
    })
    hash = await walletClient.writeContract(request)
  }

  return { chainId: publicClient.chain!.id, hash }
}
