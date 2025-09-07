from PIL import Image, ImageDraw, ImageFont
import numpy as np
import struct

# Systemfont laden
font = ImageFont.load_default()

font = ImageFont.truetype("arial.ttf", size=16)
# Parameter
glyphs = "AaBbCcDdEeFfGg"
cell_w, cell_h = 4, 4
sheet_w, sheet_h = 32, 8  # 8 Glyphen pro Reihe, 2 Reihen

# Sheet-Bitmap
bitmap = np.zeros((sheet_h, sheet_w), dtype=np.uint8)

for i, ch in enumerate(glyphs):
    # Canvas zum Rendern
    img = Image.new("L", (16, 16), 0)
    draw = ImageDraw.Draw(img)
    draw.text((0, 0), ch, font=font, fill=255)

    # Runterskalieren auf 4x4
    img_small = img.resize((cell_w, cell_h), Image.Resampling.NEAREST)
    arr = (np.array(img_small) > 128).astype(np.uint8)

    # Position im Sheet
    gx = (i % 8) * cell_w
    gy = (i // 8) * cell_h

    bitmap[gy:gy+cell_h, gx:gx+cell_w] = arr

# Floats und Kommentare erzeugen
floats = []
float_strs = []
comment_strs = []

for y in range(sheet_h):
    row_bits = 0
    line_str = ""
    for gx_block in range(8):  # 8 Glyphen pro Reihe
        for x in range(cell_w):
            x_global = gx_block*cell_w + x
            if bitmap[y, x_global]:
                row_bits |= 1 << (sheet_w - 1 - x_global)
            line_str += str(bitmap[y, x_global])
        if gx_block < 7:
            line_str += " "  # Leerzeichen zwischen Glyphen
    f = struct.unpack("!f", struct.pack("!I", row_bits))[0]
    float_strs.append(f)
    comment_strs.append(line_str)

# Maximalbreite der Float-Darstellung für Alignment
maxlen = max(len(f"{f:e}") for f in float_strs)

# GLSL-Ausgabe
print("const float bitmap[{}] = float[](".format(sheet_h))
for f, line in zip(float_strs, comment_strs):
    float_text = f"{f:e}".ljust(maxlen)
    print(f"    {float_text}, // {line}")
print(");")
