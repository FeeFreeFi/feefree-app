import '@/assets/styles/index.css'

import { createApp } from 'vue'
import '@/libs/dayjs'

import App from './App.vue'

import router from '@/router'
import usePage from '@/hooks/usePage'
import useScreen from '@/hooks/useScreen'
import useWalletDetector from '@/hooks/useWalletDetector'
import { errorHandle } from '@/utils'

usePage()
useScreen()
useWalletDetector()

createApp(App)
  .use(router)
  .use(errorHandle)
  .mount('#app')
