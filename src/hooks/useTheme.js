import { computed, readonly, ref } from "vue"
import { generate } from '@ant-design/colors'
import { darkTheme } from 'naive-ui'

const DARK = "dark"
const LIGHT = "light"
const DARK_OPTS = { theme: DARK, backgroundColor: "#141414" }

const themeConfig = ref({
  primary: "#7f1fff",
  success: '#039855',
  warning: "#ad7307",
  error: "#e92084",
})

/**
 * @type {import('vue').Ref<DARK | LIGHT>}
 */
const themeModeRef = ref("")

/**
 *
 * @param {{[colorName:string]: string}} config
 * @param {boolean} isDark
 * @returns {import('naive-ui').GlobalThemeOverrides}
 */
const genThemeOverrides = (config, isDark) => {
  const scenes = [['', 5], ['Hover', 4], ['Pressed', 6], ['Suppl', 4]]
  const common = Object.fromEntries(Object.keys(config).map(name => {
    const color = config[name]
    const colors = generate(color, isDark ? DARK_OPTS : undefined)
    return scenes.map(([scene, index]) => [`${name}Color${scene}`, colors[index]])
  }).reduce((sum, item) => sum.concat(item), []))

  return {
    name: isDark ? DARK : LIGHT,
    common,
  }
}

const setThemeMode = value => {
  themeModeRef.value = value

  document.documentElement.classList.remove(DARK, LIGHT)
  document.documentElement.classList.add(value)
}

const onMediaChange = e => {
  setThemeMode(e.matches ? DARK : LIGHT)
}

export const themeMode = readonly(themeModeRef)
export const isDarkMode = computed(() => themeModeRef.value === DARK)

export const theme = computed(() => isDarkMode.value ? darkTheme : undefined)
export const themeOverrides = computed(() => genThemeOverrides(themeConfig.value, isDarkMode.value))

export const setThemeConfig = config => {
  themeConfig.value = {
    ...themeConfig.value,
    ...config,
  }
}

export const toggleThemeMode = () => {
  setThemeMode(isDarkMode.value ? LIGHT : DARK)
}

export default function install() {
  const media = window.matchMedia("(prefers-color-scheme: dark)")
  media.addEventListener('change', onMediaChange)
  onMediaChange(media)
}

