<template>
  <div class="flex flex-col relative overflow-hidden mx-auto my-4 sm:my-8 flex-1 w-full sm:w-[490px] p-4 sm:p-8 bg-container rounded-20">
    <div class="flex-1 flex flex-col">
      <div class="mb-4 flex items-center justify-between">
        <n-text class="text-lg font-medium">Rebate</n-text>
        <ZBack />
      </div>
      <div class="flex-1 flex flex-col gap-4 sm:gap-8">
        <RebateOverview :current="rebates.current" :claimed="rebates.claimed" />
        <AvailableRebates v-if="rebates.list.length > 0" :claiming="claiming" :list="rebates.list" :on-claim="onClaim" />
        <ClaimHistory :total="pagination.total" :page="pagination.page" :list="claims" :on-update-page="onUpdatePage" />
      </div>
    </div>
    <ClaimModal v-model="claimAction" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useNotification } from "naive-ui"
import pMap from "p-map"
import { getClaims, getRebates } from "@/api"
import wait from "@/utils/wait"
import { profile } from "@/hooks/useUser"
import { doClaim, doSwitchNetwork } from "@/hooks/useInteraction"
import { appChainId } from "@/hooks/useAppState"
import { account } from "@/hooks/useWallet"
import { isValidRebate } from "@/hooks/useRebate"
import ZBack from "@/components/ZBack.vue"
import ClaimModal from "./ClaimModal.vue"
import RebateOverview from "./RebateOverview.vue"
import AvailableRebates from "./AvailableRebates.vue"
import ClaimHistory from "./ClaimHistory.vue"

const notification = useNotification()

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
})

const rebates = ref({
  current: 0n,
  claimed: 0n,
  available: 0n,
  /**
   * @type {(import('@/types').Rebate & {valid:boolean})[]}
   */
  list: [],
})

/**
 * @type {import('vue').Ref<import('@/types').Claim[]>}
 */
const claims = ref([])

const claimAction = ref({ show: false })
const claiming = ref(false)

const switching = ref(false)
/**
 * @param {number} chainId
 */
 const onSwitchNetwork = chainId => doSwitchNetwork(notification, switching, chainId)

const fetchRebates = async () => {
  const res = await getRebates()
  if (res.code !== 0) {
    console.log(res.message)
    return
  }

  const { current, claimed, available, list } = res.data
  rebates.value = {
    current: BigInt(current),
    claimed: BigInt(claimed),
    available: BigInt(available),
    list: list.map(it => ({
      ...it,
      amount: BigInt(it.amount),
      valid: false,
    })),
  }

  checkRebatesValid()
}

const fetchClaims = async () => {
  const { page, limit } = pagination.value

  const res = await getClaims({ page, limit })
  if (res.code !== 0) {
    console.log(res.message)
    return
  }

  const { total, list } = res.data
  pagination.value = { page, limit, total }
  claims.value = list.map(it => ({
    ...it,
    amount: BigInt(it.amount),
  }))
}

const fetchData = async () => {
  if (!profile.value) {
    reset()
    return
  }

  await Promise.all([
    fetchRebates(),
    fetchClaims(),
  ])
}

const checkRebatesValid = async () => {
  const { list } = rebates.value
  const valids = await pMap(list, async item => {
    return isValidRebate(account.value, item.chainId, item.amount, item.nonce, item.proof)
  }, { concurrency: 3 })

  rebates.value = {
    ...rebates.value,
    list: list.map((it, index) => ({
      ...it,
      valid: valids[index],
    })),
  }
}

/**
 * @param {import('@/types').Rebate} item
 */
const onClaim = async item => {
  const { chainId } = item
  if (chainId !== appChainId.value) {
    const success = await onSwitchNetwork(chainId)
    if (!success) {
      return
    }
    await wait(1000)
  }

  const success = await doClaim(claimAction, claiming, item, account.value)
  if (success) {
    checkRebatesValid()
  }
}

/**
 * @param {number} page
 */
const onUpdatePage = page => {
  pagination.value = {
    ...pagination.value,
    page,
  }

  fetchClaims()
}

const reset = () => {
  pagination.value = { page: 1, limit: 10, total: 0 }
  rebates.value = { current: 0n, claimed: 0n, available:0n, list: [] }
  claims.value = []
  claimAction.value = { show: false }
  claiming.value = false
  switching.value = false
}

onMounted(() => {
  const stopWatch = watch(profile, () => {
    fetchData()
  })
  onBeforeUnmount(stopWatch)

  fetchData()
})
</script>
