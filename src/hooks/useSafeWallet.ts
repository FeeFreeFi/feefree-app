// import SafeAppsSDK from '@safe-global/safe-apps-sdk'
// import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import { SAFE_APPS_DOMAINS } from '@/config'
import { uuid } from '@/utils'
import { addWallet } from './useWalletDetector'

export async function loadSafeWallet() {
  if (!SAFE_APPS_DOMAINS.includes(window.location.host)) {
    return
  }

  const allowedDomains = SAFE_APPS_DOMAINS.map(domain => new RegExp(domain))

  // const SafeAppsSDK = await import('@safe-global/safe-apps-sdk').then(mod => mod.default)
  // const SafeAppProvider = await import('@safe-global/safe-apps-provider').then(mod => mod.SafeAppProvider)

  const [{ default: SafeAppsSDK }, { SafeAppProvider }] = await Promise.all([
    import('@safe-global/safe-apps-sdk'),
    import('@safe-global/safe-apps-provider'),
  ])

  const sdk = new SafeAppsSDK({ allowedDomains, debug: false })

  sdk.safe.getInfo().then(async safeInfo => {
    const { origin } = await sdk.safe.getEnvironmentInfo()

    const provider = new SafeAppProvider(safeInfo, sdk)
    const info = {
      id: uuid(16),
      name: 'Safe',
      icon: '',
      origin,
      hidden: true,
    }

    addWallet(info, provider)
  })
}
