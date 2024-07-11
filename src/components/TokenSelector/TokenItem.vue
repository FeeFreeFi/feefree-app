<template>
  <div class="h-16 flex-y-center justify-between px-4 gap-4 rounded cursor-pointer transition-all bg-card/40 hover:bg-card/60" :class="[active ? '!bg-card/60' : '']" :aria-label="`Choose ${token.name}`">
    <div class="shrink-0 flex-y-center gap-3">
      <slot name="icon" :token="token">
        <ZTokenIcon class="!size-8" :token="token" />
      </slot>
      <div class="w-20 flex flex-col gap-[2px]">
        <n-text class="font-medium" :class="[active ? 'text-primary' : '']">{{ token.name }}</n-text>
        <n-text class="text-xs" :class="[active ? 'text-primary/60' : '']" depth="2">{{ token.symbol }}</n-text>
      </div>
    </div>
    <div class="overflow-hidden">
      <ZTokenBalance v-if="showBalance" class="text-sm" :class="[active ? 'text-primary' : '']" :show-symbol="false" :token="token" :balance="balance" />
      <n-text v-else class="font-medium" :class="[active ? 'text-primary' : '']">{{ chainName }}</n-text>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { getChainName } from "@/hooks/useChains"
import ZTokenIcon from "@/components/ZTokenIcon.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"

const props = defineProps({
  token: {
    /**
     * @type {import('vue').PropType<{symbol:string, decimals:number, dp:number}>}
     */
    type: Object,
    required: true,
  },
  balance: {
    /**
     * @type {import('vue').PropType<bigint>}
     */
    type: BigInt,
    required: true,
  },
  showBalance: {
    type: Boolean,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
})

const chainName = computed(() => getChainName(props.token.chainId))
</script>
