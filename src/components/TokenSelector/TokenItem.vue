<template>
  <div class="flex-y-center justify-between gap-4 bg-card/40 hover:bg-card/60 px-4 rounded h-16 transition-all cursor-pointer token-item" :class="[active ? '!bg-card/60' : '']" :aria-label="`Choose ${token.name}`">
    <div class="flex-y-center gap-2 shrink-0">
      <slot name="icon" :token="token">
        <ZTokenIcon class="!size-8" :token="token" />
      </slot>
      <div class="flex-y-center gap-[2px] w-[100px] shrink-0">
        <div class="flex flex-col gap-[2px] overflow-hidden">
          <n-text class="font-medium text-sm truncate" :class="[active ? 'text-primary' : '']">{{ token.name }}</n-text>
          <n-text class="text-xs" :class="[active ? 'text-primary/60' : '']" depth="2">{{ token.symbol }}</n-text>
        </div>
        <span class="flex-center opacity-0 size-4 transition-opacity cursor-pointer more-icon" @click.stop="() => openTokenMore(token)"><i-ff-info class="size-4 text-success/80" /></span>
      </div>
    </div>
    <div class="overflow-hidden">
      <ZBalance class="text-sm" :class="[active ? 'text-primary' : '']" :value="balance" :decimals="token.decimals" :dp="token.dp" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import ZBalance from '@/components/ZBalance.vue'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import { openTokenMore } from '@/hooks/useTokenMore'

interface Props {
  token: Token
  balance: bigint
  active: boolean
}

defineProps<Props>()
</script>

<style lang="scss">
.token-item {
  &:hover,
  &.active {
    .more-icon {
      opacity: 100;
    }
  }
}
</style>
