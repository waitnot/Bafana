/**
 * compress-images.mjs
 * Resizes and compresses all JPG/JPEG/PNG images in src/assets and public/rooms
 * in-place using sharp. Target: max 1920px wide, JPEG quality 75.
 */

import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const scanDirs = [
  path.join(root, 'src', 'assets'),
  path.join(root, 'public', 'rooms'),
]

const MAX_WIDTH  = 1920
const MAX_HEIGHT = 1080
const QUALITY    = 75

async function getImageFiles(dir) {
  let files = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await getImageFiles(full))
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      files.push(full)
    }
  }
  return files
}

async function compress(filePath) {
  const before = (await stat(filePath)).size
  const tmp = filePath + '.tmp'

  await sharp(filePath)
    .resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmp)

  const { rename, unlink } = await import('fs/promises')
  await rename(tmp, filePath)

  const after = (await stat(filePath)).size
  const saved = ((1 - after / before) * 100).toFixed(1)
  const bMB   = (before / 1024 / 1024).toFixed(2)
  const aMB   = (after  / 1024 / 1024).toFixed(2)
  console.log(`  ✓  ${path.relative(root, filePath).padEnd(60)} ${bMB}MB → ${aMB}MB  (-${saved}%)`)
  return { before, after }
}

async function main() {
  console.log('\n── Image Compression ──\n')
  let totalBefore = 0, totalAfter = 0, count = 0

  for (const dir of scanDirs) {
    const files = await getImageFiles(dir)
    if (!files.length) continue
    console.log(`Scanning: ${path.relative(root, dir)}\n`)
    for (const f of files) {
      try {
        const { before, after } = await compress(f)
        totalBefore += before
        totalAfter  += after
        count++
      } catch (e) {
        console.warn(`  ✗  SKIP ${path.relative(root, f)} — ${e.message}`)
      }
    }
  }

  const savedMB   = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)
  const savedPct  = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
  const beforeMB  = (totalBefore / 1024 / 1024).toFixed(1)
  const afterMB   = (totalAfter  / 1024 / 1024).toFixed(1)

  console.log(`\n─────────────────────────────────────────────`)
  console.log(`Done. ${count} images compressed.`)
  console.log(`Total: ${beforeMB} MB → ${afterMB} MB  (saved ${savedMB} MB / ${savedPct}%)\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
