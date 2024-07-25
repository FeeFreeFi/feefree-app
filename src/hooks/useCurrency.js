import {
  CHAIN_ID_ZORA,
  CHAIN_ID_BASE,
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"
import { getTxMeta } from "@/utils/chain"

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"
export const MAX_BALANCE = 115792089237316195423570985008687907853269984665640564039457584007913129639935n

const CONFIG = {
  [CHAIN_ID_ZORA]: [
    { name: "ETH", symbol: "ETH", key: "ETH", decimals: 18, dp: 4, address: ADDRESS_ZERO },
    { name: "ETH+", symbol: "ETH+", key: "ETH", decimals: 18, dp: 4, address: "0x28A46A961CDe54bCE2F428554fBE8AF040a67B47" },
    { name: "USD Coin", symbol: "USDzC", key: "USDC", decimals: 6, dp: 4, address: "0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4" },
    { name: "USDzC+", symbol: "USDzC+", key: "USDC", decimals: 6, dp: 4, address: "0x054757a979f77FD5B0c85679bbA73A92B0e773F4" },

    { name: "ETH-USDzC", symbol: "ETH-USDzC", key: "", decimals: 18, dp: 4, address: "0xE5bADF998f5c5828c139081f5510706f44B8E224" },
  ],
  [CHAIN_ID_BASE]: [
    { name: "ETH", symbol: "ETH", key: "ETH", decimals: 18, dp: 4, address: ADDRESS_ZERO },
    { name: "ETH+", symbol: "ETH+", key: "ETH", decimals: 18, dp: 4, address: "0x7370ECc5eE30152da5F1F4B9056DE2691627E59b" },
    { name: "USD Coin", symbol: "USDC", key: "USDC", decimals: 6, dp: 4, address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" },
    { name: "USDC+", symbol: "USDC+", key: "USDC", decimals: 6, dp: 4, address: "0x8a48D78a090D25E9aB276bA3b3f8408b215eF045" },

    { name: "ETH-USDC", symbol: "ETH-USDC", key: "", decimals: 18, dp: 4, address: "0x0501B40a851b75597cB83Bd702B646C74287d881" },
  ],
  [CHAIN_ID_BASE_SEPOLIA]: [
    { name: "ETH", symbol: "ETH", key: "ETH", decimals: 18, dp: 4, address: ADDRESS_ZERO },
    { name: "ETH+", symbol: "ETH+", key: "ETH", decimals: 18, dp: 4, address: "0xa5000DAfa02aCCec2D9b1C831e80Db5f679Dc4b2" },
    { name: "DAI", symbol: "DAI", key: "DAI", decimals: 18, dp: 4, address: "0x011a7b7AE1b7a4645c0341F980d0242e152Bf397" },
    { name: "DAI+", symbol: "DAI+", key: "DAI", decimals: 18, dp: 4, address: "0x62D244FafaBd48a63C40a2757B8a540e2047C502" },
    { name: "USDC", symbol: "USDC", key: "USDC", decimals: 6, dp: 4, address: "0xde649ebC41ADb57D6577EAB7BE7dd6FA65b555a3" },
    { name: "USDC+", symbol: "USDC+", key: "USDC", decimals: 6, dp: 4, address: "0x12C272Fc1c7A5dc78ddfA31795d0bFE10f0edF0D" },
    { name: "OP", symbol: "OP", key: "OP", decimals: 18, dp: 4, address: "0x115151b4C955900a132350fF9C1e3e412D8f83Dc" },
    { name: "OP+", symbol: "OP+", key: "OP", decimals: 18, dp: 4, address: "0x1afc24e1A519e1a56D88393f9EE7a61a67C5B4C4" },

    { name: "ETH-USDC", symbol: "ETH-USDC", key: "", decimals: 18, dp: 4, address: "0x827966E8615a9edffB362230769d98be28956eC2" },
    { name: "DAI-USDC", symbol: "DAI-USDC", key: "", decimals: 18, dp: 4, address: "0xC2AF4E5caA99A9009b6ce1dF6Ea5673F4e126706" },
    { name: "ETH-OP", symbol: "ETH-OP", key: "", decimals: 18, dp: 4, address: "0xC63b7E793332E10B0931A1B2Cb05daa13907d4d2" },
  ],
}

const CURRENCY_MAPS = Object.fromEntries(Object.entries(CONFIG).map(([chainId, tokens]) => {
  const id = parseInt(chainId)
  return [chainId, Object.fromEntries(tokens.map(t => [t.symbol, {...t, chainId: id}]))]
}))

const ALL_TOKEN_KEYS = (() => {
  let items = Object.values(CONFIG).map(tokens => {
    tokens = tokens.filter(token => !token.symbol.endsWith("+") && !token.symbol.includes("-"))
    return tokens.map(token => token.key)
  }).reduce((sum, item) => sum.concat(item), []).filter(Boolean)
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
 * @param {import('@/types').Token} a
 * @param {import('@/types').Token} b
 */
export const isSame = (a, b) => a.chainId === b.chainId && a.address === b.address

/**
 * @param {import('viem').PublicClient} publicClient
 * @param {string} address
 * @returns {Promise<bigint>}
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
  })
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient, overrides: Object}}
 * @param {string} address
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
 * @param {string} address
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

export const getAllTokenKeys = () => ALL_TOKEN_KEYS

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

export const getZoraToken = resolveTokenMeta(CHAIN_ID_ZORA)
export const getBaseToken = resolveTokenMeta(CHAIN_ID_BASE)
export const getBaseSepoliaToken = resolveTokenMeta(CHAIN_ID_BASE_SEPOLIA)
