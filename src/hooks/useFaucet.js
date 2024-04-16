import { getTxMeta } from "@/utils/getTxMeta"
import {
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"
import { getBaseSepoliaToken } from "./useCurrency"

const CONFIG = [
  {
    chainId: CHAIN_ID_BASE_SEPOLIA,
    faucet: "0xA6B89e264DCdbC6B39e8c05FEe7Ce0F5911810bA",
    tokens: [
      getBaseSepoliaToken("USDC"),
      getBaseSepoliaToken("DAI"),
      getBaseSepoliaToken("OP"),
    ],
  },
]
const CONFIG_MAP = Object.fromEntries(CONFIG.map(c => [c.chainId, c]))

const ABI_SEND = [
  {
    inputs: [
      { name: "token", type: "address" },
      { name: "to", type: "address" }
    ],
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    name: "send"
  }
]

/**
 * @param {number} chainId
 */
export const getTokens = chainId => (CONFIG_MAP[chainId] || {}).tokens || []

/**
 * @param {number} chainId
 */
export const getFaucetAddress = chainId => CONFIG_MAP[chainId].faucet

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}}
 * @param {stirng} address
 * @param {stirng} token
 * @param {stirng} to
 */
export const send = async ({ publicClient, walletClient }, address, token, to) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_SEND,
    functionName: 'send',
    args: [token, to],
  })
  const hash = await walletClient.writeContract(request)

  return getTxMeta(hash, publicClient.chain)
}
