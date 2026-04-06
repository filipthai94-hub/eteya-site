/**
 * Generate OG Image for Telestore Case Study
 * Usage: node scripts/generate-og-image.js
 * Output: public/images/og-telestore-case.jpg
 */

const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

// Constants
const WIDTH = 1200
const HEIGHT = 630
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'images', 'og-telestore-case.jpg')

// Colors
const COLORS = {
  bg: '#121212',
  bgGradient: '#1a1a1a',
  lime: '#C8FF00',
  limeDark: '#b8ef00',
  white: '#ffffff',
  whiteMuted: 'rgba(255, 255, 255, 0.6)',
  whiteDim: 'rgba(255, 255, 255, 0.5)',
}

// Create canvas
const canvas = createCanvas(WIDTH, HEIGHT)
const ctx = canvas.getContext('2d')

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
gradient.addColorStop(0, COLORS.bg)
gradient.addColorStop(1, COLORS.bgGradient)
ctx.fillStyle = gradient
ctx.fillRect(0, 0, WIDTH, HEIGHT)

// Lime accent glow (top right)
const glowGradient = ctx.createRadialGradient(
  WIDTH * 0.8, 
  HEIGHT * 0.2, 
  0,
  WIDTH * 0.8, 
  HEIGHT * 0.2, 
  400
)
glowGradient.addColorStop(0, 'rgba(200, 255, 0, 0.15)')
glowGradient.addColorStop(1, 'transparent')
ctx.fillStyle = glowGradient
ctx.fillRect(0, 0, WIDTH, HEIGHT)

// Tag (top left)
ctx.fillStyle = COLORS.lime
ctx.font = 'bold 14px "Geist", sans-serif'
ctx.letterSpacing = '0.1em'
ctx.fillText('CASE STUDY', 60, 80)

// Logo (top right)
ctx.font = 'bold 24px "Geist", sans-serif'
ctx.fillStyle = COLORS.white
ctx.textAlign = 'right'
ctx.fillText('ETEYA', WIDTH - 60, 80)
ctx.fillStyle = COLORS.lime
ctx.fillText('.AI', WIDTH - 60 + 70, 80)
ctx.textAlign = 'left'

// Main title
ctx.fillStyle = COLORS.white
ctx.font = '600 72px "Geist", sans-serif'
ctx.textAlign = 'center'
ctx.fillText('Telestore Case Study', WIDTH / 2, 240)

// Highlight number (large)
ctx.font = 'bold 96px "Geist", sans-serif'
const highlightGradient = ctx.createLinearGradient(0, 280, 0, 380)
highlightGradient.addColorStop(0, COLORS.lime)
highlightGradient.addColorStop(1, COLORS.limeDark)
ctx.fillStyle = highlightGradient
ctx.fillText('390 000 kr/år', WIDTH / 2, 360)

// Subtitle
ctx.fillStyle = COLORS.whiteMuted
ctx.font = '400 32px "Geist", sans-serif'
ctx.fillText('i besparing med AI', WIDTH / 2, 420)

// Stats row
const stats = [
  { value: '1 350h', label: 'Sparad tid/år' },
  { value: '56', label: 'Automationer' },
]

const statSpacing = WIDTH / (stats.length + 1)
stats.forEach((stat, index) => {
  const x = statSpacing * (index + 1)
  const y = 520
  
  // Value
  ctx.fillStyle = COLORS.lime
  ctx.font = 'bold 48px "Geist", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(stat.value, x, y)
  
  // Label
  ctx.fillStyle = COLORS.whiteDim
  ctx.font = '400 16px "Geist", sans-serif'
  ctx.fillText(stat.label, x, y + 30)
})

// Reset text align
ctx.textAlign = 'left'

// Write to file
const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 })
fs.writeFileSync(OUTPUT_PATH, buffer)

console.log(`✅ OG Image generated successfully!`)
console.log(`📁 Output: ${OUTPUT_PATH}`)
console.log(`📐 Size: ${WIDTH}x${HEIGHT}px`)
console.log(`💾 File size: ${(buffer.length / 1024).toFixed(2)} KB`)
