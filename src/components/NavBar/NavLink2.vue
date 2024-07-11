<template>
  <a class="flex-1 no-underline" :href="href" :target="blank ? '_blank' : undefined" :aria-label="ariaLabel">
    <div class="h-10 flex justify-between items-center px-3 rounded text-basic hover:bg-card-1">
      <slot />
    </div>
  </a>
</template>

<script setup>
defineProps({
  href: {
    type: String,
    required: true,
  },
  ariaLabel: {
    type: String,
    required: true,
  },
  blank: {
    type: Boolean,
    default: true,
  },
})
</script>
