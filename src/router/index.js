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
  PAGE_NFT_HOME,
  PAGE_PROFILE_HOME,
  PAGE_PROFILE_POINTS,
  PAGE_PROFILE_REWARD,
  PAGE_PROFILE_FANS,
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
        path: "nft",
        name: PAGE_NFT_HOME,
        component: () => import('@/pages/nft/home/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: "profile",
        name: PAGE_PROFILE_HOME,
        component: () => import('@/pages/profile/home/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: "profile/points",
        name: PAGE_PROFILE_POINTS,
        component: () => import('@/pages/profile/points/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: "profile/reward",
        name: PAGE_PROFILE_REWARD,
        component: () => import('@/pages/profile/reward/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: "profile/fans",
        name: PAGE_PROFILE_FANS,
        component: () => import('@/pages/profile/fans/index.vue'),
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
