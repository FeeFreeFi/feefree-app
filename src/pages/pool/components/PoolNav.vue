<template>
  <div class="flex flex-col gap-2 lg:gap-4 w-full lg:w-48 xl:w-64 shrink-0">
    <div v-if="screen.lg" class="flex-center bg-card rounded-2xl h-14">
      <router-link class="no-underline" :to="{ name: PAGE_POOL_HOME }">
        <div class="flex-center gap-1 cursor-pointer" aria-label="Pool">
          <LeftArrow />
          <span class="text-font">Pool</span>
          <span class="size-4" />
        </div>
      </router-link>
    </div>
    <!-- Pools -->
    <div class="flex lg:flex-col flex-1 items-center gap-2 lg:bg-card lg:p-6 lg:rounded-2xl lg:max-h-[calc(100vh-232px)]">
      <LinkButton v-for="item, index in tabs" :key="index" class="lg:flex-initial flex-1" :to="item.route" :label="item.label">{{ item.label }}</LinkButton>
    </div>
    <n-divider v-if="screen.lt.lg" class="!my-0" />
  </div>
</template>

<script setup lang="ts">
import {
  PAGE_POOL_HOME,
  PAGE_POOL_OVERVIEW,
  PAGE_POOL_POSITION,
  PAGE_POOL_DEPOSIT,
  PAGE_POOL_WITHDRAW,
} from '@/config'
import { screen } from '@/hooks/useScreen'
import LeftArrow from '@/components/Arrow/LeftArrow.vue'
import LinkButton from '../components/LinkButton.vue'

const tabs = [
  { route: { name: PAGE_POOL_OVERVIEW }, label: 'Overview' },
  { route: { name: PAGE_POOL_POSITION }, label: 'Position' },
  { route: { name: PAGE_POOL_DEPOSIT }, label: 'Deposit' },
  { route: { name: PAGE_POOL_WITHDRAW }, label: 'Withdraw' },
]
</script>
