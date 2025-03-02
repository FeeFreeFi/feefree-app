<template>
  <div class="flex gap-2 w-full sm:w-auto">
    <NavLink v-for="item, index in links" :key="index" :to="item.to" :label="item.label" :icon="item.icon" :exact="item.exact" />
    <NavMenu />
  </div>
</template>

<script setup lang="ts">
import {
  PAGE_HOME,
  PAGE_POOL_HOME,
  // PAGE_LAUNCH,
  PAGE_NFT_HOME,
  PAGE_MIGRATE,
} from '@/config'
import NavLink from './NavLink.vue'
import NavMenu from './NavMenu.vue'

const links = [
  { to: { name: PAGE_HOME }, label: 'Home', icon: 'home.svg', exact: true },
  { to: { name: PAGE_POOL_HOME }, label: 'Pool', icon: 'pool.svg', exact: false },
  // { to: { name: PAGE_LAUNCH }, label: "Launch", icon: "launch.svg", exact: false },
  { to: { name: PAGE_NFT_HOME }, label: 'NFT', icon: 'nft.svg', exact: false },
  { to: { name: PAGE_MIGRATE }, label: 'Migrate', icon: 'migrate.svg', exact: false },
]
</script>
