import { hashMessage } from "viem"
import { base58 } from "@scure/base"

const fromHexString = hexString => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))

/**
 * @param {string} account
 */
const getAccountHash = account => {
  return base58.encode(fromHexString(hashMessage(account.toLowerCase()).slice(2)))
}

/**
 * @param {string} account
 */
const getAccountId = account => {
  return getAccountHash(account).slice(0, 8)
}

/**
 * @param {string} account
 */
const getAccountReferral = account => {
  return getAccountHash(account).slice(-8)
}

/**
 * @param {string} account
 * @param {string} id
 */
export const isSelfAccount = (account, id) => {
  return getAccountId(account) === id
}

/**
 * @param {string} account
 * @param {string} referral
 */
export const isSelfReferral = (account, referral) => {
  return getAccountReferral(account) === referral
}
