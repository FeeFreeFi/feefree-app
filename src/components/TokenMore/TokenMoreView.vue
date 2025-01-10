<template>
  <ZModalView :on-close="onClose">
    <div class="h-full flex flex-col px-4 pt-8 pb-6 relative">
      <!-- Token icon name symbol -->
      <div class="px-4 flex-y-center gap-3">
        <ZTokenIcon class="!size-8" :token="token" />
        <div class="w-20 flex flex-col gap-[2px]">
          <n-text class="font-medium">{{ token.name }}</n-text>
          <n-text class="text-xs" depth="2">{{ token.symbol }}</n-text>
        </div>
      </div>
      <!-- Add to wallet & View on explorer -->
      <div class="mt-4 h-16 flex bg-card rounded-lg">
        <div v-if="!isNative(token.address)" class="flex-1 flex-y-center px-4 gap-2 cursor-pointer !text-primary/80" @click="onAddToWallet">
          <i-ff-wallet class="size-5" />
          <n-text class="text-sm text-inherit">Add to wallet</n-text>
        </div>
        <div v-if="!isNative(token.address)" class="w-[1px] h-8 bg-dialog self-center" />
        <ZViewUrl class="flex-1 px-4 text-sm !text-primary/80" icon-class="!size-5" :url="getViewUrl(token)" :underline="false" />
      </div>
      <!-- Price & Balance -->
      <div class="mt-3 flex gap-3">
        <div class="flex-1 flex flex-col p-4 gap-3 bg-box rounded-lg">
          <n-text class="text-xs" depth="1">Price</n-text>
          <n-text class="text-sm">${{ formatPrice(price) }}</n-text>
        </div>
        <div class="flex-1 flex flex-col p-4 gap-3 bg-box rounded-lg overflow-hidden">
          <n-text class="text-xs" depth="1">Balance</n-text>
          <div class="flex gap-[2px] text-sm">
            <ZBalance :value="balance" :decimals="token.decimals" :dp="token.dp" />
            <n-text>{{ token.symbol }}</n-text>
          </div>
        </div>
      </div>
      <div class="mt-3 flex flex-col p-4 gap-3 bg-card rounded-lg text-sm overflow-hidden">
        <div class="flex justify-between gap-2">
          <n-text depth="1">Decimals:</n-text>
          <n-text>{{ token.decimals }}</n-text>
        </div>
        <div class="flex justify-between gap-2">
          <n-text depth="1">Address:</n-text>
          <div class="flex-y-center gap-2">
            <n-text>{{ shortString(token.address) }}</n-text>
            <ZCopyable class="flex justify-end cursor-pointer" :text="token.address">
              <template #copied>
                <div class="flex-y-center gap-1" aria-label="Copy address">
                  <span aria-label="Copied">
                    <i-ff-success class="size-4" />
                  </span>
                </div>
              </template>
              <div class="flex-y-center gap-1" aria-label="Copy address">
                <span aria-label="Copy">
                  <i-ff-copy class="size-4 text-primary/80" />
                </span>
              </div>
            </ZCopyable>
          </div>
        </div>
        <div class="flex justify-between gap-2">
          <n-text class="shrink-0" depth="1">Total Supply:</n-text>
          <div v-if="isNative(token.address)" class="flex text-sm">
            <n-text>N/A</n-text>
          </div>
          <div v-else class="flex gap-[2px] text-sm overflow-hidden">
            <ZBalance :value="total" :decimals="token.decimals" :dp="0" />
            <n-text>{{ token.symbol }}</n-text>
          </div>
        </div>
      </div>
    </div>
  </ZModalView>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useNotification } from 'naive-ui'
import { shortString, formatPrice, isNative } from '@/utils'
import { account, getWalletClient, walletChainId } from '@/hooks/useWallet'
import { balanceOf, totalSupply } from '@/hooks/useToken'
import { getAccountUrl, getHolderUrl } from '@/hooks/useChains'
import ZModalView from '@/components/ZModalView.vue'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import ZBalance from '@/components/ZBalance.vue'
import ZCopyable from '@/components/ZCopyable.vue'
import ZViewUrl from '@/components/ZViewUrl.vue'
import { open as openWalletConnector } from '@/hooks/useWalletConnector'
import { doSwitchNetwork } from '@/hooks/useInteraction'
import { getPrice } from '@/hooks/usePrices'

const props = defineProps({
  token: {
    /** @type {import('vue').PropType<import('@/types').Token>} */
    type: Object,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
})

const notification = useNotification()

const balance = ref(0n)
const total = ref(0n)
const price = computed(() => getPrice(props.token.key))

const getViewUrl = computed(() => {
  /**
   * @param {import('@/types').Token} token
   */
  return token => {
    if (isNative(token.address)) {
      return account.value ? getAccountUrl(token.chainId, account.value) : ''
    }

    return getHolderUrl(token.chainId, token.address, account.value)
  }
})

const onAddToWallet = async () => {
  if (!account.value) {
    openWalletConnector()
    return
  }

  const { token } = props
  if (walletChainId.value !== token.chainId) {
    const success = await doSwitchNetwork(notification, token.chainId)
    if (!success) {
      return
    }
  }

  const { address, decimals, symbol } = token
  const walletClient = getWalletClient()
  await walletClient.watchAsset({
    type: 'ERC20',
    options: { address, decimals, symbol },
  })
}

const updateBalance = async () => {
  balance.value = account.value ? await balanceOf(props.token, account.value) : 0n
}

onMounted(async () => {
  watch(account, updateBalance)

  updateBalance()
  total.value = await totalSupply(props.token)
})
</script>
