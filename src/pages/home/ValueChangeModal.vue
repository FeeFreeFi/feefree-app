<template>
  <n-modal class="bg-dialog rounded-lg transition-all" :show="modelValue.show" :mask-closable="false" :auto-focus="false">
    <ZModalView class="max-w-[400px] w-[calc(100vw-32px)] sm:w-[400px] text-sm transition-all" :on-close="onClose">
      <template #title>
        <div class="flex-center gap-1">
          <i-ion-warning class="size-6 text-warning" />
          <n-text class="text-base font-medium">Value Change Reminder</n-text>
        </div>
      </template>
      <div class="px-6 pt-4 pb-8 flex flex-col gap-8 relative">
        <div class="flex flex-col gap-2" v-if="data">
          <div class="h-12 flex-y-center justify-between px-4 py-3 bg-card/40">
            <div class="flex gap-2">
              <ZTokenIcon :token="data.inputToken" />
              <ZTokenSymbol class="!font-normal" :symbol="data.outputToken.symbol" />
            </div>
            <div class="flex gap-1">
              <ZTokenBalance class="!font-normal text-basic/90" :token="data.inputToken" :balance="data.amountIn" :show-symbol="screen.sm" />
              <n-text class="text-warning">(${{ formatPrice(data.inputValue) }})</n-text>
            </div>
          </div>
          <div class="flex-center">
            <i-mdi-chevron-double-down class="size-6 mx-2 text-basic" />
          </div>
          <div class="h-12 flex-y-center justify-between px-4 py-3 bg-card/40">
            <div class="flex gap-2">
              <ZTokenIcon :token="data.outputToken" />
              <ZTokenSymbol class="!font-normal" :symbol="data.outputToken.symbol" />
            </div>
            <div class="flex gap-1">
              <ZTokenBalance class="!font-normal text-basic/90" :token="data.outputToken" :balance="data.amountOut" :show-symbol="screen.sm" />
              <n-text class="text-error">(${{ formatPrice(data.outputValue) }})</n-text>
            </div>
          </div>
        </div>
        <div class="flex-center gap-6">
          <ZGhostButton class="flex-1 h-10 w-full" @click="onCancel">Cancel</ZGhostButton>
          <ZButton class="flex-1 h-10 w-full" @click="onContinue">Continue</ZButton>
        </div>
      </div>
    </ZModalView>
  </n-modal>
</template>

<script setup>
import { computed } from "vue"
import formatPrice from "@/utils/formatPrice"
import { screen } from "@/hooks/useScreen"
import ZModalView from "@/components/ZModalView.vue"
import ZButton from "@/components/ZButton.vue"
import ZGhostButton from "@/components/ZGhostButton.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import ZTokenIcon from "@/components/ZTokenIcon.vue"
import ZTokenSymbol from "@/components/ZTokenSymbol.vue"

/**
 * @type {import('vue').ModelRef<{show:boolean, data:import('@/types').ValueChangedData}>}
 */
const modelValue = defineModel({
  type: Object,
  required: true,
})

const props = defineProps({
  onConfirm: {
    type: Function,
    required: true,
  },
})

const data = computed(() => modelValue.value.data)

const onClose = () => {
  modelValue.value = {
    ...modelValue.value,
    show: false,
  }
}

const onCancel = () => {
  onClose()
}

const onContinue = () => {
  const { onConfirm } = props

  onClose()
  onConfirm()
}
</script>
