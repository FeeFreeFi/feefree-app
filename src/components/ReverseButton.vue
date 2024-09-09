<template>
  <div>
    <n-divider class="!my-0">
      <span :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer']" @click="onReverse">
        <i-ff-reverse class="size-10 sm:size-14" />
      </span>
    </n-divider>
  </div>
</template>

<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(["reverse"])

const onReverse = () => {
  if (props.disabled) {
    return
  }

  emit("reverse")
}
</script>
