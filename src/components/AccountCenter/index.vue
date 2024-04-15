<template>
  <div>
    <div class="flex gap-2">
      <n-button v-if="!requireSwitchChain && !account" class="rounded" strong secondary type="info" size="large" aria-label="connect wallet" @click="open">Connect Wallet</n-button>
      <AccountProfile v-else-if="!requireSwitchChain" />
      <ChainSelector />
    </div>
    <WalletConnector />
  </div>
</template>

<script setup>
import { account, requireSwitchChain } from "@/hooks/useWallet"
import { open } from "@/hooks/useWalletConnector"
import WalletConnector from "@/components/WalletConnector/index.vue"
import AccountProfile from "@/components/AccountProfile/index.vue"
import ChainSelector from "./ChainSelector.vue"
</script>
