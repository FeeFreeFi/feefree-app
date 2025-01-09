import type { WalletClient } from 'viem'
import { createSiweMessage, generateSiweNonce } from 'viem/siwe'
import { SIGN_EXPIRE } from '@/config'

export const signIn = async (walletClient: WalletClient, chainId: number, domain: string, origin: string) => {
  const account = walletClient.account!.address
  const nonce = generateSiweNonce()
  const timestamp = Date.now()
  const expire = SIGN_EXPIRE * 1000

  const message = createSiweMessage({
    version: '1',
    address: account,
    chainId,
    nonce,
    domain,
    uri: origin,
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
    origin,
  }
}
