import type { EIP1193ProviderLegacy } from "./index.d"

declare global {
  interface Window {
    ethereum: EIP1193ProviderLegacy;
    addEventListener(event: 'eip6963:announceProvider', listener: (event: CustomEvent) => void): void;
  }
}
