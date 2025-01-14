<template>
  <ActionModal v-model="modelValue">
    <div class="flex-center gap-1">
      <ZPoolIcon :pool="data!.pool" />
      <ZBalance :value="data!.lock.amount" />
    </div>
  </ActionModal>
</template>

<script setup lang="ts">
import type { UnlockAction } from '@/types'
import ActionModal from '@/components/ActionModal/index.vue'
import ZPoolIcon from '@/components/ZPoolIcon.vue'
import ZBalance from '@/components/ZBalance.vue'

const modelValue = defineModel<UnlockAction>({ required: true })

const data = computed(() => modelValue.value.data)
</script>
