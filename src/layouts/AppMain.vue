<template>
  <main class="relative flex-1 mx-auto flex flex-col w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl px-4">
    <slot />
  </main>
</template>

<script setup>
import { watch, onMounted, onBeforeUnmount } from "vue"
import { useNotification } from "naive-ui"
import { login, refreshToken } from "@/api"
import { account, chainId, autoConnect, getWalletClient } from "@/hooks/useWallet"
import { findProvider } from "@/hooks/useProviders"
import { recentWallet } from "@/hooks/useConnecting"
import { signIn } from "@/hooks/useSignIn"
import { clearAuth, setAuth, isMatchAccount, getAccessToken, getRefreshToken, auth, loadAuth } from "@/hooks/useAuth"
import { fetchProfile, resetProfile } from "@/hooks/useUser"

const notification = useNotification()

const doAutoConnect = async () => {
  if (!recentWallet.value) {
    watchAccount()
    return
  }

  const walletName = recentWallet.value
  const provider = findProvider(walletName)
  if (!provider) {
    watchAccount()
    return
  }

  let success = await autoConnect(provider, walletName)
  watchAccount()

  if (!success) {
    return
  }

  if (isMatchAccount(account.value)) {
    if (getAccessToken()) {
      fetchProfile()
      return
    }

    success = await refresh()
    if (success) {
      return
    }
  }

  onAccountChanged()
}

const refresh = async () => {
  const res = await refreshToken({ refreshToken: getRefreshToken() })
  if (res.code !== 0) {
    clearAuth()
    console.warn(`refreshToken fail`)
    return false
  }

  setAuth(res.data)
  return true
}

const onAccountChanged = async () => {
  console.log("onAccountChanged")
  clearAuth()

  const walletClient = getWalletClient()
  const signData = await signIn({ walletClient }, chainId.value).catch(err => {
    notification.error({
      title: "Login fail",
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  })
  if (!signData) {
    return
  }

  const res = await login(signData)
  if (res.code !== 0) {
    notification.error({
      title: "Login fail",
      content: res.message,
      duration: 5000,
    })
    return
  }

  setAuth(res.data)
}

const watchAccount = () => {
  console.log("watchAccount")
  const stopWatch = watch(account, newAccount => {
    newAccount && onAccountChanged()
  })

  onBeforeUnmount(stopWatch)
}

onMounted(() => {
  loadAuth()
  doAutoConnect()
})

onMounted(() => {
  const stopWatch = watch(auth, newAuth => {
    newAuth ? fetchProfile() : resetProfile()
  })

  onBeforeUnmount(stopWatch)
})
</script>
