<template>
  <n-modal class="bg-dialog rounded-lg transition-all" :show="modelValue.show" :mask-closable="false" :auto-focus="false">
    <ZModalView class="max-w-[400px] w-[calc(100vw-32px)] sm:w-[400px] text-sm transition-all" :title="modelValue.title" :on-close="onClose">
      <div class="px-6 pb-6 flex flex-col relative">
        <div class="flex justify-center self-center size-[48px]">
          <slot name="icon" :state="state">
            <i-ff-smile v-if="state == States.SUCCESS" class="size-full" />
            <i-ff-sad v-else-if="state == States.FAIL" class="size-full" />
            <i-ff-swap v-else class="size-full" />
          </slot>
        </div>
        <div class="min-h-32 flex-center">
          <div class="flex-1 flex flex-col" v-if="state != States.FAIL">
            <slot />
          </div>
          <div v-else class="flex-center">
            <n-text class="text-error" depth="1">{{ modelValue.error }}</n-text>
          </div>
        </div>
        <div class="flex-center flex-col gap-3 relative">
          <ZViewUrl v-if="explorerUrl" class="text-sm !gap-1" :url="explorerUrl" :pending="state === States.PENDING" :label="txLabel" />
          <div v-if="state === States.INITIAL" class="h-9 flex-center">
            <n-text class="text-sm" depth="2">Please sign in your wallet</n-text>
          </div>
          <div v-else-if="state === States.PENDING" class="h-9 flex-center">
            <n-text class="text-sm" depth="2">Pending</n-text>
          </div>
          <ZButton v-else-if="state === States.SUCCESS" class="h-9 w-32" size="small" @click="onClose">OK</ZButton>
          <ZButton v-else class="h-9 w-32" size="small" @click="onClose">Dismiss</ZButton>
        </div>
      </div>
    </ZModalView>
  </n-modal>
</template>

<script setup>
import { computed } from "vue"
import { States } from "@/config"
import ZModalView from "@/components/ZModalView.vue"
import ZButton from "@/components/ZButton.vue"
import ZViewUrl from "@/components/ZViewUrl.vue"
import { getTransactionUrl } from "@/hooks/useChains"
import shortString from "@/utils/shortString"

/** @type {import('vue').ModelRef<import('@/types').ModalAction>} */
const modelValue = defineModel({ type: Object, required: true })

const tx = computed(() => modelValue.value.tx)
const state = computed(() => modelValue.value.state)

const explorerUrl = computed(() => tx.value ? getTransactionUrl(tx.value.chainId, tx.value.hash) : "")
const txLabel = computed(() => tx.value ? shortString(tx.value.hash) : "")

const onClose = () => {
  modelValue.value.show = false
}
</script>
