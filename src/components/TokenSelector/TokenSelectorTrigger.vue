<template>
  <div class="flex-y-center gap-1" :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer']" @click="onSelect">
    <div class="flex-y-center gap-2">
      <ZTokenIcon class="!size-6" :token="token" />
      <n-text class="text-sm font-medium" :depth="token ? undefined : 1">{{ token?.symbol || 'Select' }}</n-text>
    </div>
    <DownArrow />
  </div>
</template>

<script setup>
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import DownArrow from "@/components/Arrow/DownArrow.vue"

const props = defineProps({
  token: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    default: () => null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["select"])

const onSelect = () => {
  if (props.disabled) {
    return
  }

  emit("select")
}
</script>
