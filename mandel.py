import numpy as np 
from PIL import Image, ImageDraw, ImageFont
import math
def _hsv_to_rgb(h, s, v):
    i = np.floor(h * 6).astype(int)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    i_mod = i % 6
    r = np.select([i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5],
                  [v, q, p, p, t, v])
    g = np.select([i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5],
                  [t, v, v, q, p, p])
    b = np.select([i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5],
                  [p, p, t, v, v, q])
    return np.stack([r, g, b], axis=-1)

def mandelbrot(cx, cy, zoom, angle, width=400, height=400, max_iter=100):
    """
    Rendert einen Mandelbrot-Ausschnitt.
    
    cx, cy: Zentrum (in der komplexen Ebene)
    zoom: Maßstab (größer = näher)
    angle: Rotation in Grad
    width, height: Bildgröße
    max_iter: maximale Iterationen
    """
    # Basisgröße (ohne Zoom) in der komplexen Ebene
    scale = 3.0 / zoom
    aspect = width / height

    # Koordinaten-Raster (vor Rotation)
    xs = np.linspace(-scale * aspect / 2, scale * aspect / 2, width, dtype=np.float64)
    ys = np.linspace(-scale / 2, scale / 2, height, dtype=np.float64)
    X, Y = np.meshgrid(xs, ys)

    # Rotation anwenden
    rad = math.radians(angle)
    Xr = X * math.cos(rad) - Y * math.sin(rad)
    Yr = X * math.sin(rad) + Y * math.cos(rad)

    # In komplexe Koordinaten verschieben
    C = (Xr + cx) + 1j * (Yr + cy)

    Z = np.zeros_like(C)
    counts = np.zeros(C.shape, dtype=np.float32)
    mask = np.ones(C.shape, dtype=bool)

    for i in range(max_iter):
        Z[mask] = Z[mask] * Z[mask] + C[mask]
        escaped = np.abs(Z) > 2.0
        counts[escaped & mask] = i
        mask &= ~escaped
        if not mask.any():
            break

    # Normierung & Färbung
    norm = counts / max_iter
    hue = (0.95 - 0.95 * norm) % 1.0
    sat = np.where(counts > 0, 0.9, 0.0)
    val = np.where(counts > 0, 1.0, 0.0)

    rgb = _hsv_to_rgb(hue, sat, val)
    rgb_uint8 = (np.clip(rgb, 0, 1) * 255).astype(np.uint8)
    return Image.fromarray(rgb_uint8, mode="RGB")

def mandelbrotAlt(cx, cy, zoom, angle, width=400, height=400, max_iter=100):
    # Bild erstellen
    img = Image.new('RGB', (width, height))
    pixels = img.load()

    # Wandeln zu numpy.float32 für Single Precision
    
    print("Rendering Doubles",cx,cy,zoom,angle)
    cx = np.float32(cx)
    cy = np.float32(cy)
    zoom = np.float32(zoom)
    angle = np.float32(angle)
    print("Rendering Floats",cx,cy,zoom,angle)

    # Rotation-Matrix für den Winkel 
    cos_a = np.cos(angle).astype(np.float32)
    sin_a = np.sin(angle).astype(np.float32)

    # Skalierung passend zum Zoom
    scale =  zoom

    for x in range(width):
        for y in range(height):
            # Normierte Koordinaten (-1 .. 1)
            nx = (x - width/2) / (width/2)
            ny = (y - height/2) / (height/2)

            # Rotation um Angle
            rx = nx * cos_a - ny * sin_a
            ry = nx * sin_a + ny * cos_a

            # Verschiebung und Zoom
            zx =  np.float32(cx + rx * scale)
            zy =  np.float32(cy + ry * scale)

            # Mandelbrot-Iteration
            zx0, zy0 =  np.float32(0), np.float32(0)
            i = 0
            while zx0*zx0 + zy0*zy0 < 4 and i < max_iter:
                xtemp = zx0*zx0 - zy0*zy0 + zx
                zy0 = np.float32(2*zx0*zy0 + zy)
                zx0 = np.float32(xtemp)
                i += 1

            # Farbe: je nach Iterationszahl, simple Palette
            color = 255 - int((i * 255 / max_iter))
            pixels[x,y] = (color, color, color)

    return img
def _hsv_to_rgb(h, s, v):
    i = np.floor(h * 6).astype(int)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    i_mod = i % 6
    r = np.select([i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5],
                  [v, q, p, p, t, v])
    g = np.select([i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5],
                  [t, v, v, q, p, p])
    b = np.select([i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5],
                  [p, p, t, v, v, q])
    return np.stack([r, g, b], axis=-1)

def julia(cx, cy, zoom, angle, width=400, height=400, max_iter=100):
    """
    Rendert einen Mandelbrot-Ausschnitt.
    
    cx, cy: Zentrum (in der komplexen Ebene)
    zoom: Maßstab (größer = näher)
    angle: Rotation in Grad
    width, height: Bildgröße
    max_iter: maximale Iterationen
    """
    # Basisgröße (ohne Zoom) in der komplexen Ebene
    scale = 3.0 / zoom
    aspect = width / height

    # Koordinaten-Raster (vor Rotation)
    xs = np.linspace(-scale * aspect / 2, scale * aspect / 2, width, dtype=np.float64)
    ys = np.linspace(-scale / 2, scale / 2, height, dtype=np.float64)
    X, Y = np.meshgrid(xs, ys)

    # Rotation anwenden
    rad = math.radians(angle)
    Xr = X * math.cos(rad) - Y * math.sin(rad)
    Yr = X * math.sin(rad) + Y * math.cos(rad)

    # In komplexe Koordinaten verschieben
    C = (Xr + cx) + 1j * (Yr + cy)

    Z = np.zeros_like(C)
    counts = np.zeros(C.shape, dtype=np.float32)
    mask = np.ones(C.shape, dtype=bool)

    for i in range(max_iter):
        Z[mask] = Z[mask] * Z[mask] + C[mask]
        escaped = np.abs(Z) > 2.0
        counts[escaped & mask] = i
        mask &= ~escaped
        if not mask.any():
            break

    # Normierung & Färbung
    norm = counts / max_iter
    hue = (0.95 - 0.95 * norm) % 1.0
    sat = np.where(counts > 0, 0.9, 0.0)
    val = np.where(counts > 0, 1.0, 0.0)

    rgb = _hsv_to_rgb(hue, sat, val)
    rgb_uint8 = (np.clip(rgb, 0, 1) * 255).astype(np.uint8)
    return Image.fromarray(rgb_uint8, mode="RGB")

# Beispiel-Parameter aus deiner Liste (real, imag, zoom, angle)
params = [
    
 









































(-1.7683588440488,0.05142235910284,0.00005355907904092338,0.27563548147126493),
(-1.766495147994,0.0417267061464,0.00044402239147676086,0.1517894639121909),
(-1.769261670277,0.0569195003956,0.0002995182771678725,0.23423347691063795),
(-1.90728009107,0,0.0011754560896387338,3.141592653589793),
(-1.8607825222,0,0.007767650197946792,3.141592653589793),
(-1.94079980653,0,0.00983928985307716,3.141592653589793),
(-1.754877666,0,0.18201981627989672,3.141592653589793),
(0.38798963546146,0.61197516811835,0.00004396647496816971,-2.380696251364367),
(0.3890111704987,0.6084278463908,0.0005274726330800535,2.686827005755999),
(0.381237793363,0.599378097942,0.004300393224212388,0.21065064233145478),
(0.36040230539,0.61490698108,0.011646798131609109,2.4731928462200328),
(0.377149286568,0.666878777916,0.0010316522371209885,-1.5133807978646205),
(0.376893240379,0.67856869319,0.0012574438753357167,0.6599920743443956),
(0.359892739013,0.684762020212,0.005553083570499503,3.1212786038479035),
(0.35925922476,0.64251373714,0.04714342394528389,2.0447869433636376),
(-0.15652016683,1.0322471089,0.08188697027694743,2.4777729354236357),
(-1.754877666,0,0.18201981627989672,3.141592653589793)
]

 

# Großes Überblicksbild (z.B. um alle Punkte zu sehen)
overview_center = (-0.75, 0.0)
overview_zoom = 1.5
overview_angle = 0

img = mandelbrot(overview_center[0], overview_center[1], overview_zoom, overview_angle,1024,1024)

draw = ImageDraw.Draw(img)
font = ImageFont.load_default() 

# Funktion: Koordinate in Pixel umrechnen
def coord_to_pixel(real, imag, cx, cy, zoom, angle, width, height):
    cos_a = math.cos(angle)
    sin_a = math.sin(angle)
    scale = zoom
    rx = (real - cx) / scale
    ry = (imag - cy) / scale
    # Rückwärtsrotation
    nx = rx * cos_a + ry * sin_a
    ny = -rx * sin_a + ry * cos_a
    px = int(width/2 + nx * (width/2))
    py = int(height/2 + ny * (height/2))
    return px, py

# Alle Punkte einzeichnen
for idx, (r, i, z, a) in enumerate(params):
    px, py = coord_to_pixel(r, i, overview_center[0], overview_center[1], overview_zoom, overview_angle, 1024, 1024)
    draw.ellipse((px-2, py-2, px+2, py+2), fill=(255,0,0))
    draw.text((px+4, py-4), str(idx), font=font, fill=(255,255,0))

img.save("out/mandelbrot_map.jpg")

 
# Rendere die Bilder und speichere sie ab
for idx, (r, i, z, a) in enumerate(params):
    print(idx,"Rendering scale",z)
  #  img = mandelbrot(r, i, 1/z, 0,400,400,100) 
  #  img.save(f"out/{idx}-mandel.jpg")

    img = mandelbrot(r, i, 1/z,a,400,400,100,) 
    img.save(f"out/{idx}_angled.jpg") 


