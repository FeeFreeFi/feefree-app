import SafeAppsSDK from "@safe-global/safe-apps-sdk"
import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import uuid from "@/utils/uuid"
import { addWallet } from "./useWalletDetector"

export const loadSafeWallet = () => {
  const sdk = new SafeAppsSDK({
    allowedDomains: "*.blockscout.com",
    debug: false,
  })

  sdk.safe.getInfo().then(async safeInfo => {
    const { origin } = await sdk.safe.getEnvironmentInfo()

    const provider = new SafeAppProvider(safeInfo, sdk)
    const info = {
      uuid: uuid(16),
      name: "Safe",
      icon: "",
      origin,
      hidden: true,
    }

    addWallet(info, provider)
  })
}
