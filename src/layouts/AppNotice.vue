<template>
  <div>
    <div v-if="notice" class="bg-card/70 flex-center px-8 py-2 relative">
      <n-p class="text-orange-500 text-sm mb-0 text-center">{{ notice.content }}</n-p>
      <span class="size-6 flex-center cursor-pointer absolute translate-y-center right-2 text-error/80" aria-label="close" @click="onClose">
        <i-ff-cancel class="size-5" />
      </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue"
import { notice, startFetchNotice, stopFetchNotice, markAsRead } from "@/hooks/useNotice"

const onClose = () => {
  markAsRead()
}

onMounted(() => {
  startFetchNotice()
  onBeforeUnmount(stopFetchNotice)
})
</script>
