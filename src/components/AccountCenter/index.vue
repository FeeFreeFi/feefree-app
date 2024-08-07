<template>
  <div>
    <div class="flex-y-center gap-4">
      <ZButton v-if="!account" class="w-40 h-9" aria-label="Connect Wallet" @click="onOpen">Connect Wallet</ZButton>
      <AccountProfile v-else-if="chainSupported" />
      <ChainSelector />
    </div>
    <WalletConnector />
  </div>
</template>

<script setup>
import { account, chainSupported } from "@/hooks/useWallet"
import { open } from "@/hooks/useWalletConnector"
import ZButton from "@/components/ZButton.vue"
import WalletConnector from "@/components/WalletConnector/index.vue"
import AccountProfile from "@/components/AccountProfile/index.vue"
import ChainSelector from "./ChainSelector.vue"

const onOpen = () => {
  open()
}
</script>
