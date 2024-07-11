<template>
  <div class="flex-y-center">
    <n-button v-if="token" text :aria-label="label" :disabled="disabled" @click="onSelect">
      <div class="flex-y-center">
        <slot />
        <n-text aria-label="down arrow">
          <i-mdi-chevron-down class="size-5" />
        </n-text>
      </div>
    </n-button>
    <n-button v-else class="rounded-full" type="info" :disabled="disabled" :aria-label="placeholder" @click="onSelect">
      <div class="flex-y-center">
        <n-text class="text-sm">{{ placeholder }}</n-text>
        <n-text aria-label="down arrow">
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
     * @type {import('vue').PropType<import('@/types').Token>}
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
