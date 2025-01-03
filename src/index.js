import '@/assets/styles/index.scss'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

import { createApp } from 'vue'

import App from './App.vue'
import router from '@/router'
import usePage from "@/hooks/usePage"
import useScreen from "@/hooks/useScreen"
import useWalletDetector from "@/hooks/useWalletDetector"
import errorHandle from '@/utils/errorHandle'

dayjs.extend(relativeTime)
dayjs.extend(utc)

usePage()
useScreen()
useWalletDetector()

const app = createApp(App)
app.use(router)
app.use(errorHandle)

app.mount('#app')
