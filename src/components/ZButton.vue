<script setup lang="ts">
import type { ButtonProps } from 'naive-ui'

interface Props extends /* @vue-ignore */ ButtonProps {}

defineProps<Props>()
</script>

<template>
  <NButton class="bg-linear-256 from-[#E7E368] hover:from-[#DFDA2D] to-[#41F5CF] hover:to-[#35EDC6] rounded-lg" v-bind="$attrs" strong :bordered="false" :focusable="false">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot v-if="slotProps" :name="name" v-bind="slotProps" />
      <slot v-else :name="name" />
    </template>
  </NButton>
</template>
