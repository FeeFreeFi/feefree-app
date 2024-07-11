<template>
  <n-text @click="onClick">
    <slot v-if="copied" name="copied" />
    <slot v-else />
  </n-text>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue"
import { copyText } from "@/utils/clipboard"

const props = defineProps({
  text: {
    type: [String, Function],
    required: true,
  },
  delay: {
    type: Number,
    default: 1000,
  }
})

const copied = ref(false)
const timeId = ref(null)

const delayReset = () => {
  if (timeId.value) {
    clearTimeout(timeId.value)
  }
  timeId.value = setTimeout(() => {
    copied.value = false
    clearTimeout(timeId.value)
    timeId.value = null
  }, props.delay)
}

const onClick = async () => {
  if (copied.value) {
    return
  }

  let text
  if (typeof props.text === "function") {
    text = props.text()
  } else {
    text = props.text
  }

  copied.value = await copyText(text)

  copied.value && delayReset()
}

onBeforeUnmount(() => delayReset())
</script>

