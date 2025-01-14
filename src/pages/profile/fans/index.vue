<template>
  <div class="flex flex-col relative overflow-hidden mx-auto my-4 sm:my-8 flex-1 w-full sm:w-[490px] p-4 sm:p-8 bg-container rounded-20">
    <div class="flex-1 flex flex-col">
      <div class="mb-4 flex items-center justify-between">
        <n-text class="text-lg font-medium">Fans</n-text>
        <ZBack />
      </div>
      <div class="mt-4 flex-1 flex flex-col gap-4 sm:gap-8">
        <FansOverview />
        <FansList :total="pagination.total" :page="pagination.page" :list="fansList" :on-update-page="onUpdatePage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Fans } from '@/types'
import { getFans } from '@/api'
import { profile } from '@/hooks/useUser'
import ZBack from '@/components/ZBack.vue'
import FansOverview from './FansOverview.vue'
import FansList from './FansList.vue'

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
})

const fansList = ref<Fans[]>([])

const reset = () => {
  pagination.value = { page: 1, limit: 10, total: 0 }
  fansList.value = []
}

const fetchFans = async () => {
  const { page, limit } = pagination.value

  const res = await getFans({ page, limit })
  if (res.code !== 0) {
    console.log(res.message)
    return
  }

  const { total, list } = res.data
  pagination.value = { page, limit, total }
  fansList.value = list
}

const fetchData = async () => {
  if (!profile.value) {
    reset()
    return
  }

  await fetchFans()
}

const onUpdatePage = (page: number) => {
  pagination.value = {
    ...pagination.value,
    page,
  }

  fetchFans()
}

onMounted(() => {
  const stopWatch = watch(profile, () => {
    fetchData()
  })
  onBeforeUnmount(stopWatch)

  fetchData()
})
</script>
