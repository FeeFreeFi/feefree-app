const ABI_MINT = [
  {
    name: "mint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "to",
				type: "address"
      }
    ],
    outputs: [],
  },
]

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
  }
]

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
 * @param {{publicClient: import('viem').PublicClient, walletClient: import('viem').WalletClient}} client
 * @param {string} address
 * @param {{value:bigint}} options
 */
export const mint = async ({ publicClient, walletClient }, address, { value }) => {
  const account = walletClient.account.address
  const { request } = await publicClient.simulateContract({
    account,
    address,
    abi: ABI_MINT,
    functionName: 'mint',
    args: [account],
    value,
  })
  const hash = await walletClient.writeContract(request)

  return { chainId: publicClient.chain.id, hash }
}
