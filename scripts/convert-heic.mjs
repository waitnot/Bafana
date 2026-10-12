/**
 * convert-heic.mjs
 * Converts all .heic / .HEIC files found under src/assets/rooms and public/rooms
 * into .jpg files in the same folder, then reports results.
 */

import heicConvert from 'heic-convert'
import { readFile, writeFile, readdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

// All folders to scan
const scanDirs = [
  path.join(root, 'src', 'assets', 'rooms'),
  path.join(root, 'public', 'rooms'),
]

async function getHeicFiles(dir) {
  if (!existsSync(dir)) return []
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await getHeicFiles(full))
    } else if (/\.(heic|HEIC)$/.test(entry.name)) {
      files.push(full)
    }
  }
  return files
}

async function convert(filePath) {
  const outPath = filePath.replace(/\.(heic|HEIC)$/, '.jpg')
  if (existsSync(outPath)) {
    console.log(`  skip  ${path.relative(root, outPath)} (already exists)`)
    return { skipped: true }
  }
  const input = await readFile(filePath)
  const output = await heicConvert({ buffer: input, format: 'JPEG', quality: 0.92 })
  await writeFile(outPath, Buffer.from(output))
  console.log(`  ✓     ${path.relative(root, outPath)}`)
  return { skipped: false }
}

async function main() {
  console.log('\n── HEIC → JPEG Conversion ──\n')
  let total = 0, converted = 0, skipped = 0

  for (const dir of scanDirs) {
    const files = await getHeicFiles(dir)
    if (files.length === 0) continue
    console.log(`Scanning: ${path.relative(root, dir)}`)
    for (const f of files) {
      total++
      const { skipped: s } = await convert(f)
      s ? skipped++ : converted++
    }
  }

  console.log(`\nDone. ${converted} converted, ${skipped} skipped, ${total} total.\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
