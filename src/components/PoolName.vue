<template>
  <div class="flex-center gap-[2px]">
    <ZTokenSymbol :symbol="symbol0" />
    <i-ic-baseline-minus class="size-4" />
    <ZTokenSymbol :symbol="symbol1" />
  </div>
</template>

<script setup>
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
