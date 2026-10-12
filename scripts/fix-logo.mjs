/**
 * fix-logo.mjs
 * Re-processes logo.png preserving transparency (alpha channel).
 */
import sharp from 'sharp'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const files = [
  'src/assets/logo.png',
  'src/assets/hero.png',
  'src/assets/cropped_circle_image.png',
  'src/assets/brand/brand1-1.png',
  'src/assets/brand/brand2-1.png',
  'src/assets/brand/pat3-hires-1.png',
  'src/assets/brand/pattern1-1.png',
  'src/assets/brand/pattern2-1.png',
  'src/assets/brand/pattern3-1.png',
]

for (const rel of files) {
  const filePath = path.join(root, rel)
  const input = await readFile(filePath)
  const meta = await sharp(input).metadata()
  const hasAlpha = meta.channels === 4 || meta.hasAlpha

  const output = await sharp(input)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .png({
      compressionLevel: 8,
      // preserve alpha — never flatten
    })
    .toBuffer()

  await writeFile(filePath, output)
  const kb = (output.length / 1024).toFixed(0)
  console.log(`✓ ${rel} (${hasAlpha ? 'has alpha' : 'no alpha'}) → ${kb} KB`)
}

console.log('\nDone.')
