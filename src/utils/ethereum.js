export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

/**
 * @param {string} address
 */
export const isNative = address => !address || address === ADDRESS_ZERO

/**
 * @param {import('@/types').Token} a
 * @param {import('@/types').Token} b
 */
export const isSame = (a, b) => !!a && !!b && a.chainId === b.chainId && a.address === b.address

export const ETH = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
  dp: 8,
}
