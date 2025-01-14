<template>
  <div class="flex flex-col relative overflow-hidden mx-auto my-4 sm:my-8 flex-1 w-full sm:w-[490px] p-4 sm:p-8 bg-container rounded-20">
    <div class="flex-1 flex flex-col">
      <div class="mb-4 flex items-center justify-between">
        <n-text class="text-lg font-medium">Reward</n-text>
        <ZBack />
      </div>
      <div class="flex-1 flex flex-col gap-4 sm:gap-8">
        <RewardOverview :current="rewards.current" :claimed="rewards.claimed" />
        <AvailableRewards v-if="rewards.list.length > 0" :claiming="claiming" :list="rewards.list" :on-claim="onClaim" />
        <ClaimHistory :total="pagination.total" :page="pagination.page" :list="claims" :on-update-page="onUpdatePage" />
      </div>
    </div>
    <ClaimModal v-model="claimAction" />
  </div>
</template>

<script setup lang="ts">
import type { Claim, ClaimAction, Reward } from '@/types'
import { useNotification } from 'naive-ui'
import pMap from 'p-map'
import { getClaims, getRewards } from '@/api'
import { wait } from '@/utils'
import { profile } from '@/hooks/useUser'
import { doSend, doSwitchNetwork } from '@/hooks/useInteraction'
import { appChainId } from '@/hooks/useAppState'
import { account } from '@/hooks/useWallet'
import { claim, isValidReward } from '@/hooks/useReward'
import ZBack from '@/components/ZBack.vue'
import ClaimModal from './ClaimModal.vue'
import RewardOverview from './RewardOverview.vue'
import AvailableRewards from './AvailableRewards.vue'
import ClaimHistory from './ClaimHistory.vue'

const notification = useNotification()

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
})

const rewards = ref({
  current: 0n,
  claimed: 0n,
  available: 0n,
  list: [] as (Reward & { valid: boolean })[],
})

const claims = ref<Claim[]>([])

const claimAction = ref<ClaimAction>({ show: false })

const claiming = ref(false)

const switching = ref(false)

const onSwitchNetwork = async (chainId: number) => {
  switching.value = await doSwitchNetwork(notification, chainId)
  return true
}

const reset = () => {
  pagination.value = { page: 1, limit: 10, total: 0 }
  rewards.value = { current: 0n, claimed: 0n, available: 0n, list: [] }
  claims.value = []
  claimAction.value = { show: false }
  claiming.value = false
  switching.value = false
}

const checkRewardsValid = async () => {
  const { list } = rewards.value
  const valids = await pMap(list, async item => {
    const { chainId, address, amount, nonce, proof } = item
    return isValidReward(chainId, address, account.value, amount, nonce, proof)
  }, { concurrency: 3 })

  rewards.value = {
    ...rewards.value,
    list: list.map((it, index) => ({
      ...it,
      valid: valids[index],
    })),
  }
}

const fetchRewards = async () => {
  const res = await getRewards()
  if (res.code !== 0) {
    console.log(res.message)
    return
  }

  const { current, claimed, available, list } = res.data
  rewards.value = {
    current: BigInt(current),
    claimed: BigInt(claimed),
    available: BigInt(available),
    list: list.map(it => ({
      ...it,
      amount: BigInt(it.amount),
      valid: false,
    })),
  }

  checkRewardsValid()
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
    fetchRewards(),
    fetchClaims(),
  ])
}

const onClaim = async (reward: Reward) => {
  const { chainId } = reward
  if (chainId !== appChainId.value) {
    const success = await onSwitchNetwork(chainId)
    if (!success) {
      return
    }
    await wait(1000)
  }

  claimAction.value.data = { chainId, reward }
  const success = await doSend(claimAction, claiming, 'Claim', () => claim(reward))

  if (success) {
    checkRewardsValid()
  }
}

const onUpdatePage = (page: number) => {
  pagination.value = {
    ...pagination.value,
    page,
  }

  fetchClaims()
}

onMounted(() => {
  const stopWatch = watch(profile, () => {
    fetchData()
  })
  onBeforeUnmount(stopWatch)

  fetchData()
})
</script>
