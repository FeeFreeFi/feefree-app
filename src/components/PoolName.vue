<template>
  <div class="flex-center gap-[2px]">
    <ZTokenSymbol class="!text-base" :symbol="symbol0" />
    <i-ic-baseline-minus class="size-3 text-base text-basic font-medium" />
    <ZTokenSymbol class="!text-base" :symbol="symbol1" />
  </div>
</template>

<script setup>
import ZTokenSymbol from './ZTokenSymbol.vue'

defineProps({
  symbol0: {
    type: String,
    required: true,
  },
  symbol1: {
    type: String,
    required: true,
  },
})
</script>
