import numpy as np 
from PIL import Image, ImageDraw, ImageFont
import math

def mandelbrot(cx, cy, zoom, angle, width=400, height=400, max_iter=100):
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

def julia(cx, cy, zoom, angle, width=400, height=400, max_iter=100):
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
            zx =  np.float32(  rx* scale)
            zy =  np.float32(  ry* scale)

            # Mandelbrot-Iteration
            zx0, zy0 =  np.float32(zx), np.float32(zy)
            zx=cx
            zy=cy
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

# Beispiel-Parameter aus deiner Liste (real, imag, zoom, angle)
params = [
    
 



































 
(-1.870003880829,0,0.0002674561862707285,3.141592653589793),
(-0.525971082531,-0.696943648552,0.0012521592421613436,-1.4127195914530066),
(-0.5283268509101,-0.7040732663739,0.00010731840819160572,-2.0375321234958355),


(-0.7241362058945,0.3615746809763,0.0006762353967640741,-0.3535661995436758),

(-0.690942897652,0.465349538581,0.008320645697370592,2.718719757271499),
(-0.71129999537417,0.47361824034266,0.00006140226906652181,-3.0772975283438235),
(-0.7064983534592,0.4721945038287,0.0006342193550945032,2.9386115579413823)
]

 

# Großes Überblicksbild (z.B. um alle Punkte zu sehen)
overview_center = (-0.75, 0.0)
overview_zoom = 1.5
overview_angle = 0

img = mandelbrot(overview_center[0], overview_center[1], overview_zoom, overview_angle,124,124)

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
    px, py = coord_to_pixel(r, i, overview_center[0], overview_center[1], overview_zoom, overview_angle, 124, 124)
    draw.ellipse((px-2, py-2, px+2, py+2), fill=(255,0,0))
    draw.text((px+4, py-4), str(idx), font=font, fill=(255,255,0))

img.save("out/mandelbrot_map.jpg")

 
# Rendere die Bilder und speichere sie ab
for idx, (r, i, z, a) in enumerate(params):
    print(idx,"Rendering scale",z)
    img = mandelbrot(r, i, z, 0,400,400,100) 
    img.save(f"out/{idx}-mandel.jpg")

    img = mandelbrot(r, i, z,a,400,400,100,) 
    img.save(f"out/{idx}_angled.jpg")

    img = julia(r,i, 1, 0,400,400,100) 
    img.save(f"out/{idx}_julia.jpg")
    img = julia(r,i, .1, 0,400,400,100) 
    img.save(f"out/{idx}_julia2.jpg")
    img = julia(r,i, z*10, 0,400,400,100) 
    img.save(f"out/{idx}_julia_zoom.jpg")
    img = julia(r,i, z*10, a,400,400,100) 
    img.save(f"out/{idx}_julia_zoom_angled.jpg")


