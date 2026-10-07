"""Generate PWA icons (stdlib only): teal square with three rising bars."""
import struct, zlib
from pathlib import Path

BG = (15, 118, 110)
FG = (255, 255, 255)
OUT = Path(__file__).resolve().parent.parent / 'public'


def bars(size):
    # Bars sit inside the central 60% so the maskable safe zone is respected
    s = size / 100
    base = 72 * s
    return [(26 * s, 52 * s, 38 * s), (44 * s, 40 * s, 56 * s), (62 * s, 28 * s, 74 * s)], base


def png(size, path):
    rects, base = bars(size)
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            c = BG
            for x0, top, x1 in rects:
                if x0 <= x < x1 and top <= y < base:
                    c = FG
            if 22 * size / 100 <= x < 78 * size / 100 and base + size * 0.02 <= y < base + size * 0.045:
                c = FG
            row += bytes(c)
        rows.append(bytes(row))
    raw = zlib.compress(b''.join(rows), 9)

    def chunk(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)

    data = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)) + \
        chunk(b'IDAT', raw) + chunk(b'IEND', b'')
    path.write_bytes(data)


png(192, OUT / 'pwa-192.png')
png(512, OUT / 'pwa-512.png')
png(180, OUT / 'apple-touch-icon.png')
(OUT / 'icon.svg').write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
    '<rect width="100" height="100" rx="18" fill="#0f766e"/>'
    '<rect x="26" y="52" width="12" height="20" fill="#fff"/>'
    '<rect x="44" y="40" width="12" height="32" fill="#fff"/>'
    '<rect x="62" y="28" width="12" height="44" fill="#fff"/>'
    '<rect x="22" y="74" width="56" height="2.5" fill="#fff"/></svg>\n')
print('icons written')
