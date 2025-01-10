import SafeAppsSDK from '@safe-global/safe-apps-sdk'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import { SAFE_APPS_DOMAINS } from '@/config'
import { uuid } from '@/utils'
import { addWallet } from './useWalletDetector'

export const loadSafeWallet = () => {
  const allowedDomains = SAFE_APPS_DOMAINS.map(domain => new RegExp(domain))

  const sdk = new SafeAppsSDK({ allowedDomains, debug: false })

  sdk.safe.getInfo().then(async safeInfo => {
    const { origin } = await sdk.safe.getEnvironmentInfo()

    const provider = new SafeAppProvider(safeInfo, sdk)
    const info = {
      uuid: uuid(16),
      name: 'Safe',
      icon: '',
      origin,
      hidden: true,
    }

    addWallet(info, provider)
  })
}
