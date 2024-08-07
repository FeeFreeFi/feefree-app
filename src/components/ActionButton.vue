<template>
  <div>
    <ZButton v-if="!account" class="h-10 sm:h-12 w-full" :class="btnClass" aria-label="Connect Wallet" @click="openWalletConnector">Connect Wallet</ZButton>
    <ZButton v-else-if="requireSwitchChain" class="h-10 sm:h-12 w-full" :class="btnClass" :disabled="switching" :loading="switching" aria-label="Switch Network" @click="onSwitchNetwork">Switch Network</ZButton>
    <slot v-else />
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useNotification } from "naive-ui"
import { account, walletChainId } from "@/hooks/useWallet"
import { open as openWalletConnector } from "@/hooks/useWalletConnector"
import { doSwitchNetwork } from "@/hooks/useInteraction"
import ZButton from "@/components/ZButton.vue"

const notification = useNotification()

const props = defineProps({
  chainId: {
    type: Number,
    required: true,
  },
  chains: {
    /**
     * @type {import('vue').PropType<{chainId:number}[]>}
     */
    type: Array,
    required: true,
  },
  btnClass: {
    type: String,
    default: "",
  },
})

const switching = ref(false)

const requireSwitchChain = computed(() => walletChainId.value !== props.chainId)

const defaultChainId = computed(() => props.chainId ? props.chainId : props.chains[0].chainId)

const onSwitchNetwork = () => doSwitchNetwork(notification, switching, defaultChainId.value)
</script>
