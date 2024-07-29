<template>
  <div class="flex-y-center gap-1" :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer']" @click="onSelect">
    <div class="flex-y-center gap-2">
      <ZPlusTokenIcon token-class="!size-6 sm:!size-7" :token="token" />
      <ZTokenSymbol v-if="token" :symbol="token.symbol" />
      <n-text v-else class="font-medium" depth="1">Select</n-text>
    </div>
    <DownArrow />
  </div>
</template>

<script setup>
import ZTokenSymbol from "@/components/ZTokenSymbol.vue"
import DownArrow from "@/components/Arrow/DownArrow.vue"
import ZPlusTokenIcon from '@/components/ZPlusTokenIcon.vue'

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
