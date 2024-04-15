<template>
  <div>
    <n-popselect class="w-[240px] max-h-[360px] rounded-lg" trigger="click" :value="current.value" :options="options" :render-label="renderLabel" scrollable size="large" placement="bottom-end" :on-update:value="onSelect">
      <n-button v-if="requireSwitchChain" class="rounded" strong secondary type="info" size="large" aria-label="connect wallet">
        <span>Switch Network</span>
        <span><i-mdi-chevron-down class="size-5" /></span>
      </n-button>
      <n-button v-else class="size-10 px-0 rounded-lg relative" size="large" tertiary aria-label="select chain">
        <ZChainIcon class="size-6" :chain-id="current.value" />
        <div class="absolute right-[2px] bottom-[2px] bg-white text-black rounded-full">
          <i-mdi-chevron-down class="size-4" />
        </div>
      </n-button>
    </n-popselect>
  </div>
</template>

<script setup>
import { computed, h, watch, onMounted, onBeforeUnmount } from "vue"
import { getChainName, getChains, isSupportChain } from "@/hooks/useChains"
import { chainId, switchChain, requireSwitchChain } from "@/hooks/useWallet"
import { selectedChainId, setSelectedChainId } from "@/hooks/useSelectedChain"
import { useNotification } from "naive-ui"
import ZChainIcon from "@/components/ZChainIcon.vue"

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

const current = computed(() => options.find(it => it.value === selectedChainId.value))

const doSwitch = async id => {
  try {
    await switchChain(id)
  } catch (err) {
    notification.error({
      title: `Switch to ${getChainName(id)} fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 3000,
    })
  }
}

const onSelect = value => {
  setSelectedChainId(value)

  if (!chainId.value || chainId.value === value) {
    return
  }

  doSwitch(value)
}

const onChainChange = (newChainId, oldChainId) => {
  if (!newChainId || !isSupportChain(newChainId)) {
      return
    }

    setSelectedChainId(newChainId)
}

onMounted(() => {
  const stopWatch = watch(chainId, onChainChange)
  onBeforeUnmount(stopWatch)
})
</script>
