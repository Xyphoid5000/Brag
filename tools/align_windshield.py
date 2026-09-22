#!/usr/bin/env python3
"""Bake a windshield asset pixel-aligned to the frame's windshield opening.

The page-transition layers (frame, glass, interior) are all rendered with
identical geometry (object-fit: cover on identical boxes), so a windshield
asset only lines up with the car's frame if its glass sits exactly over the
frame's transparent windshield cutout at the asset's native resolution.

This script:
  1. Reads the windshield opening from the alpha channel of
     src/assets/transitionCar_transparent.png
  2. Reads the glass quad from src/assets/transitionCar_windshieldAlt.png
  3. Perspective-warps the glass onto the opening
  4. Masks the result to the frame's exact transparent region (pixel-perfect
     edges, no gaps or overlap onto the pillars/roof)
  5. Writes src/assets/transitionCar_windshieldAligned.png (1536x1024 RGBA)

Re-run this if the source assets are ever regenerated.
"""

from PIL import Image, ImageDraw
import numpy as np

SIZE = (1536, 1024)
FRAME = "src/assets/transitionCar_transparent.png"
GLASS_SRC = "src/assets/transitionCar_windshieldAlt.png"
OUT = "src/assets/transitionCar_windshieldAligned.png"


def convex_hull(points):
    """Monotone chain convex hull. points: (N,2) array. Returns hull points."""
    pts = sorted(set(map(tuple, points.tolist())))
    if len(pts) <= 1:
        return np.array(pts)

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return np.array(lower[:-1] + upper[:-1])


def quad_corners(hull):
    """Order hull corners as TL, TR, BR, BL for a near-axis-aligned quad."""
    h = hull.astype(float)
    s = h[:, 0] + h[:, 1]
    d = h[:, 0] - h[:, 1]
    return np.array([
        h[np.argmin(s)],  # top-left
        h[np.argmax(d)],  # top-right
        h[np.argmax(s)],  # bottom-right
        h[np.argmin(d)],  # bottom-left
    ])


def homography(src, dst):
    """3x3 homography mapping src quad -> dst quad (DLT)."""
    A = []
    for (x, y), (xp, yp) in zip(src, dst):
        A.append([-x, -y, -1, 0, 0, 0, x * xp, y * xp, xp])
        A.append([0, 0, 0, -x, -y, -1, x * yp, y * yp, yp])
    _, _, Vt = np.linalg.svd(np.array(A, dtype=float))
    return Vt[-1].reshape(3, 3)


def main():
    frame = Image.open(FRAME).convert("RGBA")
    glass_img = Image.open(GLASS_SRC).convert("RGBA")
    assert frame.size == SIZE and glass_img.size == SIZE, "unexpected asset size"

    frame_alpha = np.asarray(frame)[:, :, 3]
    glass_alpha = np.asarray(glass_img)[:, :, 3]

    # Opening = transparent region of the frame (convex hull bridges the
    # opaque rear-view mirror sitting inside it).
    oy, ox = np.where(frame_alpha < 128)
    opening_quad = quad_corners(convex_hull(np.stack([ox, oy], axis=1)))

    # Glass = opaque region of the windshield asset.
    gy, gx = np.where(glass_alpha > 128)
    glass_quad = quad_corners(convex_hull(np.stack([gx, gy], axis=1)))

    print("opening quad:", opening_quad.astype(int).tolist())
    print("glass quad:  ", glass_quad.astype(int).tolist())

    # Warp glass -> opening. PIL maps output -> input, so invert.
    H = homography(glass_quad, opening_quad)
    Hi = np.linalg.inv(H)
    Hi = Hi / Hi[2, 2]
    coeffs = [Hi[0, 0], Hi[0, 1], Hi[0, 2],
              Hi[1, 0], Hi[1, 1], Hi[1, 2],
              Hi[2, 0], Hi[2, 1]]
    warped = glass_img.transform(SIZE, Image.PERSPECTIVE, coeffs, Image.BICUBIC)

    # Pixel-perfect edges: only show warped glass where the frame is transparent.
    mask = Image.fromarray((frame_alpha < 128).astype(np.uint8) * 255, mode="L")
    wa = np.asarray(warped)[:, :, 3].astype(np.int32)
    ma = np.asarray(mask).astype(np.int32)
    final_alpha = Image.fromarray(np.minimum(wa, ma).astype(np.uint8), mode="L")
    warped.putalpha(final_alpha)

    warped.save(OUT)
    print("wrote", OUT)


if __name__ == "__main__":
    main()
