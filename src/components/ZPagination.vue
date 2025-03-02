<template>
  <div class="flex items-center gap-2 bg-my-gradient">
    <i-ff-skip-previous class="border border-solid rounded size-6" :class="[page > 1 ? 'border-primary/90 text-primary/90 cursor-pointer' : 'border-primary/50 text-primary/50 cursor-not-allowed']" @click="onSkipPrevious" />
    <i-ff-left-arrow class="border border-solid rounded size-6" :class="[page > 1 ? 'border-primary/90 text-primary/90 cursor-pointer' : 'border-primary/50 text-primary/50 cursor-not-allowed']" @click="onPrevious" />
    <div class="flex justify-center min-w-8">
      <n-text>{{ page }}/{{ total }}</n-text>
    </div>
    <i-ff-right-arrow class="border border-solid rounded size-6" :class="[page < total ? 'border-primary/90 text-primary/90 cursor-pointer' : 'border-primary/50 text-primary/50 cursor-not-allowed']" @click="onNext" />
    <i-ff-skip-next class="border border-solid rounded size-6" :class="[page < total ? 'border-primary/90 text-primary/90 cursor-pointer' : 'border-primary/50 text-primary/50 cursor-not-allowed']" @click="onSkipNext" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  page?: number
  total?: number
  onUpdatePage: (page: number) => void
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  total: 1,
})

const onSkipPrevious = () => {
  const { page, onUpdatePage } = props
  if (page <= 1) {
    return
  }

  onUpdatePage(1)
}

const onPrevious = () => {
  const { page, onUpdatePage } = props
  if (page <= 1) {
    return
  }

  onUpdatePage(page - 1)
}

const onNext = () => {
  const { page, total, onUpdatePage } = props
  if (page >= total) {
    return
  }

  onUpdatePage(page + 1)
}

const onSkipNext = () => {
  const { page, total, onUpdatePage } = props
  if (page >= total) {
    return
  }

  onUpdatePage(total)
}
</script>
