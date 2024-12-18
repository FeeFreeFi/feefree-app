<template>
  <div class="flex flex-col gap-3">
    <div class="flex">
      <n-text class="text-xs" depth="1">Shortable Token</n-text>
    </div>
    <div class="flex gap-3">
      <div class="flex-1 py-2 px-4 sm:px-6 flex-y-center justify-between bg-card rounded-lg">
        <n-input class="flex-1" v-model:value="name" placeholder="Name" size="small" :input-props="{name: 'Name'}" :bordered="false" />
      </div>
      <div class="flex-1 py-2 px-4 sm:px-6 flex-y-center justify-between bg-card rounded-lg">
        <n-input class="flex-1" v-model:value="symbol" placeholder="Symbol" size="small" :input-props="{name: 'Symbol'}" :bordered="false" />
      </div>
    </div>
  </div>
</template>

<script setup>
const name = defineModel("name", { type: String, required: true })
const symbol = defineModel("symbol", { type: String, required: true })
</script>
