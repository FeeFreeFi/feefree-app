import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import {
  Patterns,
  APP_PRODUCT_NAME,
  PAGE_HOME,
  PAGE_POOL_HOME,
  // PAGE_POOL_CREATE,
  PAGE_POOL_OVERVIEW,
  PAGE_POOL_POSITION,
  PAGE_POOL_DEPOSIT,
  PAGE_POOL_WITHDRAW,
  // PAGE_LAUNCH,
  PAGE_NFT_HOME,
  PAGE_PROFILE_HOME,
  PAGE_PROFILE_POINTS,
  PAGE_PROFILE_REWARD,
  PAGE_PROFILE_FANS,
  PAGE_NOT_FOUND,
  PAGE_MIGRATE,
} from '@/config'

import DefaultLayout from '@/layouts/index.vue'
import PageHome from '@/pages/home/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: PAGE_HOME,
        component: PageHome,
        meta: { title: APP_PRODUCT_NAME },
        beforeEnter: to => {
          const { referral, ...rest } = to.query
          if (referral && !Patterns.Referral.test(referral as string)) {
            return { name: PAGE_HOME, query: rest }
          }
        },
      },
      {
        path: 'pool',
        name: PAGE_POOL_HOME,
        component: () => import(/* webpackChunkName: "pool" */ '@/pages/pool/home/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      // {
      //   path: "pool/create",
      //   name: PAGE_POOL_CREATE,
      //   component: () => import(/* webpackChunkName: "pool-create" */ '@/pages/pool/create/index.vue'),
      //   meta: { title: APP_PRODUCT_NAME },
      // },
      {
        path: 'pool/:id',
        component: () => import(/* webpackChunkName: "detail" */ '@/pages/pool/pages/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
        beforeEnter: to => {
          const { id } = to.params
          if (!Patterns.POOL_ID.test(id as string)) {
            return { name: PAGE_NOT_FOUND }
          }
        },
        children: [
          {
            path: '',
            name: PAGE_POOL_OVERVIEW,
            component: () => import(/* webpackChunkName: "overview" */ '@/pages/pool/pages/overview/index.vue'),
          },
          {
            path: 'position',
            name: PAGE_POOL_POSITION,
            component: () => import(/* webpackChunkName: "position" */ '@/pages/pool/pages/position/index.vue'),
          },
          {
            path: 'deposit',
            name: PAGE_POOL_DEPOSIT,
            component: () => import(/* webpackChunkName: "deposit" */ '@/pages/pool/pages/deposit/index.vue'),
          },
          {
            path: 'withdraw',
            name: PAGE_POOL_WITHDRAW,
            component: () => import(/* webpackChunkName: "withdraw" */ '@/pages/pool/pages/withdraw/index.vue'),
          },
        ],
      },
      // {
      //   path: "launch",
      //   name: PAGE_LAUNCH,
      //   component: () => import(/* webpackChunkName: "launch" */ '@/pages/launch/index.vue'),
      //   meta: { title: APP_PRODUCT_NAME },
      // },
      {
        path: 'nft',
        name: PAGE_NFT_HOME,
        component: () => import(/* webpackChunkName: "nft" */ '@/pages/nft/home/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: 'migrate',
        name: PAGE_MIGRATE,
        component: () => import(/* webpackChunkName: "migrate" */ '@/pages/migrate/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: 'profile',
        name: PAGE_PROFILE_HOME,
        component: () => import(/* webpackChunkName: "profile" */ '@/pages/profile/home/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: 'profile/points',
        name: PAGE_PROFILE_POINTS,
        component: () => import(/* webpackChunkName: "points" */ '@/pages/profile/points/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: 'profile/reward',
        name: PAGE_PROFILE_REWARD,
        component: () => import(/* webpackChunkName: "reward" */ '@/pages/profile/reward/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: 'profile/fans',
        name: PAGE_PROFILE_FANS,
        component: () => import(/* webpackChunkName: "fans" */ '@/pages/profile/fans/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
      {
        path: 'not-found',
        name: PAGE_NOT_FOUND,
        component: () => import(/* webpackChunkName: "404" */ '@/pages/404/index.vue'),
        meta: { title: APP_PRODUCT_NAME },
      },
    ],
  },
  {
    path: '/:_(.*)*',
    redirect: () => {
      return { name: PAGE_NOT_FOUND, query: undefined, search: null }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach(to => {
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
})

export default router
