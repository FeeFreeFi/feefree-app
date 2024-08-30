import MersenneTwister from "mersenne-twister"

const COLORS = [
  "#01888C", // teal
  "#FC7500", // bright orange
  "#034F5D", // dark teal
  "#F73F01", // orangered
  "#FC1960", // magenta
  "#C7144C", // raspberry
  "#F3C100", // goldenrod
  "#1598F2", // lightning blue
  "#2465E1", // sail blue
  "#F19E02", // gold
]

/**
 * @param {number} size
 * @param {number|number[]} seed
 */
const genSvg = (size, seed) => {
  const generator = new MersenneTwister(seed)

  const amount = generator.random() * 30 - 15
  const colors = COLORS.map(hex => colorRotate(hex, amount))

  const rects = [
    `<rect width="${size}" height="${size}" fill="${genColor(generator, colors)}" />`,
    genShape(generator, colors, size, 0, 3),
    genShape(generator, colors, size, 1, 3),
    genShape(generator, colors, size, 2, 3),
  ]

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">${rects.join("")}</svg>`
}

/**
 * @param {import('mersenne-twister')} generator
 * @param {string[]} colors
 */
function genColor(generator, colors) {
  generator.random()
  const idx = Math.floor(colors.length * generator.random())
  return colors.splice(idx, 1)[0]
}

/**
 * @param {import('mersenne-twister')} generator
 * @param {string[]} colors
 * @param {number} size
 * @param {number} i
 * @param {number} total
 */
function genShape(generator, colors, size, i, total) {
  const firstRot = generator.random()
  const angle = Math.PI * 2 * firstRot
  const velocity = (size / total) * generator.random() + (i * size) / total
  const tx = Math.cos(angle) * velocity
  const ty = Math.sin(angle) * velocity

  const secondRot = generator.random()
  const rot = firstRot * 360 + secondRot * 180
  const center = size / 2

  const transform = `translate(${tx} ${ty}) rotate(${rot.toFixed(1)} ${center} ${center})`
  const fill = genColor(generator, colors)

  return `<rect width="${size}" height="${size}" fill="${fill}" transform="${transform}" />`
}

/**
 * @param {string} hex
 * @param {number} degrees
 */
function colorRotate(hex, degrees) {
  const hsl = hexToHSL(hex)
  let hue = hsl.h
  hue = (hue + degrees) % 360
  hue = hue < 0 ? 360 + hue : hue
  hsl.h = hue
  return HSLToHex(hsl)
}

/**
 * @param {string} hex
 */
function hexToHSL(hex) {
  // Convert hex to RGB first
  let r = "0x" + hex[1] + hex[2]
  let g = "0x" + hex[3] + hex[4]
  let b = "0x" + hex[5] + hex[6]
  // Then to HSL
  r /= 255
  g /= 255
  b /= 255
  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin
  let h = 0
  let s = 0
  let l = 0

  if (delta === 0) h = 0
  else if (cmax === r) h = ((g - b) / delta) % 6
  else if (cmax === g) h = (b - r) / delta + 2
  else h = (r - g) / delta + 4

  h = Math.round(h * 60)

  if (h < 0) h += 360

  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return { h, s, l }
}

/**
 * @param {{h:number, s:number, l:number}} hsl
 */
function HSLToHex(hsl) {
  let { h, s, l } = hsl
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16)
  g = Math.round((g + m) * 255).toString(16)
  b = Math.round((b + m) * 255).toString(16)

  // Prepend 0s, if necessary
  if (r.length === 1) r = "0" + r
  if (g.length === 1) g = "0" + g
  if (b.length === 1) b = "0" + b

  return "#" + r + g + b
}

/**
 * @param {string} address
 * @param {number} size
 */
const jazzicon = (address, size = 64) => {
  const svg = genSvg(size, parseInt(address.slice(2, 10), 16))
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export default jazzicon
