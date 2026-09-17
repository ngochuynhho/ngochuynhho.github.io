#!/usr/bin/env python3
"""Build dependency-free PNG versions of the Little Days SVG mark."""

import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COLORS = {"sage": (113, 140, 124), "cream": (255, 250, 245), "peach": (244, 217, 200)}


def inside_polygon(x, y, points):
    inside = False
    previous = points[-1]
    for current in points:
        if (current[1] > y) != (previous[1] > y):
            edge_x = (previous[0] - current[0]) * (y - current[1]) / (previous[1] - current[1]) + current[0]
            if x < edge_x:
                inside = not inside
        previous = current
    return inside


def pixel(x, y, size):
    scale = size / 512
    star = [(256, 84), (286, 190), (392, 220), (286, 250), (256, 356), (226, 250), (120, 220), (226, 190)]
    samples = [(0.25, 0.25), (0.75, 0.25), (0.25, 0.75), (0.75, 0.75)]
    colors = []
    for dx, dy in samples:
        px, py = (x + dx) / scale, (y + dy) / scale
        color = COLORS["sage"]
        if (px - 256) ** 2 + (py - 256) ** 2 <= 154**2:
            color = tuple(round(a * 0.86 + b * 0.14) for a, b in zip(color, COLORS["cream"]))
        if inside_polygon(px, py, star):
            color = COLORS["cream"]
        if (px - 374) ** 2 + (py - 354) ** 2 <= 35**2:
            color = COLORS["peach"]
        colors.append(color)
    return tuple(sum(channel) // len(colors) for channel in zip(*colors))


def write_png(path, size):
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            row.extend(pixel(x, y, size))
        rows.append(bytes(row))
    raw = b"".join(rows)

    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    path.write_bytes(png)


if __name__ == "__main__":
    for icon_size in (180, 192, 512):
        write_png(ROOT / "icons" / f"little-days-{icon_size}.png", icon_size)
