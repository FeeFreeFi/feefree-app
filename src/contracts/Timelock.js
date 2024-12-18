const ABI_LOCK = [
  {
    inputs: [
      {
        name: "token",
        type: "address"
      },
      {
        name: "from",
        type: "address"
      },
      {
        name: "tokenId",
        type: "uint256"
      },
      {
        name: "amount",
        type: "uint256"
      },
      {
        name: "unlockTime",
        type: "uint256"
      },
      {
        name: "owner",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "lock",
    outputs: [
      {
        type: "bytes32"
      }
    ]
  },
]

const ABI_UNLOCK = [
  {
    inputs: [
      {
        name: "lockId",
        type: "bytes32"
      },
      {
        name: "recipient",
        type: "address"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    name: "unlock"
  }
]

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} token
 * @param {string} from
 * @param {string} tokenId
 * @param {bigint} amount
 * @param {number} unlockTime
 * @param {string} owner
 */
export const lock = async ({ publicClient, walletClient }, address, token, from, tokenId, amount, unlockTime, owner) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_LOCK,
    functionName: 'lock',
    args: [token, from, tokenId, amount, unlockTime, owner],
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}

/**
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {string} lockId
 * @param {string} recipient
 */
export const unlock = async ({ publicClient, walletClient }, address, lockId, recipient) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_UNLOCK,
    functionName: 'unlock',
    args: [lockId, recipient],
  })

  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}
