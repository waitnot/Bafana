/**
 * compress-rooms.mjs
 * Compresses large room images in src/assets/rooms using writeFile (no rename).
 */
import sharp from 'sharp'
import { readdir, stat, writeFile, readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const roomsDir = path.join(root, 'src', 'assets', 'rooms')

const MAX_WIDTH = 1920
const MAX_HEIGHT = 1080
const QUALITY = 75

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) files.push(...await getFiles(full))
    else if (/\.(jpg|jpeg|png)$/i.test(e.name)) files.push(full)
  }
  return files
}

async function compress(filePath) {
  const before = (await stat(filePath)).size
  // Read → process → write back directly (no rename needed)
  const input = await readFile(filePath)
  const output = await sharp(input)
    .resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer()
  await writeFile(filePath, output)
  const after = output.length
  const pct = ((1 - after / before) * 100).toFixed(1)
  console.log(`  ✓  ${path.relative(root, filePath).padEnd(55)} ${(before/1024/1024).toFixed(2)}MB → ${(after/1024/1024).toFixed(2)}MB  (-${pct}%)`)
}

async function main() {
  console.log('\n── Compressing src/assets/rooms ──\n')
  const files = await getFiles(roomsDir)
  let total = 0
  for (const f of files) {
    try { await compress(f); total++ }
    catch (e) { console.warn(`  ✗  SKIP ${path.relative(root, f)} — ${e.message}`) }
  }
  console.log(`\nDone. ${total} files compressed.\n`)
}

main().catch(e => { console.error(e); process.exit(1) })
