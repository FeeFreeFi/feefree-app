<template>
  <div class="margin-center w-full max-w-[400px] p-8 flex-center flex-col gap-8 bg-container rounded-20">
    <div class="flex-center gap-3">
      <i-my-faucet class="size-6" />
      <n-text class="text-base font-semibold">Test Tokens Faucet</n-text>
    </div>
    <div class="flex flex-col items-center gap-4">
      <ZButton class="w-48" v-for="item, index in tokens" :key="index" @click="() => onSend(item)">Send {{ item.symbol }}</ZButton>
    </div>
    <div class="flex-center">
      <router-link class="no-underline" :to="{ name: PAGE_HOME }">
        <ZGhostButton class="w-36" aria-label="Back">Back</ZGhostButton>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue"
import { useNotification } from "naive-ui"
import { PAGE_HOME } from "@/config"
import { getTokens, send, getFaucetAddress } from "@/hooks/useFaucet"
import { account, getWalletClient, updateBalance as updateNativeBalance } from "@/hooks/useWallet"
import { getPublicClient } from "@/hooks/useClient"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { waitTx } from "@/hooks/useWaitTx"
import { open as openWalletConnector } from "@/hooks/useWalletConnector"
import { doSwitchNetwork } from "@/hooks/useInteraction"
import ZGhostButton from '@/components/ZGhostButton.vue'
import ZButton from '@/components/ZButton.vue'

const notification = useNotification()

const loading = ref(false)
const tokens = getTokens()

const switching = ref(false)

/**
 * @param {number} chainId
 */
 const onSwitchNetwork = chainId => doSwitchNetwork(notification, switching, chainId)

const reset = () => {
  loading.value = false
  switching.value = false
}

const onSend = async token => {
  if (!account.value) {
    openWalletConnector()
    return
  }

  const { address: tokenAddress, chainId: id, symbol } = token
  if (id !== selectedChainId.value) {
    const success = await onSwitchNetwork(id)
    if (!success) {
      return
    }
  }

  const faucetAddress = getFaucetAddress()
  loading.value = true
  try {
    const publicClient = getPublicClient(id)
    const walletClient = getWalletClient()
    const tx = await send(
      { publicClient, walletClient },
      faucetAddress,
      tokenAddress,
      account.value
    )
    await waitTx(notification, tx, 'Success', `Send ${symbol}`)
    loading.value = false
    updateNativeBalance()
  } catch (err) {
    loading.value = false
    notification.error({
      title: `Send ${symbol} fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  }
}

onMounted(() => {
  const stopWatch = watch([account, selectedChainId], () => {
    reset()
    updateNativeBalance()
  })

  onBeforeUnmount(stopWatch)
})
</script>
