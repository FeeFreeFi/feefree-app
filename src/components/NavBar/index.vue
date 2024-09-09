<template>
  <div class="w-full sm:w-auto flex gap-2">
    <NavLink v-for="item, index in links" :key="index" :to="item.to" :label="item.label" :icon="item.icon" />
    <NavMenu />
  </div>
</template>

<script setup>
import {
  PAGE_HOME,
  PAGE_POOL_HOME,
  PAGE_NFT_HOME,
  PAGE_PROFILE_HOME,
} from "@/config"
import NavLink from "./NavLink.vue"
import NavMenu from "./NavMenu.vue"

const links = [
  { to: { name: PAGE_HOME }, label: "Home", icon: "home.svg" },
  { to: { name: PAGE_POOL_HOME }, label: "Pool", icon: "pool.svg" },
  { to: { name: PAGE_NFT_HOME }, label: "NFT", icon: "nft.svg" },
  { to: { name: PAGE_PROFILE_HOME }, label: "Profile", icon: "profile.svg" },
]
</script>
