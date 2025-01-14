<template>
  <n-text @click="onClick">
    <slot v-if="copied" name="copied" />
    <slot v-else />
  </n-text>
</template>

<script setup lang="ts">
import type { TimerId } from '@/types'
import { copyText } from '@/utils'

interface Props {
  text: string | (() => string)
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 1000,
})

const copied = ref(false)
const timeId = ref<TimerId>()

const delayReset = () => {
  if (timeId.value) {
    clearTimeout(timeId.value)
  }
  timeId.value = setTimeout(() => {
    copied.value = false
    clearTimeout(timeId.value)
    timeId.value = undefined
  }, props.delay)
}

const onClick = async () => {
  if (copied.value) {
    return
  }

  let text
  if (typeof props.text === 'function') {
    text = props.text()
  } else {
    text = props.text
  }

  copied.value = await copyText(text)

  copied.value && delayReset()
}

onBeforeUnmount(() => delayReset())
</script>
