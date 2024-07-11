<template>
  <div class="h-14 flex-y-center justify-between px-4 py-3 gap-3 rounded cursor-pointer transition-all bg-card/40 hover:bg-card/60" :class="[active ? '!bg-primary/10' : '']" :aria-label="`Connect to ${name}`">
    <div class="flex-y-center gap-3">
      <img class="size-8 rounded" :src="icon" :alt="name" loading="lazy">
      <n-text class="font-semibold" :class="[active ? 'text-primary' : '']">{{ name }}</n-text>
    </div>
    <div class="flex-y-center">
      <span v-if="active">
        <i-my-spin class="size-4" />
      </span>
      <div v-else-if="recent" class="flex-y-center px-2 py-1 bg-primary/10 rounded">
        <n-text class="text-primary text-xs">Recent</n-text>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  recent: {
    type: Boolean,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
})
</script>
