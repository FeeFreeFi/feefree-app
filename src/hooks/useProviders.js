import { ref } from "vue"
import uuid from "@/utils/uuid"

const providers = ref({})

export const getProviders = () => {
  const items = Object.values(providers.value)
  return items.length > 0 ? items : [getInjectedProvider()].filter(Boolean)
}

const getProviderMeta = provider => {
  if (provider.isApexWallet)
    return {
      name: "Apex Wallet",
      icon: "ApexWallet.svg",
    }
  if (provider.isBackpack)
    return {
      name: "Backpack",
      icon: "Injected.svg", // TODO: replace with Backpack icon
    }
  if (provider.isBifrost)
    return {
      name: "Bifrost Wallet",
      icon: "Bifrost.svg",
    }
  if (provider.isBitKeep)
    return {
      name: "Bitkeep",
      icon: "Bitkeep.svg",
    }
  if (provider.isBitski)
    return {
      name: "Bitski",
      icon: "Bitski.svg",
    }
  if (provider.isBlockWallet)
    return {
      name: "BlockWallet",
      icon: "BlockWallet.svg",
    }
  if (provider.isBraveWallet)
    return {
      name: "Brave Wallet",
      icon: "Brave.svg",
    }
  if (provider.isCoinbaseWallet)
    return {
      name: "Coinbase Wallet",
      icon: "Coinbase.svg",
    }
  if (provider.isAvalanche)
    return {
      name: "Core Wallet",
      icon: "Core.svg",
    }
  if (provider.isDawn)
    return {
      name: "Dawn Wallet",
      icon: "Injected.svg", // TODO: replace with Dawn Wallet icon
    }
  if (provider.isDefiant)
    return {
      name: "Defiant",
      icon: "Injected.svg", // TODO: replace with Defiant icon
    }
  if (provider.isEnkrypt)
    return {
      name: "Enkrypt",
      icon: "Enkrypt.svg",
    }
  if (provider.isExodus)
    return {
      name: "Exodus",
      icon: "Exodus.svg",
    }
  if (provider.isFrame)
    return {
      name: "Frame",
      icon: "Frame.svg",
    }
  if (provider.isFrontier)
    return {
      name: "Frontier Wallet",
      icon: "Frontier.svg",
    }
  if (provider.isGamestop)
    return {
      name: "GameStop Wallet",
      icon: "GameStop.svg",
    }
  if (provider.isHyperPay)
    return {
      name: "HyperPay Wallet",
      icon: "HyperPay.svg",
    }
  if (provider.isImToken)
    return {
      name: "imToken",
      icon: "imToken.svg",
    }
  if (provider.isHaloWallet)
    return {
      name: "Halo Wallet",
      icon: "Injected.svg", // TODO: replace with Halo Wallet icon
    }
  if (provider.isKuCoinWallet)
    return {
      name: "KuCoin Wallet",
      icon: "Injected.svg", // TODO: replace with KuCoin Wallet icon
    }
  if (provider.isMathWallet)
    return {
      name: "MathWallet",
      icon: "MathWallet.svg",
    }
  if (provider.isOkxWallet || provider.isOKExWallet)
    return {
      name: "OKX Wallet",
      icon: "OKX.svg",
    }
  if (provider.isOneInchIOSWallet || provider.isOneInchAndroidWallet)
    return {
      name: "1inch Wallet",
      icon: "1inch.svg",
    }
  if (provider.isOpera)
    return {
      name: "Opera",
      icon: "Opera.svg",
    }
  if (provider.isPhantom)
    return {
      name: "Phantom",
      icon: "Phantom.svg",
    }
  if (provider.isPortal)
    return {
      name: "Ripio Portal",
      icon: "Injected.svg", // TODO: replace with Ripio Portal icon
    }
  if (provider.isRabby)
    return {
      name: "Rabby Wallet",
      icon: "Rabby.svg",
    }
  if (provider.isRainbow)
    return {
      name: "Rainbow",
      icon: "Rainbow.svg",
    }
  if (provider.isStatus)
    return {
      name: "Status",
      icon: "Status.svg",
    }
  if (provider.isTalisman)
    return {
      name: "Talisman",
      icon: "Injected.svg", // TODO: replace with Ripio Portal icon
    }
  if (provider.isTally)
    return {
      name: "Taho",
      icon: "Taho.svg",
    }
  if (provider.isTokenPocket)
    return {
      name: "TokenPocket",
      icon: "TokenPocket.svg",
    }
  if (provider.isTokenary)
    return {
      name: "Tokenary",
      icon: "Tokenary.svg",
    }
  if (provider.isTrust || provider.isTrustWallet)
    return {
      name: "Trust",
      icon: "Trust.svg",
    }
  if (provider.isXDEFI)
    return {
      name: "xDefi",
      icon: "xDefi.svg",
    }
  if (provider.isZerion)
    return {
      name: "Zerion",
      icon: "Zerion.svg",
    }
  if (provider.isMetaMask)
    return {
      name: "MetaMask",
      icon: "MetaMask.svg",
    }
  return {
    name: "Injected",
    icon: "Injected.svg",
  }
}

const getInjectedProvider = () => {
  if (!window.ethereum) {
    return
  }

  const { name, icon } = getProviderMeta(window.ethereum)
  return {
    info: {
      uuid: uuid(16),
      name,
      icon: `/static/wallets/${icon}`,
    },
    provider: window.ethereum,
  }
}

const onAnnounceProvider = e => {
  const { info, provider } = e.detail
  if (!providers.value[info.uuid]) {
    providers.value = {
      ...providers.value,
      [info.uuid]: { info, provider },
    }
  }
}

const install = () => {
  window.addEventListener("eip6963:announceProvider", onAnnounceProvider)
  window.dispatchEvent(new Event("eip6963:requestProvider"))
}

export default install
