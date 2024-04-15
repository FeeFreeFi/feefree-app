<template>
  <ZModalWrapper :show="show" :on-close="onClose" modal-class="w-[440px]">
    <TokenSelectorView :current="current" :tokens="tokens" :on-select="onSelect" :on-close="onClose">
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
    /**
     * @type {import('vue').PropType<{chainId:number, name:string, symbol:string, address:string}>}
     */
    type: Object,
    required: true,
  },
  tokens: {
    /**
     * @type {import('vue').PropType<{chainId:number, name:string, symbol:string, address:string}[]>}
     */
    type: Array,
    required: true,
  },
  onSelect: {
    type: Function,
    required: true,
  }
})

const onClose = () => {
  show.value = false
}
</script>
