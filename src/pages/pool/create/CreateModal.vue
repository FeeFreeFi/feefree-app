<template>
  <ActionModal v-model="modelValue">
    <div class="flex-col flex-center gap-3">
      <div class="flex-center gap-1 overflow-hidden">
        <ZTokenIcon :token="data!.token0" />
        <ZTokenBalance class="text-font-90 !font-normal" :token="data!.token0" :balance="data!.amount0" />
      </div>
      <i-ff-pair class="size-6" />
      <div class="flex-center gap-1 overflow-hidden">
        <ZTokenIcon :token="data!.token1" />
        <ZTokenBalance class="text-font-90 !font-normal" :token="data!.token1" :balance="data!.amount1" />
      </div>
    </div>
  </ActionModal>
</template>

<script setup lang="ts">
import type { CreateAction } from '@/types'
import ActionModal from '@/components/ActionModal/index.vue'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'

const modelValue = defineModel<CreateAction>({ required: true })

const data = computed(() => modelValue.value.data)
</script>
