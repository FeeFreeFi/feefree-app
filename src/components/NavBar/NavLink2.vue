<template>
  <a class="flex-1 no-underline" :href="href" :target="blank ? '_blank' : undefined" :aria-label="label">
    <div class="flex justify-between items-center hover:bg-card/60 px-3 rounded h-10 text-font">
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
