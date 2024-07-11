import { createSiweMessage, generateSiweNonce } from 'viem/siwe'
import { SIGN_IN_DOMAIN, SIGN_IN_URL, SIGN_EXPIRE } from '@/config'

/**
 * @param {{walletClient: import('viem').WalletClient}}
 * @param {number} chainId
 */
export const signIn = async ({ walletClient }, chainId) => {
  const account = walletClient.account.address
  const nonce = generateSiweNonce()
  const timestamp = Date.now()
  const expire = SIGN_EXPIRE

  const message = createSiweMessage({
    version: '1',
    address: account,
    chainId,
    nonce,
    domain: SIGN_IN_DOMAIN,
    uri: SIGN_IN_URL,
    issuedAt: new Date(timestamp),
    expirationTime: new Date(timestamp + expire),
  })
  const signature = await walletClient.signMessage({ account, message })

  return {
    account,
    chainId,
    nonce,
    timestamp,
    expire,
    signature,
  }
}

/**
 * @param {{publicClient: import('viem').PublicClient}}
 * @param {import('@/types').SignatureData} data
 * @param {string} signature
 */
export const verifySignIn = async ({ publicClient }, data, signature) => {
  const { account, chainId, nonce, timestamp, expire } = data
  const message = createSiweMessage({
    version: '1',
    address: account,
    chainId,
    nonce,
    domain: SIGN_IN_DOMAIN,
    uri: SIGN_IN_URL,
    issuedAt: new Date(timestamp),
    expirationTime: new Date(timestamp + expire),
  })

  return publicClient.verifySiweMessage({ message, signature })
}
