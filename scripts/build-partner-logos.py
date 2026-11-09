"""Normalise the supplied partner logos into one cohesive set.

Usage:  python3 scripts/build-partner-logos.py <source-dir> public/logos/partners

Run this when a partner logo is added or replaced. Point <source-dir> at the
original artwork as supplied (the filenames in SPEC below), and commit the
regenerated PNGs. Requires Pillow.

The sources arrive with three different backgrounds (opaque black, opaque
white, already-transparent), which would look like a patchwork on the white
Partners wall. Each one is reduced to a transparent single-tone silhouette,
trimmed to its ink, and centred in a shared box so every logo lands at the
same optical weight in the marquee.
"""

import os
import sys
from PIL import Image, ImageChops

SRC = sys.argv[1]
OUT = sys.argv[2]

# Canvas every logo is centred in — a shared aspect ratio means one CSS height
# gives every logo the same footprint, with no per-logo tuning.
BOX_W, BOX_H = 600, 168
# Breathing room inside the box.
FIT_W, FIT_H = 0.94, 0.82
# The single tone every logo is rendered in.
INK = (17, 24, 39)
# Below this, treat it as background noise (JPEG ringing, anti-aliasing).
FLOOR = 14
# At or above this, the pixel counts as fully inked.
SOLID = 170

# (slug, source file, background kind) in the order the client asked for.
SPEC = [
    ("samsung", "12.jpg", "dark"),
    ("lava-music", "16.png", "light"),
    ("hollyland", "14.png", "light"),
    ("garnier", "10.png", "tone"),
    ("aeroband", "11.png", "light"),
    ("lakme", "9.webp", "dark"),
    ("enya-music", "8.png", "light"),
    ("tanglewood", "13.png", "dark"),
    ("merida", "2.jpg", "dark"),
    ("lollapalooza", "7.webp", "light"),
    ("kadence", "15.png", "light"),
    ("tonic", "3.png", "light"),
    ("openhagen", "1.webp", "dark"),
    ("ulanzi", "6.png", "light"),
    ("lensgo", "5.webp", "light"),
    ("skyvik", "4.png", "light"),
]


def channel_extreme(rgb, darkest):
    r, g, b = rgb.split()
    op = ImageChops.darker if darkest else ImageChops.lighter
    return op(op(r, g), b)


def build_mask(im, kind):
    """Opacity map: 255 where the logo's ink is, 0 where its background was."""
    rgba = im.convert("RGBA")
    dark_bg = kind == "dark"

    if kind == "tone":
        # Garnier's mark is a photographic leaf that *is* the G, with the
        # letterform painted over it in a darker green. Both are saturated, so
        # the min channel reads them as one solid disc. Luminance keeps them
        # apart: the leaf lands mid-tone, the letterform and wordmark solid.
        plate = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
        flat = Image.alpha_composite(plate, rgba).convert("L")
        lo, hi = 20, 215
        lut = [
            max(0, min(255, round(((255 - v) - lo) * 255 / (hi - lo))))
            for v in range(256)
        ]
        return flat.point(lut), flat.size

    if not dark_bg:
        # Flatten onto white first. Reading the source alpha directly would
        # fill in any counter the artwork leaves white rather than cut out —
        # it turned Lollapalooza's outline wordmark and Garnier's leaf-G into
        # solid blobs. Flattening puts every light-plate logo, transparent or
        # not, through the same min-channel path.
        plate = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
        rgba = Image.alpha_composite(plate, rgba)

    # On a dark plate the ink is the bright pixels, so read the max channel;
    # on a light plate it's the dark pixels, so read the min channel.
    base = channel_extreme(rgba.convert("RGB"), darkest=not dark_bg)

    # Sample the plate from the corners rather than assuming pure black/white —
    # the Merida JPEG sits on #111 and tonic on #f3f1f1.
    w, h = base.size
    corners = [base.getpixel(p) for p in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))]
    bg = sum(corners) // 4

    span = max(1, (255 - bg) if dark_bg else bg)
    lut = []
    for v in range(256):
        raw = (v - bg) if dark_bg else (bg - v)
        a = max(0, min(255, round(raw * 255 / span)))
        # Push the mid-tones solid so gradient marks (Lakme's gold, Merida's
        # script) read at one weight, while the taper below SOLID keeps edges
        # anti-aliased.
        a = 0 if a < FLOOR else min(255, round(a * 255 / SOLID))
        lut.append(a)
    return base.point(lut), base.size


def render(slug, filename, kind):
    im = Image.open(os.path.join(SRC, filename))
    mask, size = build_mask(im, kind)

    # Trim to the ink so a logo that shipped with huge padding (Ulanzi is a
    # 2000px square around a small wordmark) isn't dwarfed by a tight one.
    bbox = mask.point(lambda v: 255 if v > 24 else 0).getbbox()
    if bbox is None:
        raise SystemExit(f"{slug}: nothing left after background removal")
    mask = mask.crop(bbox)

    flat = Image.new("RGB", mask.size, INK)
    logo = Image.merge("RGBA", (*flat.split(), mask))

    scale = min(BOX_W * FIT_W / logo.width, BOX_H * FIT_H / logo.height)
    logo = logo.resize(
        (max(1, round(logo.width * scale)), max(1, round(logo.height * scale))),
        Image.LANCZOS,
    )

    canvas = Image.new("RGBA", (BOX_W, BOX_H), (0, 0, 0, 0))
    canvas.paste(logo, ((BOX_W - logo.width) // 2, (BOX_H - logo.height) // 2))

    path = os.path.join(OUT, f"{slug}.png")
    canvas.save(path, "PNG", optimize=True)
    return size, bbox, logo.size, os.path.getsize(path)


os.makedirs(OUT, exist_ok=True)
print(f"{'slug':14} {'source':10} {'kind':6} {'trimmed':>12} {'ratio':>6} {'drawn':>10} {'kb':>6}")
for slug, filename, kind in SPEC:
    size, bbox, drawn, nbytes = render(slug, filename, kind)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    print(
        f"{slug:14} {filename:10} {kind:6} {tw:5}x{th:<6} {tw / th:6.2f} "
        f"{drawn[0]:4}x{drawn[1]:<5} {nbytes / 1024:6.1f}"
    )
