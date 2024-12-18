import { Patterns } from "@/config"
import { base58, bytesToString, stringToBytes } from "@scure/base"

/**
 * @param {number} chainId
 * @param {string} poolId
 */
export const encodePoolId = (chainId, poolId) => {
  let chainIdHex = chainId.toString(16)
  chainIdHex = chainIdHex.length % 2 === 0 ? chainIdHex : `0${chainIdHex}`

  const hex = `${chainIdHex}${poolId.slice(2)}`
  return base58.encode(stringToBytes("hex", hex))
}

/**
 * @param {string} id
 */
export const decodePoolId = id => {
  if (!Patterns.POOL_ID.test(id)) {
    return { valid: false }
  }

  const hex = bytesToString("hex", base58.decode(id))
  const chainId = parseInt(hex.slice(0, -64), 16)
  const poolId = `0x${hex.slice(hex.length - 64)}`

  return { valid: true, chainId, poolId }
}
