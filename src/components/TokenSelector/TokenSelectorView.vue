<template>
  <ZModalView class="h-[480px]" title="Select Token" :on-close="onClose">
    <div class="h-full flex flex-col relative">
      <div class="px-4">
        <ZSearch v-model="search" placeholder="Search by name or paste address" :on-search="onSearch" />
      </div>
      <div class="flex-1 relative">
        <div v-if="displayTokens.length > 0" class="size-full absolute top-0 left-0">
          <n-scrollbar class="p-4">
            <div class="flex flex-col gap-2">
              <TokenItem v-for="token in displayTokens" :key="token.address" :token="token" :balance="balances[token.address] || 0n" :active="isSame(current, token)" @click="() => onTokenClick(token)" />
            </div>
          </n-scrollbar>
        </div>
        <NoToken v-else />
      </div>
    </div>
  </ZModalView>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { isSame } from "@/utils/ethereum"
import { account } from "@/hooks/useWallet"
import { createTokenStatesForMap } from "@/hooks/useTokenState"
import { cacheTokens, fetchToken, getCachedTokens, getTokens } from "@/hooks/useToken"
import { appChainId } from "@/hooks/useAppState"
import ZModalView from '@/components/ZModalView.vue'
import ZSearch from '@/components/ZSearch.vue'
import TokenItem from "./TokenItem.vue"
import NoToken from "./NoToken.vue"
import { Patterns } from "@/config"

const props = defineProps({
  current: {
    /** @type {import('vue').PropType<import('@/types').Token>} */
    type: Object,
    default: () => null,
  },
  onClose: {
    type: Function,
    required: true,
  },
  onSelect: {
    type: Function,
    required: true,
  },
})

const search = ref('')

/** @type {import('vue').Ref<import('@/types').Token[]>} */
const tokens = ref([])

/** @type {import('vue').Ref<{[address:string]: [balance:bigint]}>} */
const balances = ref({})

const displayTokens = computed(() => {
  const key = search.value
  if (!key) {
    return tokens.value
  }

  const reg = new RegExp(key, "i")
  const addressReg = new RegExp(`^${key}$`, "i")

  return tokens.value.filter(it => reg.test(it.name) || reg.test(it.symbol) || addressReg.test(it.address))
})


const onSearch = async value => {
  const key = search.value
  if (!key || !Patterns.Address.test(value)) {
    return
  }

  const addressReg = new RegExp(`^${key}$`, "i")
  if (tokens.value.find(it => addressReg.test(it.address))) {
    return
  }

  const token = await fetchToken(appChainId.value, value)
  tokens.value.push(token)
  cacheTokens([token])
}

/**
 * @param {import('@/types').Token} token
 */
const onTokenClick = token => {
  props.onSelect(token)
  props.onClose()
}

onMounted(() => {
  createTokenStatesForMap(account, tokens, balances)

  tokens.value = [...getTokens(appChainId.value, true), ...getCachedTokens(appChainId.value)]
})
</script>
