<template>
  <div>
    <div v-if="notice" class="relative flex-center bg-card/70 px-8 py-2">
      <n-p class="mb-0 text-orange-500 text-sm text-center">{{ notice.content }}</n-p>
      <span class="right-2 absolute flex-center size-6 text-error/80 translate-y-center cursor-pointer" aria-label="close" @click="onClose">
        <i-ff-cancel class="size-5" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { notice, startFetchNotice, stopFetchNotice, markAsRead } from '@/hooks/useNotice'

const onClose = () => {
  markAsRead()
}

onMounted(() => {
  startFetchNotice()
  onBeforeUnmount(stopFetchNotice)
})
</script>
