<template>
  <div class="flex flex-col">
    <NavLink2 :href="URL_DISCORD" label="Discord">
      <n-text>Discord</n-text>
      <i-ic-round-discord class="size-6" />
    </NavLink2>
    <NavLink2 :href="URL_TWITTER" label="Twitter">
      <n-text>Twitter</n-text>
      <i-ri-twitter-x-fill class="size-6" />
    </NavLink2>
    <NavLink2 :href="URL_GITHUB" label="Github">
      <n-text>Github</n-text>
      <i-mdi-github class="size-6" />
    </NavLink2>
  </div>
</template>

<script setup lang="ts">
import {
  URL_DISCORD,
  URL_TWITTER,
  URL_GITHUB,
} from '@/config'
import NavLink2 from './NavLink2.vue'
</script>
