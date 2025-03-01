import type { EIP1193ProviderLegacy, EIP6963AnnounceProviderEvent } from './index.d'

declare global {
  interface Window {
    ethereum: EIP1193ProviderLegacy
  }

  interface WindowEventMap {
    'eip6963:announceProvider': EIP6963AnnounceProviderEvent
  }

  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    [key: string]: string | undefined
  }

  const process: {
    env: ProcessEnv
  }
}

export {}
