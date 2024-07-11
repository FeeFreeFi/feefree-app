<template>
  <div class="w-full lg:w-48 xl:w-64 shrink-0 flex flex-col gap-2 lg:gap-4">
    <div v-if="screen.lg" class="h-14 flex-center bg-card rounded-20">
      <router-link class="no-underline" :to="{ name: PAGE_POOL_HOME }">
        <div class="flex-center gap-1 cursor-pointer" aria-label="Pool">
          <LeftArrow />
          <span class="text-basic">Pool</span>
          <span class="size-4" />
        </div>
      </router-link>
    </div>
    <!-- Pools -->
    <div class="flex-1 lg:max-h-[calc(100vh-232px)] lg:p-6 flex lg:flex-col gap-2 items-center lg:bg-card lg:rounded-20">
      <LinkButton class="flex-1 lg:flex-initial" v-for="item, index in tabs" :key="index" :to="item.route" :aria-label="item.label">{{ item.label }}</LinkButton>
    </div>
    <n-divider v-if="screen.lt.lg" class="!my-0" />
  </div>
</template>

<script setup>
import {
  PAGE_POOL_HOME,
  PAGE_POOL_OVERVIEW,
  PAGE_POOL_POSITION,
  PAGE_POOL_DEPOSIT,
  PAGE_POOL_WITHDRAW,
} from "@/config"
import { screen } from "@/hooks/useScreen"
import LeftArrow from "@/components/Arrow/LeftArrow.vue"
import LinkButton from "../components/LinkButton.vue"

const tabs = [
  { route: { name: PAGE_POOL_OVERVIEW }, label: "Overview" },
  { route: { name: PAGE_POOL_POSITION }, label: "Position" },
  { route: { name: PAGE_POOL_DEPOSIT }, label: "Deposit" },
  { route: { name: PAGE_POOL_WITHDRAW }, label: "Withdraw" },
]
</script>
