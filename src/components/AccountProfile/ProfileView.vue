<template>
  <div class="h-11 flex-y-center">
    <ZChainIcon class="mr-2 size-7" :chain-id="chainId" />
    <div class="flex-1">
      <div class="flex gap-1">
        <n-text class="cursor-default text-sm font-semibold flex-1">{{ shortString(account) }}</n-text>
        <ZCopyable :text="account">
          <template #copied>
            <n-button class="size-6 px-0 rounded" size="tiny" tertiary type="success" aria-label="copied">
              <i-mdi-checkbox-marked-circle class="size-4" />
            </n-button>
          </template>
          <n-button class="size-6 px-0 rounded" size="tiny" tertiary aria-label="copy">
            <n-text class="text-color-3">
              <i-mdi-content-copy class="size-4" />
            </n-text>
          </n-button>
        </ZCopyable>
        <n-button class="size-6 px-0 rounded" size="tiny" tertiary aria-label="exit" @click="onDisconnect">
          <n-text type="error">
            <i-mdi-exit-to-app class="size-4" />
          </n-text>
        </n-button>
      </div>
      <n-text class="cursor-default text-xs font-medium flex-y-center whitespace-nowrap text-color-3">
        <span>{{ chainName }}</span>
        <span class="mx-1 size-[2px] rounded-full bg-[currentColor]"></span>
        <ZTokenBalance class="text-color-3" :balance="balance" :token="nativeCurrency" :dp="6" />
      </n-text>
    </div>
  </div>
</template>

<script setup>
import shortString from "@/utils/shortString"
import { account, balance, chainId, disconnect, nativeCurrency } from '@/hooks/useWallet'
import ZCopyable from "@/components/ZCopyable.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import ZChainIcon from "@/components/ZChainIcon.vue"

const props = defineProps({
  onClose: {
    type: Function,
    required: true,
  },
})

const onDisconnect = () => {
  disconnect()
  props.onClose()
}
</script>
