<template>
  <div class="flex flex-col">
    <NavLink2 v-if="screen.lt.sm" :href="faucetUrl" :blank="false" aria-label="Faucet">
      <n-text>Faucet</n-text>
      <i-my-faucet class="size-6" />
    </NavLink2>
    <NavLink2 :href="URL_DISCORD" aria-label="Discord">
      <n-text>Discord</n-text>
      <i-ic-round-discord class="size-6" />
    </NavLink2>
    <NavLink2 :href="URL_TWITTER" aria-label="Twitter">
      <n-text>Twitter</n-text>
      <i-ri-twitter-x-fill class="size-6" />
    </NavLink2>
    <NavLink2 :href="URL_GITHUB" aria-label="Github">
      <n-text>Github</n-text>
      <i-mdi-github class="size-6" />
    </NavLink2>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import {
  URL_DISCORD,
  URL_TWITTER,
  URL_GITHUB,
  PAGE_FAUCET,
} from "@/config"
import { screen } from "@/hooks/useScreen"
import NavLink2 from "./NavLink2.vue"

const router = useRouter()
const faucetUrl = router.resolve({ name: PAGE_FAUCET }).href
</script>
