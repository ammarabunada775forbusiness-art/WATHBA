#!/usr/bin/env python3
# Offline tool (not part of the build): derive the glow-free hero characters from the approved
# originals. Requires Python 3 with NumPy, SciPy and Pillow:
#   python3 scripts/tools/remove-character-glow.py
# The ink drawing itself is never redrawn: every figure pixel keeps its exact original value.
#
# Removes the baked background glow from an approved character image without redrawing the figure.
# The glow is a smooth light field G behind the character; the figure is the textured ink drawing.
# Background = everything reachable from the image border, or from a smooth gap between limbs,
# without crossing a pixel that differs from the glow (the ink outline). Figure pixels stay exact.
# out = I - (1 - alpha) * G
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def disk(radius):
    y, x = np.ogrid[-radius:radius + 1, -radius:radius + 1]
    return x * x + y * y <= radius * radius


def smooth_fill(values, known, sigmas):
    """Spread `values` from `known` pixels smoothly over the rest (normalized convolution)."""
    field = np.zeros_like(values)
    done = np.zeros(values.shape, bool)
    base = known.astype(float)
    for sigma in sigmas:
        weight = ndi.gaussian_filter(base, sigma)
        estimate = ndi.gaussian_filter(values * base, sigma) / np.maximum(weight, 1e-6)
        fill = ~done & (weight > 0.15)
        field[fill] = estimate[fill]
        done |= fill
    return field


def linear_fill(values, known, sigma):
    """Local first-order fit (weighted least squares) of `values` from `known` pixels.
    Unlike a plain average, it follows the glow's slope up to the figure edge."""
    radius = int(3 * sigma)
    k = np.arange(-radius, radius + 1, dtype=float)
    g0 = np.exp(-k * k / (2 * sigma * sigma)); g1 = g0 * k; g2 = g0 * k * k
    def conv(img, ky, kx):
        return ndi.correlate1d(ndi.correlate1d(img, ky, axis=0, mode='constant'), kx, axis=1, mode='constant')
    m = known.astype(float); f = values * m
    M00, M10, M01 = conv(m, g0, g0), conv(m, g0, g1), conv(m, g1, g0)
    M20, M11, M02 = conv(m, g0, g2), conv(m, g1, g1), conv(m, g2, g0)
    D00, D10, D01 = conv(f, g0, g0), conv(f, g0, g1), conv(f, g1, g0)
    ridge = 0.05 * sigma * sigma * M00
    A = np.stack([np.stack([M00, M10, M01], -1), np.stack([M10, M20 + ridge, M11], -1),
                  np.stack([M01, M11, M02 + ridge], -1)], -2)
    b = np.stack([D00, D10, D01], -1)
    ok = M00 > 0.05 * M00.max()
    out = np.zeros_like(values)
    out[ok] = np.linalg.solve(A[ok], b[ok][..., None])[..., 0, 0]
    return out, ok


def deglow(src, dst):
    rgb = np.asarray(Image.open(src).convert('RGB')).astype(float)
    L = rgb.mean(2)
    detail = np.abs(L - ndi.gaussian_filter(L, 1.0))
    # Rough figure from texture: the scribble is high-frequency, the glow is perfectly smooth.
    rough = ndi.binary_closing(ndi.gaussian_filter(detail, 1.0) > 2.0, disk(2))
    labels, count = ndi.label(rough)
    sizes = ndi.sum(rough, labels, range(1, count + 1))
    rough = np.isin(labels, 1 + np.flatnonzero(sizes >= 2000))
    # Gaps between limbs: smooth, glow-bright pockets enclosed by the drawing.
    smooth = ndi.gaussian_filter(detail, 2.0) < 1.0
    enclosed = ndi.binary_fill_holes(rough) & ~rough & smooth
    pocket_labels, _ = ndi.label(enclosed)
    pockets = np.zeros(L.shape, bool)
    for index, region in enumerate(ndi.find_objects(pocket_labels), start=1):
        mask = pocket_labels[region] == index
        brightness = L[region][mask].mean()
        if mask.sum() >= 60 and 20 < brightness < 170:
            pockets[region] |= mask
    flat = ndi.gaussian_filter(detail, 0.7) < 1.0
    narrow_labels, _ = ndi.label(flat & ndi.binary_fill_holes(rough) & ~pockets)
    for index, region in enumerate(ndi.find_objects(narrow_labels), start=1):
        mask = narrow_labels[region] == index
        if mask.sum() >= 25 and 20 < L[region][mask].mean() < 170:
            pockets[region] |= mask
    zone = ndi.binary_dilation(rough, disk(12))
    very_smooth = ndi.gaussian_filter(detail, 1.5) < 0.8
    figure = rough & ~pockets
    for margin in (6, 3, 2, 2):
        samples = ~ndi.binary_dilation(figure, disk(margin)) | ndi.binary_erosion(pockets, disk(1))
        glow = smooth_fill(L, samples, (3, 8, 20, 60, 160))
        near_edge, ok = linear_fill(L, samples, 5)
        glow = np.clip(np.where(ok, near_edge, glow), 0, 255)
        deviation = np.abs(L - glow)
        # Background continues through pixels that match the glow, or that are perfectly smooth
        # (no scribble at all) and still close to it: soft edges such as the side of the neck.
        passable = ~((deviation > 10) & zone) | (very_smooth & (deviation < 60))
        regions, _ = ndi.label(passable)
        border = np.concatenate([regions[0], regions[-1], regions[:, 0], regions[:, -1], regions[pockets]])
        reached = np.unique(border[border > 0])
        background = np.isin(regions, reached) | pockets
        figure = ~background
    # Soft edge: background pixels right next to the outline keep part of themselves if they
    # differ from the glow (anti-aliasing of the ink stroke); the figure itself stays exact.
    edge = ndi.binary_dilation(figure, disk(2)) & ~figure
    alpha = figure.astype(float)
    alpha[edge] = np.clip((deviation[edge] - 4) / 12, 0, 1)
    out = np.clip(rgb - ((1 - alpha) * glow)[..., None], 0, 255)
    out[(out < 1.5) & ~figure[..., None]] = 0
    result = out.round().astype(np.uint8)
    Image.fromarray(result).save(dst, lossless=True, quality=100, method=6)
    original = rgb.round().astype(np.uint8)
    untouched = (result == original).all(2)
    far = ~ndi.binary_dilation(figure, disk(3))
    print(src.split('/')[-1], '| gap pockets:', int(pockets.sum()), 'px',
          '| figure pixels unchanged: %.4f%%' % (100 * untouched[figure].mean()),
          '| brightest pixel left away from figure:', int(result.max(2)[far].max()))


if __name__ == '__main__':
    import os
    folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'site', 'assets', 'images', 'characters')
    for name in ('dheeb-standing', 'sakhr-stretch'):
        target = os.path.join(folder, f'{name}-noglow-1024.webp')
        deglow(os.path.join(folder, f'{name}-1024.webp'), target)
        full = Image.open(target).convert('RGB')
        for width in (768, 512):
            full.resize((width, width * 3 // 2), Image.LANCZOS).save(
                os.path.join(folder, f'{name}-noglow-{width}.webp'), quality=93, method=6)
