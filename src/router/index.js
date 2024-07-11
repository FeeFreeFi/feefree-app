import { createRouter, createWebHistory } from 'vue-router'
import {
  Patterns,
  APP_PRODUCT_NAME,
  PAGE_HOME,
  PAGE_POOL_HOME,
  PAGE_POOL_OVERVIEW,
  PAGE_POOL_POSITION,
  PAGE_POOL_DEPOSIT,
  PAGE_POOL_WITHDRAW,
  PAGE_EXCHANGE,
  PAGE_NFT_HOME,
  PAGE_FAUCET,
  PAGE_NOT_FOUND,
} from "@/config"
import { isValidPool } from "@/hooks/useSwap"

import DefaultLayout from "@/layouts/index.vue"
import PageHome from "@/pages/home/index.vue"

/**
 * @type {import('vue-router').RouteLocationRaw[]}
 */
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
        beforeEnter: to => {
          const { referral, ...rest } = to.query
          if (referral && !Patterns.Referral.test(referral)) {
            return { name: PAGE_HOME, query: rest }
          }
        },
      },
      {
        path: "pool",
        name: PAGE_POOL_HOME,
        component: () => import('@/pages/pool/home/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: "pool/:id",
        component: () => import('@/pages/pool/detail/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
        beforeEnter: to => {
          const id = to.params.id
          if (!Patterns.PoolId.test(id) || !isValidPool(id)) {
            return { name: PAGE_NOT_FOUND }
          }
        },
        children: [
          {
            path: "",
            name: PAGE_POOL_OVERVIEW,
            component: () => import('@/pages/pool/detail/overview/index.vue'),
          },
          {
            path: "position",
            name: PAGE_POOL_POSITION,
            component: () => import('@/pages/pool/detail/position/index.vue'),
          },
          {
            path: "deposit",
            name: PAGE_POOL_DEPOSIT,
            component: () => import('@/pages/pool/detail/deposit/index.vue'),
          },
          {
            path: "withdraw",
            name: PAGE_POOL_WITHDRAW,
            component: () => import('@/pages/pool/detail/withdraw/index.vue'),
          },
        ]
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
        path: "faucet",
        name: PAGE_FAUCET,
        component: () => import('@/pages/faucet/index.vue'),
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
