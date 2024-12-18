<template>
  <div class="token-item h-16 flex-y-center justify-between px-4 gap-4 rounded cursor-pointer transition-all bg-card/40 hover:bg-card/60" :class="[active ? '!bg-card/60' : '']" :aria-label="`Choose ${token.name}`">
    <div class="shrink-0 flex-y-center gap-2">
      <slot name="icon" :token="token">
        <ZTokenIcon class="!size-8" :token="token" />
      </slot>
      <div class="w-[100px] shrink-0 flex-y-center gap-[2px]">
        <div class="flex flex-col gap-[2px] overflow-hidden">
          <n-text class="text-sm font-medium truncate" :class="[active ? 'text-primary' : '']">{{ token.name }}</n-text>
          <n-text class="text-xs" :class="[active ? 'text-primary/60' : '']" depth="2">{{ token.symbol }}</n-text>
        </div>
        <span class="more-icon cursor-pointer size-4 flex-center opacity-0 transition-opacity" @click.stop="() => openTokenMore(token)"><i-ff-info class="size-4 text-success/80" /></span>
      </div>
    </div>
    <div class="overflow-hidden">
      <ZBalance class="text-sm" :class="[active ? 'text-primary' : '']" :value="balance" :decimals="token.decimals" :dp="token.dp" />
    </div>
  </div>
</template>

<script setup>
import ZBalance from "@/components/ZBalance.vue"
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import { openTokenMore } from "@/hooks/useTokenMore"

defineProps({
  token: {
    /** @type {import('vue').PropType<import('@/types').Token>} */
    type: Object,
    required: true,
  },
  balance: {
    /** @type {import('vue').PropType<bigint>} */
    type: BigInt,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
})
</script>

<style lang="scss">
.token-item {
  &:hover, &.active {
    .more-icon {
      opacity: 100;
    }
  }
}
</style>
