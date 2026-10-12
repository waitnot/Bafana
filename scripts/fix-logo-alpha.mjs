/**
 * fix-logo-alpha.mjs
 * Removes the black background from logo.png by making dark pixels transparent.
 */
import sharp from 'sharp'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const logoPath = path.join(root, 'src', 'assets', 'logo.png')

const input = await readFile(logoPath)

// Get raw RGBA pixel data
const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const pixels = new Uint8Array(data)

// Make near-black pixels transparent
// Threshold: if R < 30 && G < 30 && B < 30 → alpha = 0
for (let i = 0; i < pixels.length; i += channels) {
  const r = pixels[i]
  const g = pixels[i + 1]
  const b = pixels[i + 2]
  if (r < 30 && g < 30 && b < 30) {
    pixels[i + 3] = 0 // transparent
  }
}

const output = await sharp(Buffer.from(pixels), {
  raw: { width, height, channels }
})
  .png({ compressionLevel: 8 })
  .toBuffer()

await writeFile(logoPath, output)
console.log(`✓ Logo background removed — ${(output.length / 1024).toFixed(0)} KB`)
