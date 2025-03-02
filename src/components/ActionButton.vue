<template>
  <div>
    <ZButton v-if="!account" class="h-10 sm:h-12" :class="btnClass" block aria-label="Connect Wallet" @click="openWalletConnector">Connect Wallet</ZButton>
    <ZButton v-else-if="requireSwitchChain" class="h-10 sm:h-12" :class="btnClass" block :disabled="switching" :loading="switching" aria-label="Switch Network" @click="onSwitchNetwork">Switch Network</ZButton>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { useNotification } from 'naive-ui'
import { account, walletChainId } from '@/hooks/useWallet'
import { open as openWalletConnector } from '@/hooks/useWalletConnector'
import { doSwitchNetwork } from '@/hooks/useInteraction'
import ZButton from '@/components/ZButton.vue'

interface Props {
  chainId?: number
  chains: { chainId: number }[]
  btnClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  chainId: 0,
  btnClass: '',
})

const notification = useNotification()

const switching = ref(false)

const requireSwitchChain = computed(() => walletChainId.value !== props.chainId)

const defaultChainId = computed(() => props.chainId || props.chains[0].chainId)

const onSwitchNetwork = async () => {
  switching.value = await doSwitchNetwork(notification, defaultChainId.value)
}
</script>
