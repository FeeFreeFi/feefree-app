import {
  CHAIN_ID_ZORA,
  CHAIN_ID_BASE,
  CHAIN_ID_SCROLL,
} from "@/config"
import { getTxMeta } from "./useChains"
import { getPublicClient } from "./useClient"

const CONFIG = [
  {
    chainId: CHAIN_ID_ZORA,
    address: "0xCfAece28407Ad6F4bde8D58Bc2C0ce53C89f8158",
  },
  {
    chainId: CHAIN_ID_BASE,
    address: "0x14CEa96bf423cf47468821bdDF37058Bf1BCB5e5",
  },
  {
    chainId: CHAIN_ID_SCROLL,
    address: "0x22A00B46D10fb6d6aEE3c4deeE48871a1AAfA406",
  },
]
const CONFIG_MAP = Object.fromEntries(CONFIG.map(c => [c.chainId, c]))

const ABI_CLAIM = [
  {
    name: "claim",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "amount",
				type: "uint256"
      },
      {
        name: "to",
				type: "address"
      },
      {
        name: "nonce",
				type: "bytes32"
      },
      {
        name: "proof",
				type: "bytes32[]"
      }
    ],
    outputs: [],
  },
]

/**
 * @param {number} chainId
 */
export const getClaimAddress = chainId => CONFIG_MAP[chainId]?.address || ''

/**
 * @param {string} account
 * @param {number} chainId
 * @param {bigint} amount
 * @param {string} nonce
 * @param {string[]} proof
 */
export const isValidRebate = async (account, chainId, amount, nonce, proof) => {
  const publicClient = getPublicClient(chainId)
  const address = getClaimAddress(chainId)

  const res = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_CLAIM,
    functionName: 'claim',
    args: [amount, account, nonce, proof],
  }).catch(() => false)

  return !!res
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {bigint} amount
 * @param {string} to
 * @param {string} nonce
 * @param {string[]} proof
 */
export const claim = async ({ publicClient, walletClient }, address, amount, to, nonce, proof) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_CLAIM,
    functionName: 'claim',
    args: [amount, to, nonce, proof],
  })

  const hash = await walletClient.writeContract(request)

  return getTxMeta(publicClient.chain.id, hash)
}
