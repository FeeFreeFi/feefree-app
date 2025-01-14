import type { PoolKey, PoolMeta, Token } from '@/types'
import { CHAIN_ID_ZORA, CHAIN_ID_BASE } from '@/config'
import { unexchange as _unexchange, removeLiquidity as _removeLiquidity, migrateLiquidity as _migrateLiquidity } from '@/contracts/Migration'
import { getPublicClient } from './useClient'
import { getWalletClient } from './useWallet'

type PoolOld = PoolMeta & { key: PoolKey }
type PoolLegacy = PoolMeta & { key: PoolKey, liquidity: Token }
interface Config {
  chainId: number
  address: string
  poolOld?: PoolOld
  poolLegacy?: PoolLegacy
  tokens: (Token & { origin: string })[]
  fee: bigint
}

const CONFIGS: Record<number, Config> = {
  [CHAIN_ID_ZORA]: {
    chainId: CHAIN_ID_ZORA,
    address: '0x6F6E1e534a6aCBD061Dcf65C6556EBc5C02188dA',
    poolOld: {
      id: '0x85d7c77a7be4efb3230243bc3a2d9a0da017dce05d2ba5b5693e4d10aeac86c8',
      chainId: CHAIN_ID_ZORA,
      currency0: { chainId: CHAIN_ID_ZORA, address: '0x0000000000000000000000000000000000000000', name: 'ETH', symbol: 'ETH', decimals: 18, dp: 4, icon: 'ETH.svg' },
      currency1: { chainId: CHAIN_ID_ZORA, address: '0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4', name: 'USDzC', symbol: 'USDzC', decimals: 6, dp: 4, icon: 'USDzC.svg' },
      key: { currency0: '0x0000000000000000000000000000000000000000', currency1: '0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4', fee: 0n, tickSpacing: 60n, hooks: '0x880305bC69C3bC1514bc899e9F203a02B1670145' },
    },
    poolLegacy: {
      id: '0x7df8cbf90f39146ab3dbfe6b0cf9a883446f146c7d9ba2399031e15cfee6a895',
      chainId: CHAIN_ID_ZORA,
      currency0: { chainId: CHAIN_ID_ZORA, address: '0x0000000000000000000000000000000000000000', name: 'ETH', symbol: 'ETH', decimals: 18, dp: 4, icon: 'ETH.svg' },
      currency1: { chainId: CHAIN_ID_ZORA, address: '0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4', name: 'USDzC', symbol: 'USDzC', decimals: 6, dp: 4, icon: 'USDzC.svg' },
      key: { currency0: '0x0000000000000000000000000000000000000000', currency1: '0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4', fee: 0x800000n, tickSpacing: 60n, hooks: '0x0Fee97363deEFBE4De038D437D805A98dbEbA400' },
      liquidity: { chainId: CHAIN_ID_ZORA, address: '0xE5bADF998f5c5828c139081f5510706f44B8E224', name: 'ETH-USDzC', symbol: 'ETH-USDzC', decimals: 18, dp: 4 },
    },
    tokens: [
      { chainId: CHAIN_ID_ZORA, address: '0x28A46A961CDe54bCE2F428554fBE8AF040a67B47', name: 'ETH+', symbol: 'ETH+', decimals: 18, dp: 4, icon: 'ETH.svg', origin: '0x0000000000000000000000000000000000000000' },
      { chainId: CHAIN_ID_ZORA, address: '0x054757a979f77FD5B0c85679bbA73A92B0e773F4', name: 'USDzC+', symbol: 'USDzC+', decimals: 6, dp: 4, icon: 'USDzC.svg', origin: '0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4' },
    ],
    fee: 60000000000000n,
  },
  [CHAIN_ID_BASE]: {
    chainId: CHAIN_ID_BASE,
    address: '0xDCE4D09cb72799a7f23657D2418BFeD50Bfa2e29',
    poolOld: {
      id: '0x827dd334e9419bfb49e25e65f94e20d52b78f6e155330c43d95d6747b59463b9',
      chainId: CHAIN_ID_BASE,
      currency0: { chainId: CHAIN_ID_BASE, address: '0x0000000000000000000000000000000000000000', name: 'ETH', symbol: 'ETH', decimals: 18, dp: 4, icon: 'ETH.svg' },
      currency1: { chainId: CHAIN_ID_BASE, address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', name: 'USD Coin', symbol: 'USDC', decimals: 6, dp: 4, icon: 'USDC.svg' },
      key: { currency0: '0x0000000000000000000000000000000000000000', currency1: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', fee: 0n, tickSpacing: 60n, hooks: '0x5738b20EF74f941CAdce55Ef18ADc41734Fc0145' },
    },
    poolLegacy: {
      id: '0x9532d36802d2394beedee1165fe1c0cb008a19cf3eab78410b7b2ea2cd885880',
      chainId: CHAIN_ID_BASE,
      currency0: { chainId: CHAIN_ID_BASE, address: '0x0000000000000000000000000000000000000000', name: 'ETH', symbol: 'ETH', decimals: 18, dp: 4, icon: 'ETH.svg' },
      currency1: { chainId: CHAIN_ID_BASE, address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', name: 'USD Coin', symbol: 'USDC', decimals: 6, dp: 4, icon: 'USDC.svg' },
      key: { currency0: '0x0000000000000000000000000000000000000000', currency1: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', fee: 0n, tickSpacing: 60n, hooks: '0x0000000000000000000000000000000000000000' },
      liquidity: { chainId: CHAIN_ID_BASE, address: '0x60d7D35232D178BaE9B082210B2A12C004127c70', name: 'ETH-USDC', symbol: 'ETH-USDC', decimals: 18, dp: 4 },
    },
    tokens: [
      { chainId: CHAIN_ID_BASE, address: '0x7395160D0b882c5C8123Ed612fa355eE61259da5', name: 'ETH+', symbol: 'ETH+', decimals: 18, dp: 4, icon: 'ETH.svg', origin: '0x0000000000000000000000000000000000000000' },
      { chainId: CHAIN_ID_BASE, address: '0x2cF1F206C55C75bbB621b961Bd0fA17AEbbcD32F', name: 'USDC+', symbol: 'USDC+', decimals: 6, dp: 4, icon: 'USDC.svg', origin: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
      { chainId: CHAIN_ID_BASE, address: '0x14a760e4D05a04bFbd6e5cB9114626ACDb342ca8', name: 'DAI+', symbol: 'DAI+', decimals: 18, dp: 4, icon: 'DAI.svg', origin: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' },
    ],
    fee: 60000000000000n,
  },
}

export const getMigration = (chainId: number) => CONFIGS[chainId]

export const unexchange = async (token: Pick<Token, 'chainId' | 'address'>) => {
  const { chainId } = token
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const { address: migration, fee } = getMigration(chainId)

  return _unexchange({ publicClient, walletClient }, migration, token.address, { value: fee })
}

export const removeLiquidity = async (chainId: number, key: PoolKey) => {
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const { address: migration } = getMigration(chainId)

  return _removeLiquidity({ publicClient, walletClient }, migration, key)
}

export const migrateLiquidity = async (chainId: number, key: PoolKey) => {
  const publicClient = getPublicClient(chainId)
  const walletClient = getWalletClient()
  const { address: migration } = getMigration(chainId)

  return _migrateLiquidity({ publicClient, walletClient }, migration, key)
}
