# Fast Mandelbrot renderer as a reusable function
# This will create and save an example image at /mnt/data/mandelbrot.png
# You can call mandelbrot_image(...) to get a PIL.Image object in your own code.
from PIL import Image
import numpy as np
import math
import os

def _hsv_to_rgb(h, s, v):
    """Vectorized HSV (h in [0,1]) to RGB (0-1)"""
    i = np.floor(h * 6).astype(int)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    i_mod = i % 6
    r = np.select([i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5],
                  [v, q, p, p, t, v], default=0)
    g = np.select([i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5],
                  [t, v, v, q, p, p], default=0)
    b = np.select([i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5],
                  [p, p, t, v, v, q], default=0)
    return np.stack([r, g, b], axis=-1)

def mandelbrot_image(width=800, height=600,
                     x_min=-2.0, x_max=1.0, y_min=-1.2, y_max=1.2,
                     max_iter=300, cmap_s=0.9, cmap_v=1.0,
                     smoothing=True):
    """
    Render a Mandelbrot image and return a PIL.Image (RGB).
    
    Parameters:
      width, height: image size in pixels
      x_min,x_max,y_min,y_max: complex plane rectangle
      max_iter: maximum iterations
      cmap_s, cmap_v: saturation/value for HSV coloring (0..1)
      smoothing: apply continuous (smooth) coloring
    """
    # Create complex grid
    xs = np.linspace(x_min, x_max, width, dtype=np.float64)
    ys = np.linspace(y_min, y_max, height, dtype=np.float64)
    X, Y = np.meshgrid(xs, ys)
    C = X + 1j * Y

    Z = np.zeros_like(C)
    # iteration counts: -1 means not escaped yet
    it_counts = np.zeros(C.shape, dtype=np.float32)
    mask = np.ones(C.shape, dtype=bool)
    absZ = np.zeros(C.shape, dtype=np.float64)

    for i in range(max_iter):
        # iterate only where not yet escaped
        Z[mask] = Z[mask] * Z[mask] + C[mask]
        escaped = np.abs(Z) > 2.0
        newly_escaped = escaped & mask
        if newly_escaped.any():
            it_counts[newly_escaped] = i + 1  # store iteration (1..)
            absZ[newly_escaped] = np.abs(Z[newly_escaped])
        mask &= ~escaped
        if not mask.any():
            break

    # Points that never escaped get iteration 0; set absZ to |Z| for smoothing
    if smoothing:
        # for smooth coloring, compute a continuous index
        # for points that escaped: nu = n + 1 - log(log|Z|)/log 2
        # avoid log of zero
        escaped_mask = it_counts > 0
        nu = np.zeros_like(it_counts)
        if escaped_mask.any():
            # use the recorded absZ for those that escaped; for others, use final |Z|
            absZ_all = np.abs(Z)
            nu[escaped_mask] = it_counts[escaped_mask] - np.log(np.log(absZ_all[escaped_mask])) / np.log(2)
            # normalize
            norm = nu / max_iter
        else:
            norm = np.zeros_like(it_counts)
    else:
        norm = it_counts / max_iter

    # Map normalized value to a color via HSV: hue varies with norm
    hue = (0.95 - 0.95 * norm) % 1.0  # tweak for nicer colors
    sat = np.where(it_counts>0, cmap_s, 0.0)  # interior points black if not escaped
    val = np.where(it_counts>0, cmap_v, 0.0)

    rgb = _hsv_to_rgb(hue, sat, val)
    rgb_uint8 = (np.clip(rgb, 0, 1) * 255).astype(np.uint8)

    img = Image.fromarray(rgb_uint8, mode="RGB")

    return img

# create an example image
img = mandelbrot_image(1200, 800, max_iter=128)
out_path = "./out/mandelbrot.png"
img.save(out_path)
print("Saved example to", out_path)
# display basic info
img.size, img.mode, os.path.exists(out_path)
