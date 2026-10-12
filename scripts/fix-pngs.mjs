/**
 * fix-pngs.mjs
 * Re-processes all .png files in src/assets using proper PNG output.
 * The previous compression script incorrectly saved JPEG data into .png files.
 */
import sharp from 'sharp'
import { readdir, stat, writeFile, readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const assetsDir = path.join(root, 'src', 'assets')

const MAX_WIDTH  = 1920
const MAX_HEIGHT = 1080

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) files.push(...await getFiles(full))
    else if (/\.png$/i.test(e.name)) files.push(full)
  }
  return files
}

async function fixPng(filePath) {
  const before = (await stat(filePath)).size
  const input = await readFile(filePath)
  const output = await sharp(input)
    .resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 8, palette: false })
    .toBuffer()
  await writeFile(filePath, output)
  const after = output.length
  const pct = ((1 - after / before) * 100).toFixed(1)
  const sign = after > before ? '+' : '-'
  console.log(`  ✓  ${path.relative(root, filePath).padEnd(60)} ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (${sign}${Math.abs(pct)}%)`)
}

async function main() {
  console.log('\n── Fixing PNG files (proper PNG output) ──\n')
  const files = await getFiles(assetsDir)
  let count = 0
  for (const f of files) {
    try { await fixPng(f); count++ }
    catch (e) { console.warn(`  ✗  SKIP ${path.relative(root, f)} — ${e.message}`) }
  }
  console.log(`\nDone. ${count} PNG files reprocessed.\n`)
}

main().catch(e => { console.error(e); process.exit(1) })
