<template>
  <div class="flex flex-col gap-3">
    <div class="flex">
      <n-text class="text-xs" depth="1">Shortable Token</n-text>
    </div>
    <div class="flex gap-3">
      <div class="flex-1 flex-y-center justify-between bg-card px-4 sm:px-6 py-2 rounded-lg">
        <n-input v-model:value="name" class="flex-1" placeholder="Name" size="small" :input-props="{ name: 'Name' }" :bordered="false" />
      </div>
      <div class="flex-1 flex-y-center justify-between bg-card px-4 sm:px-6 py-2 rounded-lg">
        <n-input v-model:value="symbol" class="flex-1" placeholder="Symbol" size="small" :input-props="{ name: 'Symbol' }" :bordered="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const name = defineModel<string>('name', { required: true })
const symbol = defineModel<string>('symbol', { required: true })
</script>
