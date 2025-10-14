import process from 'node:process'
import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import UnpluginIcons from 'unplugin-icons/vite'
import UnpluginIconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import viteRemove from 'unplugin-remove/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { analyzer } from 'vite-bundle-analyzer'
import pkg from './package.json'

function buildTestRegexp(deps: string[]) {
  const seperator = '[\\/]'
  const items = deps.map(it => it.replace('/', seperator))

  return new RegExp(`${seperator}node_modules${seperator}(${items.join('|')})`)
}

function getRuntimeEnv(env: Record<string, any> = {}) {
  const { name, productName, description, version } = pkg
  return {
    VITE_APP_NAME: name,
    VITE_APP_PRODUCT_NAME: productName,
    VITE_APP_DESCRIPTION: description,
    VITE_APP_VERSION: version,
    ...env,
  }
}

function getDefine(env: Record<string, any> = {}) {
  const prefix = 'import.meta.env'

  return Object.fromEntries(Object.entries(env).map(([key, value]) => [`${prefix}.${key}`, JSON.stringify(value)]))
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const customIconNamespace = 'ff'
  const isDebugMode = mode === 'debug'
  const isProduction = process.env.NODE_ENV === 'production'
  console.log(`mode: ${mode}, NODE_ENV: ${process.env.NODE_ENV}`)

  return {
    define: getDefine(getRuntimeEnv()),
    plugins: [
      vue(),
      vueJsx(),
      tailwindcss(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: 'src/types/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: 'src/types/auto-imports.json',
        },
      }),
      Components({
        dts: 'src/types/components.d.ts',
        dirs: [],
        resolvers: [
          UnpluginIconsResolver({
            customCollections: [customIconNamespace],
          }),
          NaiveUiResolver(),
        ],
      }),
      UnpluginIcons({
        customCollections: {
          [customIconNamespace]: FileSystemIconLoader('src/assets/icons'),
        },
      }),
      isProduction && !isDebugMode && viteRemove({ consoleType: ['debug', 'error', 'info', 'log', 'warn'] }),
      !isProduction && vueDevTools(),
      isDebugMode && analyzer(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      dedupe: ['viem'],
      conditions: ['import', 'module', 'browser', 'default'],
    },
    build: {
      rollupOptions: {
        output: {
          advancedChunks: {
            groups: [
              {
                name: 'naive-ui',
                test: buildTestRegexp([
                  'naive-ui',
                  '@css-render/plugin-bem',
                  '@css-render/vue3-ssr',
                  'async-validator',
                  'css-render',
                  'csstype',
                  'date-fns',
                  'date-fns-tz',
                  'evtd',
                  'highlight.js',
                  'seemly',
                  'treemate',
                  'vdirs',
                  'vooks',
                  'vueuc',
                  '@emotion/hash',
                  '@juggle/resize-observer',
                ]),
                priority: 20,
              },
              {
                name: 'noble',
                test: buildTestRegexp([
                  '@noble/curves',
                  '@noble/hashes',
                  '@noble/ciphers',
                  '@scure/base',
                  '@scure/bip32',
                  '@scure/bip39',
                ]),
                priority: 15,
              },
              {
                name: 'viem',
                test: buildTestRegexp([
                  'viem',
                  'abitype',
                  'isows',
                  'ws',
                  'ox',
                  '@adraffy/ens-normalize',
                ]),
                priority: 10,
              },
              {
                name: 'safe',
                test: buildTestRegexp([
                  '@safe-global/safe-apps-provider',
                  '@safe-global/safe-apps-sdk',
                  '@safe-global/safe-gateway-typescript-sdk',
                  'events',
                ]),
                priority: 5,
              },
              {
                name: 'sketch',
                test: /([\\/]libs[\\/]sketch[\\/])|([\\/]src[\\/]vendors[\\/](q5|snowflakes))/,
                priority: 3,
              },
              {
                name: 'vendor',
                test: /[\\/]node_modules[\\/]/,
                priority: 1,
              },
            ],
          },
        },
      },
    },
  }
})
