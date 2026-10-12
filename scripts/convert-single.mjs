/**
 * Converts a single HEIC file to JPEG next to the source file.
 * Usage: node scripts/convert-single.mjs <input.heic> <output.jpg>
 */
import heicConvert from 'heic-convert'
import { readFile, writeFile } from 'fs/promises'

const [,, input, output] = process.argv
if (!input || !output) {
  console.error('Usage: node scripts/convert-single.mjs <input.heic> <output.jpg>')
  process.exit(1)
}

const buf = await readFile(input)
const jpg = await heicConvert({ buffer: buf, format: 'JPEG', quality: 0.93 })
await writeFile(output, Buffer.from(jpg))
console.log(`✓ Converted → ${output}`)
