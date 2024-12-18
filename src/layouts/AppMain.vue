<template>
  <main class="relative flex-1 mx-auto flex flex-col w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl px-4">
    <slot />
  </main>
</template>

<script setup>
import { watch, onBeforeMount, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import { useNotification } from "naive-ui"
import { account, autoConnect } from "@/hooks/useWallet"
import { findProvider } from "@/hooks/useProviders"
import { visibility } from "@/hooks/usePage"
import { recentWallet } from "@/hooks/useConnecting"
import { login, refreshToken } from "@/hooks/useLogin"
import { clearAuth, isMatchAccount, getAccessToken, auth, loadAuth } from "@/hooks/useAuth"
import { fetchProfile, resetProfile, saveReferral } from "@/hooks/useUser"
import { fetchConfig } from "@/hooks/useConfig"
import { createPriceState } from "@/hooks/usePrices"

const route = useRoute()
const notification = useNotification()

const doLogin = async () => {
  await login().catch(err => {
    notification.error({
      title: `Login`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  })
}

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

  const success = await autoConnect(provider, walletName)
  watchAccount()

  success && loadProfile()
}

const loadProfile = async () => {
  if (isMatchAccount(account.value)) {
    if (!getAccessToken()) {
      await refreshToken()
    }

    if (getAccessToken()) {
      fetchProfile()
      return
    }
  }

  clearAuth()
  doLogin()
}

const watchAccount = () => {
  watch([account, visibility], ([newAccount, newVisibility], [oldAccount])=> {
    if (newAccount) {
      if (newAccount !== oldAccount) {
        clearAuth()
      }

      newVisibility && !auth.value && doLogin()
    }
  })
}

onBeforeMount(() => {
  fetchConfig()
  createPriceState()
})

onMounted(() => {
  loadAuth()
  doAutoConnect()

  const { referral } = route.query
  referral && saveReferral(referral)
})

onMounted(() => {
  const stopWatch = watch(auth, newAuth => {
    newAuth ? fetchProfile() : resetProfile()
  })

  onBeforeUnmount(stopWatch)
})
</script>
