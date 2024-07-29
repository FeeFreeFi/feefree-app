import '@/assets/styles/index.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import usePage from "@/hooks/usePage"
import useScreen from "@/hooks/useScreen"
import useProviders from "@/hooks/useProviders"
import errorHandle from '@/utils/errorHandle'

usePage()
useScreen()
useProviders()

const app = createApp(App)
app.use(router)
app.use(errorHandle)

app.mount('#app')
