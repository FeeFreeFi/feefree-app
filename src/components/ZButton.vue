<template>
  <n-button class="rounded-lg bg-primary-gradient hover:bg-primary-gradient-hover" v-bind="$attrs" strong :bordered="false" :focusable="false">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot v-if="slotProps" :name="name" v-bind="slotProps" />
      <slot v-else :name="name" />
    </template>
  </n-button>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ZButton',
})
</script>
