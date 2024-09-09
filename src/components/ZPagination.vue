<template>
  <div class="flex items-center gap-2 bg-my-gradient">
    <i-ff-skip-previous class="size-6 rounded border border-solid" :class="[page > 1 ? 'border-primary/90 text-primary/90 cursor-pointer' : 'border-primary/50 text-primary/50 cursor-not-allowed']" @click="onSkipPrevious" />
    <i-ff-left-arrow class="size-6 rounded border border-solid" :class="[page > 1 ? 'border-primary/90 text-primary/90 cursor-pointer' : 'border-primary/50 text-primary/50 cursor-not-allowed']" @click="onPrevious" />
    <div class="min-w-8 flex justify-center">
      <n-text>{{ page }}/{{ total }}</n-text>
    </div>
    <i-ff-right-arrow class="size-6 rounded border border-solid" :class="[page < total ? 'border-primary/90 text-primary/90 cursor-pointer' : 'border-primary/50 text-primary/50 cursor-not-allowed']" @click="onNext" />
    <i-ff-skip-next class="size-6 rounded border border-solid" :class="[page < total ? 'border-primary/90 text-primary/90 cursor-pointer' : 'border-primary/50 text-primary/50 cursor-not-allowed']" @click="onSkipNext" />
  </div>
</template>

<script setup>
const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    required: true,
  },
  onUpdatePage: {
    /**
     * @type {import('vue').PropType<(page:number) => Promise>}
     */
    type: Function,
    required: true,
  },
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
