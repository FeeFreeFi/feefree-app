<template>
  <ZModalWrapper :show="show" :on-close="onClose" modal-class="w-[400px]">
    <TokenSelectorView :current="current" :on-select="onSelect" :on-close="onClose">
      <template #token="{token}">
        <slot name="token" :token="token" />
      </template>
    </TokenSelectorView>
  </ZModalWrapper>
</template>

<script setup>
import ZModalWrapper from "@/components/ZModalWrapper.vue"
import TokenSelectorView from "./TokenSelectorView.vue"

const show = defineModel("show", { type: Boolean, default: false })

defineProps({
  current: {
    /** @type {import('vue').PropType<import('@/types').Token>} */
    type: Object,
    default: () => null,
  },
  onSelect: {
    type: Function,
    required: true,
  },
})

const onClose = () => {
  show.value = false
}
</script>
