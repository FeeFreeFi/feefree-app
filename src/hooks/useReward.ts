import type { Abi, Address } from "viem"
import type { Reward } from "@/types"
import { getPublicClient } from "./useClient"
import { getWalletClient } from "./useWallet"

const ABI_IS_VALID: Abi = [
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

const ABI_CLAIM: Abi = [
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

export const isValidReward = async (chainId: number, address: string, account: string, amount: bigint, nonce: string, proof: string[]) => {
  const publicClient = getPublicClient(chainId)

  return publicClient.readContract({
    address: address as Address,
    abi: ABI_IS_VALID,
    functionName: 'isValid',
    args: [account, amount, nonce, proof],
  }) as Promise<boolean>
}

export const claim = async (reward: Reward) => {
  const { chainId, address, amount, nonce, proof } = reward

  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const amountValue = BigInt(amount)
  const account = walletClient.account!.address
  const { request } = await publicClient.simulateContract({
    account,
    address: address as Address,
    abi: ABI_CLAIM,
    functionName: 'claim',
    args: [amountValue, account, nonce, proof],
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain!.id, hash }
}
