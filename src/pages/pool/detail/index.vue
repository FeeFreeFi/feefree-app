<template>
  <div class="flex flex-col py-6 gap-4 sm:flex-row sm:gap-10 lg:mx-24">
    <div class="flex flex-col gap-4 sm:w-[120px] shrink-0">
      <!-- <LinkButton :to="{ name: PAGE_POOL_HOME }" label="Pools">Pools</LinkButton> -->
      <!-- Pools -->
      <div class="flex gap-2 justify-center sm:flex-col sm:gap-2">
        <LinkButton :to="{ name: PAGE_POOL_OVERVIEW }" label="Overview">Overview</LinkButton>
        <LinkButton :to="{ name: PAGE_POOL_POSITION }" label="Position">Position</LinkButton>
        <LinkButton :to="{ name: PAGE_POOL_DEPOSIT }" label="Deposit">Deposit</LinkButton>
        <LinkButton :to="{ name: PAGE_POOL_WITHDRAW }" label="Withdraw">Withdraw</LinkButton>
      </div>
    </div>
    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import {
  // PAGE_POOL_HOME,
  PAGE_POOL_OVERVIEW,
  PAGE_POOL_POSITION,
  PAGE_POOL_DEPOSIT,
  PAGE_POOL_WITHDRAW,
} from "@/config"
import LinkButton from "./LinkButton"
</script>
