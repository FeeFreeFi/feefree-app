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
    { name: "ETH+", symbol: "ETH+", decimals: 18, dp: 4, address: "0x809E595538B64485584e9106c1Ba5Dbb000217d0" },
    { name: "USD Coin", symbol: "USDzC", decimals: 6, dp: 4, address: "0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4" },

    { name: "ETH-USDzC", symbol: "ETH-USDzC", decimals: 18, dp: 4, address: "0xf85e2820394e7bb7036acC2Bf02613150950986A" },
  ],
  [CHAIN_ID_BASE_SEPOLIA]: [
    { name: "ETH", symbol: "ETH", decimals: 18, dp: 4, address: ADDRESS_ZERO },
    { name: "ETH+", symbol: "ETH+", decimals: 18, dp: 4, address: "0xC6cBf086f8ef9917A2DdB1A3a10d4d9160197aBC" },
    { name: "DAI", symbol: "DAI", decimals: 18, dp: 4, address: "0x011a7b7AE1b7a4645c0341F980d0242e152Bf397" },
    { name: "DAI+", symbol: "DAI+", decimals: 18, dp: 4, address: "0x7F3A32b6E31fC4e6b661355E072094123529eBE6" },
    { name: "USDC", symbol: "USDC", decimals: 18, dp: 4, address: "0x0176660853E243A49B3C1C27584f056788f5223b" },
    { name: "USDC+", symbol: "USDC+", decimals: 18, dp: 4, address: "0x9d78B19F1416459E8F57c4A0D4526c716A5aFB1f" },
    { name: "OP", symbol: "OP", decimals: 18, dp: 4, address: "0x115151b4C955900a132350fF9C1e3e412D8f83Dc" },
    { name: "OP+", symbol: "OP+", decimals: 18, dp: 4, address: "0xBE2a7aa0c10DaC352EEF7be45a82a665823C626e" },

    { name: "USDC-OP", symbol: "USDC-OP", decimals: 18, dp: 4, address: "0x2441279e54f417674030381d68876C3F0196bDaC" },
    { name: "DAI-USDC", symbol: "DAI-USDC", decimals: 18, dp: 4, address: "0x035b54810241249f048822efFF2Fdc4cdd3cd12e" },
    { name: "ETH-OP", symbol: "ETH-OP", decimals: 18, dp: 4, address: "0x6a28D73C4957aC9b04b3948C795061b3b710d51d" },
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
