const fs = require('fs')
const zlib = require('zlib')
const path = require('path')

function crc32(buf) {
  let c
  const table = crc32.table || (crc32.table = (() => {
    const t = []
    for (let n = 0; n < 256; n++) {
      c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      t[n] = c
    }
    return t
  })())
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function makePng(size, draw) {
  const width = size, height = size
  const raw = Buffer.alloc((width * 4 + 1) * height)
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1)
    raw[rowStart] = 0
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = draw(x, y, width, height)
      const off = rowStart + 1 + x * 4
      raw[off] = r; raw[off + 1] = g; raw[off + 2] = b; raw[off + 3] = a
    }
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  const idat = zlib.deflateSync(raw, { level: 9 })
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

// Deep slate square background with a simple tennis-ball style circle + seam
function draw(x, y, w, h) {
  const cx = w / 2, cy = h / 2
  const dx = x - cx, dy = y - cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const bg = [30, 41, 59, 255] // slate-800
  const radius = w * 0.36
  if (dist > radius) return bg
  const ball = [163, 230, 53, 255] // lime-400 (tennis ball-ish)
  // seam: two arcs — approximate with distance from two offset circle centers
  const seamWidth = w * 0.035
  const angle = Math.atan2(dy, dx)
  const seamCurve = Math.sin(angle * 2) * radius * 0.5
  const seamDistFromCenter = Math.abs(dist - radius * 0.55 - seamCurve * 0.15)
  if (Math.abs(dx * 0.7 + dy * 0.7) < seamWidth && dist < radius) {
    // fallback simple vertical seam not used
  }
  const nx = dx / (dist || 1)
  const t = Math.abs(nx)
  if (Math.abs(dist - radius * 0.62) < seamWidth * (1.2 - t * 0.6)) {
    return [255, 255, 255, 255]
  }
  return ball
}

const outDir = path.join(__dirname, '..', 'public')
for (const size of [192, 512]) {
  const buf = makePng(size, draw)
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), buf)
}
// apple touch icon (no transparency needed, same art at 180)
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), makePng(180, draw))
console.log('icons written')
