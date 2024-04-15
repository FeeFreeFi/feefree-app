import '@/assets/styles/index.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import useScreen from "@/hooks/useScreen"
import useTheme from "@/hooks/useTheme"
import useProviders from "@/hooks/useProviders"
import errorHandle from '@/utils/errorHandle'

useScreen()
useTheme()
useProviders()

const app = createApp(App)
app.use(router)
app.use(errorHandle)

app.mount('#app')
