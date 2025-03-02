export enum kChain {
  mainnet = 1,
  optimism = 10,
  bsc = 56,
  polygon = 137,
  zksync = 324,
  polygonZkevm = 1101,
  base = 8453,
  arbtrum = 42161,
  linea = 59144,
  scroll = 534352,
  zora = 7777777,
}

export const URL_DISCORD = 'https://discord.gg/5WSNamMknK'
export const URL_TWITTER = 'https://x.com/FeeFreeFi'
export const URL_GITHUB = 'https://github.com/FeeFreeFi'

// 30s
export const SIGN_EXPIRE = 30

export const JWT_ISSUER = 'FeeFree'

export const CACHE_RECENT = 'recent'
export const CACHE_AUTH = 'auth'
export const CACHE_REFERRAL = 'referral'
export const CACHE_TOKENS = 'tokens'
export const CACHE_NOTICE = 'notice'

export const DATE_FORMAT_UTC = 'MMM D YYYY hh:mm:ss A (Z UTC)'
export const DATE_FORMAT_DEFAULT = 'YYYY-MM-DD HH:mm:ss UTC'

export enum kState {
  initial = 0,
  pending = 1,
  success = 2,
  fail = 3,
}

export const TOTAL_SUPPLY = 100000000000000000000000000n

export const SLIPPAGE = 50n

export const SAFE_APPS_DOMAINS = [
  'base.blockscout.com',
  'scroll.blockscout.com',
  'zksync.blockscout.com',
  'explorer.zora.energy',
  'explorer.linea.build',
]
