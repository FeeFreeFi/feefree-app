<template>
  <n-modal class="bg-dialog rounded-lg transition-all" :show="modelValue.show" :mask-closable="false" :auto-focus="false">
    <ZModalView class="w-[calc(100vw-32px)] sm:w-[400px] max-w-[400px] text-sm transition-all" :title="modelValue.title" :on-close="onClose">
      <div class="relative flex flex-col px-6 pb-6">
        <div class="flex justify-center self-center size-[48px]">
          <slot name="icon" :state="state">
            <i-ff-smile v-if="state === kState.success" class="size-full" />
            <i-ff-sad v-else-if="state === kState.fail" class="size-full" />
            <i-ff-swap v-else class="size-full" />
          </slot>
        </div>
        <div class="flex-center min-h-32">
          <div v-if="state !== kState.fail" class="flex flex-col flex-1">
            <slot />
          </div>
          <div v-else class="flex-center">
            <n-text class="text-error" depth="1">{{ modelValue.error }}</n-text>
          </div>
        </div>
        <div class="relative flex-col flex-center gap-3">
          <ZViewUrl v-if="explorerUrl" class="!gap-1 text-sm" :url="explorerUrl" :pending="state === kState.pending" :label="txLabel" />
          <div v-if="state === kState.initial" class="flex-center h-9">
            <n-text class="text-sm" depth="2">Please sign in your wallet</n-text>
          </div>
          <div v-else-if="state === kState.pending" class="flex-center h-9">
            <n-text class="text-sm" depth="2">Pending</n-text>
          </div>
          <ZButton v-else-if="state === kState.success" class="w-32 h-9" size="small" @click="onClose">OK</ZButton>
          <ZButton v-else class="w-32 h-9" size="small" @click="onClose">Dismiss</ZButton>
        </div>
      </div>
    </ZModalView>
  </n-modal>
</template>

<script setup lang="ts" generic="T">
import type { ModalAction } from '@/types'
import { kState } from '@/config'
import ZModalView from '@/components/ZModalView.vue'
import ZButton from '@/components/ZButton.vue'
import ZViewUrl from '@/components/ZViewUrl.vue'
import { getTransactionUrl } from '@/hooks/useChains'
import { shortString } from '@/utils'

const modelValue = defineModel<ModalAction<T>>({ required: true })

const tx = computed(() => modelValue.value.tx)
const state = computed(() => modelValue.value.state)

const explorerUrl = computed(() => tx.value ? getTransactionUrl(tx.value.chainId, tx.value.hash) : '')
const txLabel = computed(() => tx.value ? shortString(tx.value.hash) : '')

const onClose = () => {
  modelValue.value.show = false
}
</script>
