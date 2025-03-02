#!/usr/bin/env -S npx tsx

/// <reference types="node" />

import type { GlobalThemeOverrides } from 'naive-ui'
import Color from 'colorjs.io'

const toRGBHex = (color: string) => new Color(color).to('srgb').toString({ format: 'hex' })

const colorMix = (baseColor: string, mixColor: string, percentage: number, options: {
  space?: 'oklch' | 'srgb'
  format?: 'oklch' | 'srgb' | 'hex'
} = {}) => {
  const { space = 'oklch', format = 'oklch' } = options

  try {
    const color1 = new Color(baseColor).to(space)
    const color2 = new Color(mixColor).to(space)

    const mixed = color1.mix(color2, percentage / 100, { space })

    if (format === 'srgb' || format === 'hex') {
      const converted = mixed.to('srgb').toGamut()
      return format === 'hex' ? converted.toString({ format }) : converted.toString()
    }

    return mixed.to(format).toString()
  } catch (error) {
    console.error('Color mixing error:', error)
    return baseColor
  }
}

const generateNaiveUIColors = (baseColor: string, name: string) => {
  return {
    [`${name}Color`]: toRGBHex(baseColor),
    [`${name}ColorHover`]: colorMix(baseColor, 'white', 10, { format: 'hex' }),
    [`${name}ColorPressed`]: colorMix(baseColor, 'black', 10, { format: 'hex' }),
    [`${name}ColorSuppl`]: colorMix(baseColor, 'white', 20, { format: 'hex' }),
  }
}

/**
 * @usage
 * ```bash
 * # Windows
 * npx tsx ./scripts/generate-naiveui-theme.ts
 *
 * # MaxOS & Linux
 * ./scripts/generate-naiveui-theme.ts
 * ```
 */
const main = async () => {
  const baseColors = {
    primary: 'oklch(0.87 0.15 174.76)',
    success: 'oklch(0.85 0.2 147.21)',
    warning: 'oklch(0.82 0.15 79.64)',
    error: 'oklch(0.64 0.22 25.72)',
  }

  const naiveThemeColors = Object.fromEntries(
    Object.entries(baseColors).flatMap(([name, baseColor]) => {
      return Object.entries(generateNaiveUIColors(baseColor, name))
    }),
  )

  const themeOverrides: GlobalThemeOverrides = {
    common: {
      ...naiveThemeColors,
    },
  }

  console.log(JSON.stringify(themeOverrides, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/: "([^"]+)",?/g, `: '$1',`))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
