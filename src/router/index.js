import { createRouter, createWebHistory } from 'vue-router'
import {
  APP_PRODUCT_NAME,
  PAGE_HOME,
  PAGE_POOL_HOME,
  PAGE_POOL_DETAIL,
  PAGE_EXCHANGE,
  PAGE_NFT_HOME,
  PAGE_NOT_FOUND,
} from "@/config"
import { isValidPool } from "@/hooks/useSwap"

import DefaultLayout from "@/layouts/index.vue"
import PageHome from "@/pages/home/index.vue"

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: PAGE_HOME,
        component: PageHome,
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: "pool",
        name: PAGE_POOL_HOME,
        component: () => import('@/pages/pool/home/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: "pool/:id",
        name: PAGE_POOL_DETAIL,
        component: () => import('@/pages/pool/detail/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
        beforeEnter: to => {
          if (!isValidPool(to.params.id)) {
            return { name: PAGE_NOT_FOUND }
          }
        },
      },
      {
        path: "exchange",
        name: PAGE_EXCHANGE,
        component: () => import('@/pages/exchange/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: "nft",
        name: PAGE_NFT_HOME,
        component: () => import('@/pages/nft/home/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: "not-found",
        name: PAGE_NOT_FOUND,
        component: () => import('@/pages/404/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
    ]
  },
  {
    path: '/:_(.*)*',
    redirect: () => {
      return { name: PAGE_NOT_FOUND, query: null, search: null }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ y: 0 }),
})

router.afterEach(to => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
