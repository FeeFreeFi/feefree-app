<template>
  <div class="flex flex-col relative overflow-hidden mx-auto my-4 sm:my-8 flex-1 w-full sm:w-[490px] p-4 sm:p-8 bg-container rounded-20">
    <div class="flex-1 flex flex-col">
      <div class="mb-4 flex items-center justify-between">
        <n-text class="text-lg font-medium">Points</n-text>
        <ZBack />
      </div>
      <div class="mt-4 flex-1 flex flex-col gap-4 sm:gap-8">
        <PointsOverview />
        <PointsList :total="pagination.total" :page="pagination.page" :list="pointsList" :on-update-page="onUpdatePage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

/**
 * @type {import('vue').Ref<import('@/types').Points[]>}
 */
const pointsList = ref([])

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

/**
 * @param {number} page
 */
const onUpdatePage = page => {
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
