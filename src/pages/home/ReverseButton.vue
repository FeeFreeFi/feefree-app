<script setup lang="ts">
interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  (e: 'reverse'): void
}>()

function onReverse() {
  if (props.disabled) {
    return
  }

  emit('reverse')
}
</script>

<template>
  <div>
    <n-divider class="!my-0">
      <span :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer']" @click="onReverse">
        <i-ff-reverse class="size-10" />
      </span>
    </n-divider>
  </div>
</template>
