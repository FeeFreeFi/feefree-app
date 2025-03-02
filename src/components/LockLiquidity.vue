<template>
  <div class="flex flex-col gap-4">
    <div>
      <n-checkbox v-model:checked="checked" @update:checked="onChecked">Lock Liquidity</n-checkbox>
    </div>
    <n-radio-group v-model:value="duration" :class="[checked ? '' : 'hidden']" name="duration">
      <div class="gap-y-2 grid grid-cols-2 md:grid-cols-4">
        <n-radio v-for="option in options" :key="option.value" :value="option.value">
          <n-text class="opacity-80">{{ option.label }}</n-text>
        </n-radio>
      </div>
    </n-radio-group>
  </div>
</template>

<script setup lang="ts">
const duration = defineModel<number>({ required: true })

const options = [
  { label: '30 Days', value: 2592000 },
  { label: '180 Days', value: 15552000 },
  { label: '1 Year', value: 31536000 },
  { label: '2 Years', value: 63072000 },
]

const checked = ref(false)

const onChecked = () => {
  if (checked.value) {
    duration.value = duration.value || options[0].value
  } else {
    duration.value = 0
  }
}

onMounted(() => {
  watch(duration, () => {
    if (duration.value === 0) {
      checked.value = false
    }
  })
})
</script>
