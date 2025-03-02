<template>
  <div class="flex-y-center justify-between gap-3 bg-card/40 hover:bg-card/60 px-4 py-3 rounded h-14 transition-all cursor-pointer" :class="[active ? '!bg-primary/10' : '']" :aria-label="`Connect to ${name}`">
    <div class="flex-y-center gap-3">
      <img class="rounded size-8" :src="icon" :alt="name" loading="lazy">
      <n-text class="font-semibold" :class="[active ? 'text-primary' : '']">{{ name }}</n-text>
    </div>
    <div class="flex-y-center">
      <span v-if="active">
        <i-ff-spin class="size-4" />
      </span>
      <div v-else-if="recent" class="flex-y-center bg-primary/10 px-2 py-1 rounded">
        <n-text class="text-primary text-xs">Recent</n-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  icon: string
  recent: boolean
  active: boolean
}

defineProps<Props>()
</script>
