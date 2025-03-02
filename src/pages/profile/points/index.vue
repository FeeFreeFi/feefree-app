<template>
  <div class="relative flex flex-col flex-1 bg-container mx-auto my-4 sm:my-8 p-4 sm:p-8 rounded-2xl w-full sm:w-[490px] overflow-hidden">
    <div class="flex flex-col flex-1">
      <div class="flex justify-between items-center mb-4">
        <n-text class="font-medium text-lg">Points</n-text>
        <ZBack />
      </div>
      <div class="flex flex-col flex-1 gap-4 sm:gap-8 mt-4">
        <PointsOverview />
        <PointsList :total="pagination.total" :page="pagination.page" :list="pointsList" :on-update-page="onUpdatePage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Points } from '@/types'
import { getPoints } from '@/api'
import { profile } from '@/hooks/useUser'
import ZBack from '@/components/ZBack.vue'
import PointsOverview from './PointsOverview.vue'
import PointsList from './PointsList.vue'

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
})

const pointsList = ref<Points[]>([])

const reset = () => {
  pagination.value = { page: 1, limit: 10, total: 0 }
  pointsList.value = []
}

const fetchPoints = async () => {
  const { page, limit } = pagination.value

  const res = await getPoints({ page, limit })
  if (res.code !== 0) {
    console.log(res.message)
    return
  }

  const { total, list } = res.data
  pagination.value = { page, limit, total }
  pointsList.value = list
}

const fetchData = async () => {
  if (!profile.value) {
    reset()
    return
  }

  await fetchPoints()
}

const onUpdatePage = (page: number) => {
  pagination.value = {
    ...pagination.value,
    page,
  }

  fetchPoints()
}

onMounted(() => {
  const stopWatch = watch(profile, () => {
    fetchData()
  })
  onBeforeUnmount(stopWatch)

  fetchData()
})
</script>
