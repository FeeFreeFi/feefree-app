<template>
  <div class="z-search h-11 flex-y-center px-4 bg-card rounded">
    <n-input v-model:value="modelValue" :placeholder="placeholder" :bordered="false" size="large" :on-input="onInput">
      <template #prefix>
        <i-ff-search class="size-4" />
      </template>
    </n-input>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'

interface Props {
  placeholder: string
  delay?: number
  onSearch: (value: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  delay: 100,
  onSearch: () => {},
})

const modelValue = defineModel<string>({ required: true })

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
