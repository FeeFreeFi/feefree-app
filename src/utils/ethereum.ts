import type { Token } from '@/types'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const isNative = (address: string) => !address || address === ADDRESS_ZERO

export const isSame = (a: Token, b: Token) => !!a && !!b && a.chainId === b.chainId && a.address === b.address

export const ETH = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
  dp: 8,
}
