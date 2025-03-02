<template>
  <n-modal class="bg-dialog rounded-lg transition-all" :show="modelValue.show" :mask-closable="false" :auto-focus="false">
    <ZModalView class="w-[calc(100vw-32px)] sm:w-[400px] max-w-[400px] text-sm transition-all" :on-close="onClose">
      <template #title>
        <div class="flex-center gap-1">
          <i-ion-warning class="size-6 text-warning" />
          <n-text class="font-medium text-base">Value Change Reminder</n-text>
        </div>
      </template>
      <div class="relative flex flex-col gap-8 px-6 pt-2 pb-6">
        <div v-if="data" class="flex flex-col gap-2">
          <div class="flex-y-center justify-between bg-card/40 px-4 py-3 h-12">
            <div class="flex gap-2">
              <ZTokenIcon :token="data.inputToken" />
              <n-text class="text-sm">{{ data.inputToken.symbol }}</n-text>
            </div>
            <div class="flex gap-1">
              <ZTokenBalance class="text-font-90 !font-normal" :token="data.inputToken" :balance="data.amountIn" :show-symbol="screen.sm" />
              <n-text class="text-warning">(${{ formatPrice(data.inputValue) }})</n-text>
            </div>
          </div>
          <div class="flex-center">
            <i-mdi-chevron-double-down class="mx-2 size-6 text-primary" />
          </div>
          <div class="flex-y-center justify-between bg-card/40 px-4 py-3 h-12">
            <div class="flex gap-2">
              <ZTokenIcon :token="data.outputToken" />
              <n-text class="text-sm">{{ data.outputToken.symbol }}</n-text>
            </div>
            <div class="flex gap-1">
              <ZTokenBalance class="text-font-90 !font-normal" :token="data.outputToken" :balance="data.amountOut" :show-symbol="screen.sm" />
              <n-text class="text-error">(${{ formatPrice(data.outputValue) }})</n-text>
            </div>
          </div>
        </div>
        <div class="flex-center gap-6">
          <ZGhostButton class="flex-1 w-full h-10" @click="onCancel">Cancel</ZGhostButton>
          <ZButton class="flex-1 w-full h-10" @click="onContinue">Continue</ZButton>
        </div>
      </div>
    </ZModalView>
  </n-modal>
</template>

<script setup lang="ts">
import type { ValueChangedData } from '@/types'
import { formatPrice } from '@/utils'
import { screen } from '@/hooks/useScreen'
import ZModalView from '@/components/ZModalView.vue'
import ZButton from '@/components/ZButton.vue'
import ZGhostButton from '@/components/ZGhostButton.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'
import ZTokenIcon from '@/components/ZTokenIcon.vue'

interface Props {
  onConfirm: () => void
}

const props = defineProps<Props>()

const modelValue = defineModel<{ show: boolean, data?: ValueChangedData }>({ required: true })

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
