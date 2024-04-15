import dotenv from 'dotenv-flow'
import fs from "fs-extra"
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const { PRICE_API_KEY } = process.env

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = path.resolve(__dirname, "..")

const { version, name, productName, description }  = fs.readJsonSync(path.resolve(root, 'package.json'))

const APP_META = {
  APP_NAME: JSON.stringify(name),
  APP_PRODUCT_NAME: JSON.stringify(productName),
  APP_VERSION: JSON.stringify(version),
}

export const appMeta = { version, name, productName, description }

export const getDefinition = (dev = false) => {
  const env = {
    NODE_ENV: JSON.stringify(dev ? 'development' : 'production'),
    PRICE_API_KEY: JSON.stringify(PRICE_API_KEY),
    ...APP_META,
  }

  console.log("============== ENV ==============")
  console.log(Object.entries(env).map(([key, value]) => `${key}: ${JSON.parse(value)}`).join("\n"))
  console.log("============== ENV ==============")

  return {
    'process.env': env,
    __VUE_OPTIONS_API__: JSON.stringify(true),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(dev),
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(dev),
  }
}

export const dirs = {
  root,
  src: path.join(root, "src"),
  dist: path.join(root, "dist"),
}
