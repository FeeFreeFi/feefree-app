<template>
  <div>
    <n-popselect class="w-[240px] max-h-[360px] rounded-lg" trigger="click" :value="current.value" :options="options" :render-label="renderLabel" scrollable size="large" placement="bottom-end" :on-update:value="onSelect">
      <ZActionButton class="size-9 relative " aria-label="select chain">
        <ZChainIcon v-if="!walletChainId || chainSupported" class="size-6" :chain-id="current.value" />
        <i-ion-warning v-else class="size-4 text-warning" />
        <div class="absolute right-[2px] bottom-[2px]">
          <DownArrow class="!size-3" />
        </div>
      </ZActionButton>
    </n-popselect>
  </div>
</template>

<script setup>
import { ref, computed, h, watch, onMounted, onBeforeUnmount } from "vue"
import { getChainName, getChains, isSupportChain } from "@/hooks/useChains"
import { walletChainId, chainSupported } from "@/hooks/useWallet"
import { appChainId, setAppChainId } from "@/hooks/useAppState"
import { useNotification } from "naive-ui"
import ZActionButton from "@/components/ZActionButton.vue"
import DownArrow from "@/components/Arrow/DownArrow.vue"
import ZChainIcon from "@/components/ZChainIcon.vue"
import { doSwitchNetwork } from "@/hooks/useInteraction"

const notification = useNotification()

const renderLabel = option => {
  return h("div",
    {
      class: "flex-y-center gap-2",
    },
    [
      h(ZChainIcon, {
        class: "inline-block size-6",
        chainId: option.value,
      }),
      option.name,
    ]
  )
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

/**
 * @param {number} chainId
 */
const onSwitchNetwork = chainId => doSwitchNetwork(notification, switching, chainId)

/**
 * @param {number} chainId
 */
const onSelect = chainId => {
  if (appChainId.value !== chainId) {
    setAppChainId(chainId)
  }

  if (!walletChainId.value || walletChainId.value === chainId) {
    return
  }

  onSwitchNetwork(chainId)
}

/**
 * @param {number} newChainId
 * @param {number} oldChainId
 */
const onChainChange = (newChainId, oldChainId) => {
  if (!newChainId || !isSupportChain(newChainId)) {
    return
  }

  if (!oldChainId && newChainId !== appChainId.value) {
    onSwitchNetwork(appChainId.value)
  } else {
    if (appChainId.value !== newChainId) {
      setAppChainId(newChainId)
    }
  }
}

onMounted(() => {
  const stopWatch = watch(walletChainId, onChainChange)
  onBeforeUnmount(stopWatch)
})
</script>
