<template>
  <div class="z-search h-11 flex-y-center px-4 bg-card rounded">
    <n-input v-model:value="modelValue" :placeholder="placeholder" :bordered="false" size="large">
      <template #prefix>
        <i-ff-search class="size-4" />
      </template>
    </n-input>
  </div>
</template>

<script setup>
const modelValue = defineModel({ type: String, required: true })

defineProps({
  placeholder: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss">
.z-search {
  .n-input__prefix {
    margin-right: 12px;
  }

  .n-input__input-el {
    @apply text-sm;
  }

  .n-input__placeholder {
    @apply text-sm text-basic/60;
  }
}
</style>
