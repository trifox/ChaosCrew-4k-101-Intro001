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
(-1.754877666,0,0.18201981627989672,3.141592653589793),
(0.41454631129228,-0.144863154352124,0.000002223890630045355,1.3530033171596558),
(0.414682500672716,-0.145134528246019,0.000009584950919338333,-0.2747893305646976),
(0.41406636191309,-0.14557276430874,0.000095502405196868,1.6362169391640733),
(0.4151849701495,-0.1467207960502,0.00015837626742424426,0.5929211111473646),
(0.4156154401242,-0.1490359148832,0.00043468013697464507,-0.659547022579832),
(0.412962939722,-0.152846281898,0.0026314059074198834,-2.4669387254540656),
(0.40489966518,-0.14582036377,0.0137915293869407,-1.3103920714734332),
(0.43237619264,-0.22675990444,0.019870650227158178,-1.4949237379094331),
(0.4433256334,-0.37296241666,0.02979002154572719,-1.7319180262293394),
(0.35925922476,-0.64251373714,0.04714342394528389,-2.044786943363638),
(-0.15652016683,-1.0322471089,0.08188697027694743,-2.477772935423636),
(-1.754877666,0,0.18201981627989672,3.141592653589793),
(-1.2934066886,0.43994190472363,0.000011901360740179637,2.986430957136852),
(-1.2951891635854,0.440937435674443,0.000009074338984972875,1.7366942116368287),
(-1.292558061034,0.4381988160866,0.00011637520095705769,1.5299828437050538),
(-1.28408492553,0.427268896041,0.0015969109043169794,1.3000088526380376),
(-1.2563679301,0.38032096347,0.028498444156839945,0.9684115640636399),
(-1.94079980653,0,0.00983928985307716,3.141592653589793),
(-1.754877666,0,0.18201981627989672,3.141592653589793), 
(-1.2773135611555,-0.3517272542055,0.000010500464447502607,0.5584776879127991),
(-1.2761901195939,-0.35393408441721,0.000027428310639290748,0.6706557404871057),
(-1.2784746578109,-0.35111324367505,0.00004894935635449893,1.3970662537409173),
(-1.274116315322,-0.3549942535053,0.00018620400945501206,1.3413048986262641),
(-1.281184978294,-0.3509381764418,0.00019063083629504034,2.2637442471402687),
(-1.2926258241427,-0.35266703528364,0.00002666478984322011,3.043402523680894),
(-1.285677330214,-0.3527071237234,0.0004528441207283607,-3.062225112609597),
(-1.252735884,-0.34247064789,0.012762410119084943,-1.857981297199099),
(-1.28408492553,-0.427268896041,0.0015969109043169794,-1.3000088526380378),
(-1.2563679301,-0.38032096347,0.028498444156839945,-0.9684115640636403),
(-1.94079980653,0,0.00983928985307716,3.141592653589793),
(-1.754877666,0,0.18201981627989672,3.141592653589793),
(-0.5940514958762,-0.6292629667873,0.0002922483646680723,3.099261653530033),
(-0.603421923426,-0.616048562056,0.0012598462863674836,2.403074537277332),
(-0.6139771782069,-0.6188021849914,0.0002137761047844001,3.092495092954199),
(-0.62088494971395,-0.61316570022097,0.00007441849875480086,-1.77685059163448),
(-0.62236850514274,-0.60983298966161,0.00007993119868547747,1.2458534970737516),
(-0.6165326858499,-0.6124313544614,0.0009183157781669933,1.4972586664462597),
(-0.59246590275,-0.62134868926,0.02025460548275603,1.520412843678222),
(-0.623532485956,-0.681064414225,0.0016925691892992266,-3.101970681355807),
(-0.59689164465,-0.66298074458,0.021384109663499292,-2.697250740867463),
(-0.198042099364,-1.10026953729,0.0068445800687591705,2.9934934161151103),
(-0.15652016683,-1.0322471089,0.08188697027694743,-2.477772935423636),
(-1.754877666,0,0.18201981627989672,3.141592653589793),
(-1.754877666,0,0.18201981627989672,3.141592653589793),
(-1.754877666,0,0.18201981627989672,3.141592653589793),
(-1.754877666,0,0.18201981627989672,3.141592653589793)
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


