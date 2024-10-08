<template>
  <n-modal class="bg-dialog rounded-lg transition-all" :show="modelValue.show" :mask-closable="false" :auto-focus="false">
    <ZModalView class="max-w-[400px] w-[calc(100vw-32px)] sm:w-[400px] text-sm transition-all" :on-close="onClose">
      <div class="px-6 pb-8 flex flex-col gap-4 relative">
        <div class="flex justify-center">
          <i-ff-smile v-if="isSuccess" class="size-[72px]" />
          <i-ff-sad v-else-if="isFail" class="size-[72px]" />
          <i-ff-swap v-else class="size-[72px]" />
        </div>
        <div class="flex justify-center">
          <n-text class="text-lg font-medium">{{ modelValue.title }}</n-text>
        </div>
        <div class="min-h-14 flex-center">
          <slot :data="modelValue.data" :state="modelValue.state" :error="modelValue.error" />
        </div>
        <div class="h-12 flex-center">
          <ViewOnExplorer v-if="isPending" :url="modelValue.tx.explorerUrl" />
          <ZButton v-else-if="isSuccess" class="h-10 sm:h-12 w-full" @click="onClose">Close</ZButton>
          <ZButton v-else-if="isFail" class="h-10 sm:h-12 w-full" @click="onClose">Dismiss</ZButton>
          <n-text v-else class="text-sm" depth="2">Please sign in your wallet</n-text>
        </div>
      </div>
    </ZModalView>
  </n-modal>
</template>

<script setup>
import { computed } from "vue"
import ZModalView from "@/components/ZModalView.vue"
import ZButton from "@/components/ZButton.vue"
import ViewOnExplorer from "@/components/ViewOnExplorer.vue"

/**
 * @type {import('vue').ModelRef<{show:boolean, state: 'initial'|'pending'|'success'|'fail', title:string, data:object, tx:{hash:string, chainId:number, explorerUrl:string}, error:string}>}
 */
const modelValue = defineModel({
  type: Object,
  required: true,
})

const state = computed(() => modelValue.value.state || "initial")
const isPending = computed(() => state.value === "pending")
const isSuccess = computed(() => state.value === "success")
const isFail = computed(() => state.value === "fail")

const onClose = () => {
  modelValue.value = {
    ...modelValue.value,
    show: false,
  }
}
</script>
