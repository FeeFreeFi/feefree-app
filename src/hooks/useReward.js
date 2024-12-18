import { getPublicClient } from "./useClient"
import { getWalletClient } from "./useWallet"

const ABI_IS_VALID = [
  {
    name: "isValid",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "account",
        type: "address"
      },
      {
        name: "amount",
				type: "uint256"
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
    outputs: [
      {
        name: "",
				type: "bool",
      }
    ],
  },
]

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
 * @param {string} address
 * @param {string} account
 * @param {bigint} amount
 * @param {string} nonce
 * @param {string[]} proof
 * @returns {Promise<boolean>}
 */
export const isValidReward = async (chainId, address, account, amount, nonce, proof) => {
  const publicClient = getPublicClient(chainId)

  return publicClient.readContract({
    address,
    abi: ABI_IS_VALID,
    functionName: 'isValid',
    args: [account, amount, nonce, proof],
  })
}

/**
 * @param {import('@/types').Reward} reward
 */
export const claim = async reward => {
  const { chainId, address, amount, nonce, proof } = reward

  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const amountValue = BigInt(amount)
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_CLAIM,
    functionName: 'claim',
    args: [amountValue, account, nonce, proof],
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}
