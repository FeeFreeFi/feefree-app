<template>
  <div class="z-search h-11 flex-y-center px-4 bg-card rounded">
    <n-input v-model:value="modelValue" :placeholder="placeholder" :bordered="false" size="large" :on-input="onInput">
      <template #prefix>
        <i-ff-search class="size-4" />
      </template>
    </n-input>
  </div>
</template>

<script setup>
import { debounce } from 'lodash-es'
import { onBeforeUnmount, onMounted } from 'vue'

const modelValue = defineModel({ type: String, required: true })

const props = defineProps({
  placeholder: {
    type: String,
    required: true,
  },
  delay: {
    type: Number,
    default: 100,
  },
  onSearch: {
    /** @type {import('vue').PropType<(value:string) => Promise<void>>} */
    type: Function,
    default: () => {},
  }
})

const debounceSearch = debounce(() => props.onSearch(modelValue.value), props.delay)

const onInput = () => {
  debounceSearch()
}

onMounted(() => {
  onBeforeUnmount(() => {
    debounceSearch.cancel()
  })
})
</script>

<style lang="scss">
.z-search {
  .n-input__prefix {
    @apply mr-3;
  }

  .n-input__input-el {
    @apply text-sm;
  }

  .n-input__placeholder {
    @apply text-sm text-basic/60;
  }
}
</style>
