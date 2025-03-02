<template>
  <div class="flex-y-center gap-1" :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer']" @click="onSelect">
    <div class="flex-y-center gap-2">
      <ZTokenIcon class="!size-6" :token="token" />
      <n-text class="font-medium text-sm" :depth="token ? undefined : 1">{{ token?.symbol || 'Select' }}</n-text>
    </div>
    <DownArrow />
  </div>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import DownArrow from '@/components/Arrow/DownArrow.vue'

interface Props {
  token?: Pick<Token, 'icon' | 'symbol'>
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  token: undefined,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'select'): void
}>()

const onSelect = () => {
  if (props.disabled) {
    return
  }

  emit('select')
}
</script>
