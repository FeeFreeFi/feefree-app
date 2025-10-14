<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useNotification } from 'naive-ui'
import { wait } from '@/utils'
import { account, autoConnect } from '@/hooks/useWallet'
import { findWallet } from '@/hooks/useWalletDetector'
import { visibility } from '@/hooks/usePage'
import { recentWallet } from '@/hooks/useConnecting'
import { login, refreshToken } from '@/hooks/useLogin'
import { clearAuth, isMatchAccount, getAccessToken, auth, loadAuth } from '@/hooks/useAuth'
import { fetchProfile, resetProfile, saveReferral } from '@/hooks/useUser'
import { fetchConfig } from '@/hooks/useConfig'
import { createPriceState } from '@/hooks/usePrices'
import { loadSafeWallet } from '@/hooks/useSafeWallet'

const route = useRoute()
const notification = useNotification()

async function doLogin() {
  await login().catch(err => {
    notification.error({
      title: `Login`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  })
}

function watchAccount() {
  watch([account, visibility], ([newAccount, newVisibility], [oldAccount]) => {
    if (newAccount) {
      if (newAccount !== oldAccount) {
        clearAuth()
      }

      if (newVisibility && !auth.value) {
        doLogin()
      }
    }
  })
}

async function loadProfile() {
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

async function doAutoConnect() {
  await wait(100)

  const name = recentWallet.value || 'Safe'
  const wallet = findWallet(name)
  if (!wallet) {
    watchAccount()
    return
  }

  const success = await autoConnect(wallet)
  watchAccount()

  if (success) {
    loadProfile()
  }
}

onBeforeMount(() => {
  fetchConfig()
  createPriceState()
  loadSafeWallet()
})

onMounted(() => {
  loadAuth()
  doAutoConnect()

  const { referral } = route.query
  if (referral) {
    saveReferral(referral as string)
  }
})

onMounted(() => {
  const stopWatch = watch(auth, newAuth => {
    if (newAuth) {
      fetchProfile()
    }
    else {
      resetProfile()
    }
  })

  onBeforeUnmount(stopWatch)
})
</script>

<template>
  <main class="relative flex flex-col flex-1 mx-auto px-4 w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-2xl xl:max-w-screen-xl">
    <slot />
  </main>
</template>
