import {
  CHAIN_ID_ZORA,
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"
import { getTxMeta } from "@/utils/getTxMeta"

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"
export const MAX_BALANCE = 115792089237316195423570985008687907853269984665640564039457584007913129639935n

const CONFIG = {
  [CHAIN_ID_ZORA]: [
    { name: "ETH", symbol: "ETH", decimals: 18, dp: 4, address: ADDRESS_ZERO },
    { name: "ETH+", symbol: "ETH+", decimals: 18, dp: 4, address: "0x28A46A961CDe54bCE2F428554fBE8AF040a67B47" },
    { name: "USD Coin", symbol: "USDzC", decimals: 6, dp: 4, address: "0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4" },
    { name: "USDzC+", symbol: "USDzC+", decimals: 6, dp: 4, address: "0x054757a979f77FD5B0c85679bbA73A92B0e773F4" },

    { name: "ETH-USDzC", symbol: "ETH-USDzC", decimals: 18, dp: 4, address: "0xE5bADF998f5c5828c139081f5510706f44B8E224" },
  ],
  [CHAIN_ID_BASE_SEPOLIA]: [
    { name: "ETH", symbol: "ETH", decimals: 18, dp: 4, address: ADDRESS_ZERO },
    { name: "ETH+", symbol: "ETH+", decimals: 18, dp: 4, address: "0xa16Cbcf0055253Bd0BE2462e44A4681aB35a037D" },
    { name: "DAI", symbol: "DAI", decimals: 18, dp: 4, address: "0x011a7b7AE1b7a4645c0341F980d0242e152Bf397" },
    { name: "DAI+", symbol: "DAI+", decimals: 18, dp: 4, address: "0x77BB288E9FC7dfA7945EA6D7F3BAC16e65cea29D" },
    { name: "USDC", symbol: "USDC", decimals: 6, dp: 4, address: "0xde649ebC41ADb57D6577EAB7BE7dd6FA65b555a3" },
    { name: "USDC+", symbol: "USDC+", decimals: 6, dp: 4, address: "0x30E9c1e5db4d058155B5815A189832A6CE53a60c" },
    { name: "OP", symbol: "OP", decimals: 18, dp: 4, address: "0x115151b4C955900a132350fF9C1e3e412D8f83Dc" },
    { name: "OP+", symbol: "OP+", decimals: 18, dp: 4, address: "0xe5bA0c314F65F631527e372c6333bD863fC06378" },

    { name: "ETH-USDC", symbol: "ETH-USDC", decimals: 18, dp: 4, address: "0xF4f111d4365C4d6068fa96b69E42A22ef8f97A93" },
    { name: "DAI-USDC", symbol: "DAI-USDC", decimals: 18, dp: 4, address: "0x709b8236fFA91e575aa6F1acD1CA79838b346d4D" },
    { name: "ETH-OP", symbol: "ETH-OP", decimals: 18, dp: 4, address: "0x725e1b056eDA1Ec88903aB803db006c63131e6A5" },
  ],
}

const CURRENCY_MAPS = Object.fromEntries(Object.entries(CONFIG).map(([chainId, tokens]) => {
  const id = parseInt(chainId)
  return [chainId, Object.fromEntries(tokens.map(t => [t.symbol, {...t, chainId: id}]))]
}))

const ALL_SYMBOLS = (() => {
  let items = Object.values(CONFIG).map(tokens => {
    tokens = tokens.filter(token => !token.symbol.endsWith("+") && !token.symbol.includes("-"))
    return tokens.map(token => token.symbol)
  }).reduce((sum, item) => sum.concat(item), [])
  items = [...new Set(items)]
  return items
})()

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

/**
 * @param {string} address
 */
export const isNative = address => !address || address === ADDRESS_ZERO

/**
 * @param {{chainId:number, address:string}} a
 * @param {{chainId:number, address:string}} b
 */
export const isSame = (a, b) => a.chainId === b.chainId && a.address === b.address

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {stirng} address
 * @returns {bigint}
 */
export const totalSupply = async (publicClient, address) => {
  return publicClient.readContract({
    address,
    abi: ABI_TOTAL_SUPPLY,
    functionName: 'totalSupply',
  })
}

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {stirng} address
 * @param {string} account
 * @returns {bigint}
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
 * @param {stirng} address
 * @param {string} owner
 * @param {string} spender
 * @returns {bigint}
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
  })
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient, overrides: Object}}
 * @param {stirng} address
 * @param {string} spender
 * @param {bigint} value
 */
export const approve = async ({ publicClient, walletClient, overrides }, address, spender, value) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_APPROVE,
    functionName: 'approve',
    args: [spender, value],
  })
  const hash = await walletClient.writeContract({ ...request, ...overrides })

  return getTxMeta(hash, publicClient.chain)
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient, overrides: Object}}
 * @param {stirng} address
 * @param {string} to
 * @param {bigint} value
 */
export const transfer = async ({ publicClient, walletClient, overrides }, address, to, value) => {
  const account = walletClient.account.address
  let hash

  if (isNative(address)) {
    hash = await walletClient.sendTransaction({
      account,
      to,
      value,
      ...overrides,
    })
  } else {
    const { request } = await publicClient.simulateContract({
      account,
      address,
      abi: ABI_TRANSFER,
      functionName: 'transfer',
      args: [to, value],
    })
    hash = await walletClient.writeContract({ ...request, ...overrides })
  }

  return getTxMeta(hash, publicClient.chain)
}

export const getAllSymbols = () => ALL_SYMBOLS

/**
 * @param {number} chainId
 * @param {string} symbol
 */
const getTokenMeta = (chainId, symbol) => {
  return CURRENCY_MAPS[chainId][symbol]
}

/**
 * @param {number} chainId
 */
export const resolveTokenMeta = chainId => {
  /**
   * @param {string} symbol
   */
  return symbol => getTokenMeta(chainId, symbol)
}

export const getBaseSepoliaToken = resolveTokenMeta(CHAIN_ID_BASE_SEPOLIA)
export const getZoraToken = resolveTokenMeta(CHAIN_ID_ZORA)
