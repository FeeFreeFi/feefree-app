import { getTxMeta } from "@/utils/chain"
import {
  CHAIN_ID_ZORA,
  // CHAIN_ID_BASE,
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"
import {
  getZoraToken,
  // getBaseToken,
  getBaseSepoliaToken,
  isNative,
} from "./useCurrency"

const CONFIG = [
  {
    chainId: CHAIN_ID_ZORA,
    pairs: [
      {
        currency0: getZoraToken("ETH"),
        currency1: getZoraToken("ETH+"),
      },
      {
        currency0: getZoraToken("USDzC"),
        currency1: getZoraToken("USDzC+"),
      },
    ],
  },
  // {
  //   chainId: CHAIN_ID_BASE,
  //   pairs: [
  //     {
  //       currency0: getBaseToken("ETH"),
  //       currency1: getBaseToken("ETH+"),
  //     },
  //     {
  //       currency0: getBaseToken("USDC"),
  //       currency1: getBaseToken("USDC+"),
  //     },
  //   ],
  // },
  {
    chainId: CHAIN_ID_BASE_SEPOLIA,
    pairs: [
      {
        currency0: getBaseSepoliaToken("ETH"),
        currency1: getBaseSepoliaToken("ETH+"),
      },
      {
        currency0: getBaseSepoliaToken("USDC"),
        currency1: getBaseSepoliaToken("USDC+"),
      },
      {
        currency0: getBaseSepoliaToken("DAI"),
        currency1: getBaseSepoliaToken("DAI+"),
      },
      {
        currency0: getBaseSepoliaToken("OP"),
        currency1: getBaseSepoliaToken("OP+"),
      },
    ],
  },
]
const ALL_PAIRS_MAP = Object.fromEntries(CONFIG.map(c => [c.chainId, c.pairs]))
const IS_EXCHANGE_TOKENS = Object.fromEntries(CONFIG.map(c => [c.chainId, Object.fromEntries(c.pairs.map(p => [p.currency1.address, true]))]))
const SUPPORTED_CHAINS = CONFIG.map(c => ({ chainId: c.chainId }))

const ABI_EXCHANGE = [
  {
    type: "function",
    name: "exchange",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "currency", type: "address" },
          { name: "amountSpecified", type: "int128" },
          { name: "to", type: "address" }
        ]
      }
    ],
    outputs: [],
    stateMutability: "payable"
  }
]

export const getSupportedChains = () => SUPPORTED_CHAINS

/**
 * @param {number} chainId
 */
export const isSupportChain = chainId => !!SUPPORTED_CHAINS.find(it => it.chainId === chainId)

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}}
 * @param {string} address
 * @param {string} currency
 * @param {bigint} amountSpecified
 * @param {string} to
 * @param {bigint} fee
 */
export const exchange = async ({ publicClient, walletClient }, address, currency, amountSpecified, to, fee) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_EXCHANGE,
    functionName: 'exchange',
    args: [{ currency, amountSpecified, to }],
    value: amountSpecified < 0 && isNative(currency) ? -amountSpecified + fee : fee,
  })
  const hash = await walletClient.writeContract(request)

  return getTxMeta(hash, publicClient.chain)
}

/**
 * @param {number} chainId
 */
export const getPairs = chainId => ALL_PAIRS_MAP[chainId] || []

/**
 * @param {import('@/types').Token} token
 */
export const isExchangeToken = token => IS_EXCHANGE_TOKENS[token.chainId][token.address]

/**
 * @param {import('@/types').Token} token
 */
export const findOtherToken = token => {
  const pairs = getPairs(token.chainId)
  const pair = pairs.find(p => p.currency0.address === token.address || p.currency1.address === token.address)
  return pair.currency0.address === token.address ? pair.currency1 : pair.currency0
}
