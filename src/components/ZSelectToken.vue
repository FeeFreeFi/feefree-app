<template>
  <div class="flex-y-center">
    <n-button v-if="token" text :aria-label="label" :disabled="disabled" @click="onSelect">
      <div class="flex-y-center">
        <slot />
        <n-text class="text-color-3" aria-label="down arrow">
          <i-mdi-chevron-down class="size-5" />
        </n-text>
      </div>
    </n-button>
    <n-button v-else class="rounded-full" type="info" :disabled="disabled" :aria-label="placeholder" @click="onSelect">
      <div class="flex-y-center">
        <n-text class="text-color-bright text-sm">{{ placeholder }}</n-text>
        <n-text class="text-color-bright" aria-label="down arrow">
          <i-mdi-chevron-down class="size-5" />
        </n-text>
      </div>
    </n-button>
  </div>
</template>

<script setup>
defineProps({
  token: {
    /**
     * @type {import('vue').PropType<{symbol:string, address:string, decimals:number, dp:number, chainId:number}>}
     */
    type: Object,
    default: null,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Select Token",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  onSelect: {
    type: Function,
    required: true,
  },
})
</script>
