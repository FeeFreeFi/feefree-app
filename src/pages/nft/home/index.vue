<template>
  <ZContainer class="flex flex-col">
    <div class="flex mb-4">
      <div class="flex-center gap-3">
        <i-ff-nfts class="size-6" />
        <n-text class="font-semibold text-base">FeeFree NFTs</n-text>
      </div>
    </div>
    <div class="justify-items-center gap-y-4 sm:gap-y-8 sm:gap-x-8 md:gap-x-32 lg:gap-x-14 xl:gap-x-8 2xl:gap-x-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <div v-for="item, index in nfts" :key="index" class="relative flex flex-col bg-card rounded-lg w-full sm:w-[272px] max-w-[400px]">
        <div class="w-full aspect-square">
          <NftImage :src="item.image" :label="item.label" :chain-id="item.chainId" />
        </div>
        <div class="flex flex-col px-4 sm:px-6 pt-4 pb-6">
          <!-- NFT name -->
          <div class="flex">
            <n-text class="font-medium text-base">{{ item.label }}</n-text>
          </div>
          <!-- Minted -->
          <div class="flex justify-between mt-3 sm:mt-4 text-xs">
            <n-text depth="1">Minted:</n-text>
            <div class="flex">
              <n-text>{{ toBalance(balances[index]) }}/{{ toBalanceWithUnit(item.cap, 0) }}</n-text>
            </div>
          </div>
          <!-- Price -->
          <div class="flex justify-between mt-2 sm:mt-3 text-xs">
            <n-text depth="1">Price:</n-text>
            <div v-if="item.price" class="flex">
              <ZTokenBalance class="ml-1" :token="feeToken" :balance="BigInt(item.price)" :dp="9" />
              <n-text>(${{ getFeeValue(item.price) }})</n-text>
            </div>
            <div v-else class="flex">
              <n-text class="text-primary">Free</n-text>
            </div>
          </div>
          <div class="flex mt-4 sm:mt-6">
            <ActionButton class="w-full" btn-class="!h-10" :chain-id="item.chainId" :chains="supportedChains">
              <ZButton class="w-full h-10" :disabled="minting" :loading="operatingIndex === index" :aria-label="item.price ? 'Mint' : 'Free Mint'" @click="() => onMint(index, item)">{{ item.price ? "Mint" : "Free Mint" }}</ZButton>
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
    <MintModal v-model="mintAction" />
  </ZContainer>
</template>

<script setup lang="ts">
import type { Callback, MintAction, Nft } from '@/types'
import type { DebouncedFunc } from 'lodash-es'
import { kState } from '@/config'
import { fromValue, toBalance, toBalanceWithUnit } from '@/utils'
import { createNftStates, fetchNfts, getNfts, getSupportedChains, mint } from '@/hooks/useNft'
import { account, updateNativeBalance } from '@/hooks/useWallet'
import { appChainId, syncRouteChain } from '@/hooks/useAppState'
import { getNativeCurrency } from '@/hooks/useChains'
import { getPrice } from '@/hooks/usePrices'
import { doSend } from '@/hooks/useInteraction'
import ZContainer from '@/components/ZContainer.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'
import ZButton from '@/components/ZButton.vue'
import ActionButton from '@/components/ActionButton.vue'
import NftImage from './NftImage.vue'
import MintModal from './MintModal.vue'
import { configReady } from '@/hooks/useConfig'

const supportedChains = ref<{ chainId: number }[]>([])

const nfts = ref<Nft[]>([])
const feeToken = computed(() => getNativeCurrency(appChainId.value))
const balances = ref(nfts.value.map(() => 0n))

const debounceUpdateNfts = ref<DebouncedFunc<Callback>>()

const getFeeValue = (value: bigint | number | string) => {
  return fromValue(getPrice(feeToken.value.symbol)).times(value.toString(10)).div(1e18).dp(4).toNumber()
}

const mintAction = ref<MintAction>({ show: false, state: kState.initial, title: 'Mint' })
const minting = ref(false)
const operatingIndex = ref(-1)

const reset = () => {
  minting.value = false
  operatingIndex.value = -1
}

const onMint = async (index: number, nft: Nft) => {
  operatingIndex.value = index

  mintAction.value.data = { chainId: nft.chainId, nft }
  const success = await doSend(mintAction, minting, 'Mint', () => mint(nft))

  operatingIndex.value = -1

  if (success) {
    updateNativeBalance()
    debounceUpdateNfts.value && debounceUpdateNfts.value()
  }
}

const onAppChainIdChange = () => {
  nfts.value = getNfts(appChainId.value)

  debounceUpdateNfts.value && debounceUpdateNfts.value()
}

onMounted(async () => {
  syncRouteChain()

  debounceUpdateNfts.value = createNftStates(nfts, balances)

  await Promise.all([configReady(), fetchNfts()])

  watch([account, appChainId], reset)
  watch(appChainId, onAppChainIdChange)

  supportedChains.value = getSupportedChains()
  onAppChainIdChange()
})
</script>
