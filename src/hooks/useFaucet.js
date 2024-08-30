import { getTxMeta } from "@/utils/chain"
import {
  CHAIN_ID_BASE_SEPOLIA,
} from "@/config"
import { getBaseSepoliaToken } from "./useCurrency"

const CONFIG = {
  chainId: CHAIN_ID_BASE_SEPOLIA,
  faucet: "0xA6B89e264DCdbC6B39e8c05FEe7Ce0F5911810bA",
  tokens: [
    getBaseSepoliaToken("USDC"),
    getBaseSepoliaToken("DAI"),
    getBaseSepoliaToken("OP"),
  ],
}

const SUPPORTED_CHAINS = [{ chainId: CONFIG.chainId }]

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

export const getSupportedChains = () => SUPPORTED_CHAINS

/**
 * @param {number} chainId
 */
export const isSupportChain = chainId => !!SUPPORTED_CHAINS.find(it => it.chainId === chainId)

export const getTokens = () => CONFIG.tokens

export const getFaucetAddress = () => CONFIG.faucet

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} token
 * @param {string} to
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
