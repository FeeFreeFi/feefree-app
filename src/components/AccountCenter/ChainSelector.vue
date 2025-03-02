<template>
  <div>
    <n-popselect class="rounded-lg w-[240px] max-h-[360px]" trigger="click" :value="current?.value" :options="options" :render-label="renderLabel" scrollable size="large" placement="bottom-end" :on-update:value="onSelect">
      <ZActionButton class="relative size-9" aria-label="select chain">
        <ZChainIcon v-if="!walletChainId || chainSupported" class="size-6" :chain-id="current?.value || 0" />
        <i-ion-warning v-else class="size-4 text-warning" />
        <div class="right-[2px] bottom-[2px] absolute">
          <DownArrow class="!size-3" />
        </div>
      </ZActionButton>
    </n-popselect>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from 'naive-ui'
import { getChainName, getChains, isSupportChain } from '@/hooks/useChains'
import { walletChainId, chainSupported } from '@/hooks/useWallet'
import { appChainId, setAppChainId } from '@/hooks/useAppState'
import { doSwitchNetwork } from '@/hooks/useInteraction'
import ZActionButton from '@/components/ZActionButton.vue'
import DownArrow from '@/components/Arrow/DownArrow.vue'
import ZChainIcon from '@/components/ZChainIcon.vue'

const notification = useNotification()

const renderLabel = (option: { name: string, value: number }) => {
  return h('div', {
    class: 'flex-y-center gap-2',
  }, [
    h(ZChainIcon, {
      class: 'inline-block size-6',
      chainId: option.value,
    }),
    option.name,
  ])
}

const options = getChains().map(chain => {
  const name = getChainName(chain.id)
  return {
    name,
    value: chain.id,
  }
})

const current = computed(() => options.find(it => it.value === appChainId.value))

const switching = ref(false)

const onSwitchNetwork = async (chainId: number) => {
  switching.value = await doSwitchNetwork(notification, chainId)
}

const onSelect = (chainId: number) => {
  if (appChainId.value !== chainId) {
    setAppChainId(chainId)
  }

  if (!walletChainId.value || walletChainId.value === chainId) {
    return
  }

  onSwitchNetwork(chainId)
}

const onChainChange = (newChainId: number, oldChainId: number) => {
  if (!newChainId || !isSupportChain(newChainId)) {
    return
  }

  if (!oldChainId && newChainId !== appChainId.value) {
    setAppChainId(newChainId)
  } else {
    if (appChainId.value !== newChainId) {
      setAppChainId(newChainId)
    }
  }
}

onMounted(() => {
  watch(walletChainId, onChainChange)
})
</script>
