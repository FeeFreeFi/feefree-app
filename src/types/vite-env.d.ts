/// <reference types="vite/client" />

interface ImportMetaEnv {
  MODE: string
  BASE_URL: string
  PROD: boolean
  DEV: boolean
  SSR: boolean

  VITE_APP_NAME: string
  VITE_APP_PRODUCT_NAME: string
  VITE_APP_DESCRIPTION: string
  VITE_APP_VERSION: string
  VITE_API_BASE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
