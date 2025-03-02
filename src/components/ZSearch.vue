<template>
  <div class="z-search flex-y-center bg-card px-4 rounded h-11">
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
