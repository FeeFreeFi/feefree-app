<template>
  <div class="flex flex-col py-6 sm:py-10">
    <div class="mx-auto relative w-full sm:w-[520px] h-[428px] sm:h-[488px]">
      <ZSectionView>
        <!-- header -->
        <div class="h-10 flex-y-center justify-between">
          <n-text class="text-xl sm:text-2xl font-medium">Test Tokens Faucet</n-text>
        </div>
        <div class="mt-4 flex flex-col gap-4">
          <n-button v-for="item, index in tokens" :key="index" @click="() => onSend(item)">Send {{ item.symbol }}</n-button>
        </div>
      </ZSectionView>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useNotification } from "naive-ui"
import { getTokens, send, getFaucetAddress } from "@/hooks/useFaucet"
import { account, getWalletClient, switchChain, updateBalance as updateNativeBalance } from "@/hooks/useWallet"
import { getPublicClient } from "@/hooks/useClient"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { waitTx } from "@/hooks/useWaitTx"
import { open as openWalletConnector } from "@/hooks/useWalletConnector"
import ZSectionView from '@/components/ZSectionView.vue'
import { getChainName } from "@/hooks/useChains"

const notification = useNotification()

const loading = ref(false)
const switching = ref(false)
const tokens = computed(() => getTokens(selectedChainId.value))

const reset = () => {
  loading.value = false
  switching.value = false
}

const onSwitchNetwork = async id => {
  try {
    switching.value = true
    await switchChain(id)
    switching.value = false
  } catch (err) {
    switching.value = false
    notification.error({
      title: `Switch to ${getChainName(id)} fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  }
}

const onSend = async token => {
  if (!account.value) {
    openWalletConnector()
    return
  }

  const { address: tokenAddress, chainId: id, symbol } = token
  if (id !== selectedChainId.value) {
    onSwitchNetwork(id)
    return
  }

  loading.value = true
  try {
    const publicClient = getPublicClient(id)
    const walletClient = getWalletClient()
    const tx = await send(
      { publicClient, walletClient },
      getFaucetAddress(id),
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
  })

  onBeforeUnmount(stopWatch)
})
</script>