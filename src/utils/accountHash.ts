import { hashMessage } from 'viem'
import { base58 } from '@scure/base'

const fromHexString = (hexString: string) => {
  return Uint8Array.from(Array.from(hexString.match(/.{1,2}/g) || []).map(byte => Number.parseInt(byte, 16)))
}

const getAccountHash = (account: string) => {
  return base58.encode(fromHexString(hashMessage(account.toLowerCase()).slice(2)))
}

export const getAccountId = (account: string) => {
  return getAccountHash(account).slice(0, 8)
}

export const getAccountReferral = (account: string) => {
  return getAccountHash(account).slice(-8)
}

export const isSelfAccount = (account: string, id: string) => {
  return getAccountId(account) === id
}

export const isSelfReferral = (account: string, referral: string) => {
  return getAccountReferral(account) === referral
}
