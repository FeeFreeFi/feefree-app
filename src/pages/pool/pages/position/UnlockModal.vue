<template>
  <ActionModal v-model="modelValue">
    <div class="flex-center gap-1">
      <ZPoolIcon :pool="data.pool" />
      <ZBalance :value="data.lock.amount" />
    </div>
  </ActionModal>
</template>

<script setup>
import { computed } from 'vue'
import ActionModal from '@/components/ActionModal/index.vue'
import ZPoolIcon from '@/components/ZPoolIcon.vue'
import ZBalance from '@/components/ZBalance.vue'

/** @type {import('vue').ModelRef<import('@/types').UnlockAction>} */
const modelValue = defineModel({ type: Object, required: true })

const data = computed(() => modelValue.value.data)
</script>
