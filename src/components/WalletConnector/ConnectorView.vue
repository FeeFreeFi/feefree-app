<template>
  <ZModalView class="h-[480px]" title="Connect Wallet" :on-close="onClose">
    <div class="h-full relative">
      <div v-if="wallets.length > 0" class="size-full absolute top-0 left-0">
        <n-scrollbar class="p-4">
          <div class="flex flex-col gap-2">
            <WalletItem v-for="item, index in wallets" :key="index" :name="item.info.name" :icon="item.info.icon" :active="isActive(item)" :recent="isRecent(item)" @click="() => onConnect(item)" />
          </div>
        </n-scrollbar>
      </div>
      <NoWallet v-else />
    </div>
  </ZModalView>
</template>

<script setup>
import { computed } from "vue"
import { useNotification } from "naive-ui"
import { wait } from "@/utils"
import { getWallets } from "@/hooks/useWalletDetector"
import { connect } from "@/hooks/useWallet"
import { appChainId } from "@/hooks/useAppState"
import { connecting, reset, connectingWallet, recentWallet, setRecent } from "@/hooks/useConnecting"
import ZModalView from '@/components/ZModalView.vue'
import WalletItem from "./WalletItem.vue"
import NoWallet from "./NoWallet.vue"

const notification = useNotification()

const props = defineProps({
  onClose: {
    type: Function,
    required: true,
  },
})

const wallets = getWallets()

const isActive = computed(() => wallet => connectingWallet.value?.info.name === wallet.info.name)
const isRecent = computed(() => wallet => recentWallet.value === wallet.info.name)

const onConnect = async wallet => {
  try {
    connecting(wallet)
    await wait(300)
    const success = await connect(wallet, appChainId.value)
    if (success) {
      setRecent(wallet.info.name)
      props.onClose()
    }
  } catch (err) {
    reset()

    notification.error({
      title: `Connect ${wallet.info.name} fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  }
}
</script>
