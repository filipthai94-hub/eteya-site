import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'

const require = createRequire('/home/openclaw/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js')
const { chromium } = require('playwright')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templatePath = path.join(__dirname, 'pdf-template.html')
const outputPath = path.join(__dirname, '..', 'public', 'eteya-roi-methodology.pdf')

async function generatePDF() {
  console.log('🚀 Launching browser...')
  const browser = await chromium.launch()
  const page = await browser.newPage()

  console.log('📄 Loading template...')
  await page.goto(`file://${templatePath}`, { waitUntil: 'networkidle' })

  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1000)

  console.log('🖨️  Generating PDF...')
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true,
  })

  await browser.close()
  console.log(`✅ PDF saved to: ${outputPath}`)
}

generatePDF().catch(console.error)
