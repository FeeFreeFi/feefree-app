<template>
  <a class="flex-1 no-underline" :href="href" :target="blank ? '_blank' : undefined" :aria-label="label">
    <div class="h-10 flex justify-between items-center px-3 rounded text-basic hover:bg-card-1">
      <slot />
    </div>
  </a>
</template>

<script setup lang="ts">
interface Props {
  href: string
  label: string
  blank?: boolean
}

withDefaults(defineProps<Props>(), {
  blank: true,
})
</script>
