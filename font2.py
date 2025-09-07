import struct

# --- Konstanten ---
W, H = 32, 12  # Sheet-Breite und Höhe

# Kompakte Bitmap als String (Leerzeichen erlaubt)
# ABCDEFGHIJKLMNOPQRSTUVWXYZÖ205
# mandelbrötchen credits trifox refurio chlumpie greetings nuance rebels deadline 2025
BITMAP = (
#//  Aa0 1b  c2  3d  4e  5f  6g  7h  8i  9j  10 broken _
    "010 100 111 001 111 111 110 101 010 010 00 "
    "111 111 100 111 110 110 111 111 010 010 00 "
    "101 111 111 111 111 100 111 101 010 110 00 "
#    k   l    m  Nn  o   pP   q  Rr  s S   t
    "101 100 101 011 111 111 111 111 011 111 00 "
    "110 100 111 111 101 111 101 110 111 010 00 "
    "101 111 111 111 111 100 110 101 110 010 00 "
#     u    v   w   x  y   z   ä   ö
    "101 101 101 101 101 110 111 010 000 000 00 "
    "101 111 111 010 010 111 111 101 111 000 00 "
    "111 010 110 101 010 011 101 111 000 000 00 "
)
BITMAP3x4 = (
#//  Aa0 1b  c2  3d  4e  5f  6g  7h  8i  9j  10 broken _
    "010 111 111 110 111 111 111 101 010 010 00 "
    "111 110 100 101 110 100 100 101 010 010 00 "
    "101 111 100 101 100 110 101 111 010 010 00 "
    "101 111 111 110 111 100 111 101 010 110 00 "
#    k   l    m  Nn  o   pP   q  Rr  s S   t
    "101 100 101 011 111 111 111 111 111 111 00 "
    "110 100 111 111 101 111 101 101 111 010 00 "
    "110 100 111 111 101 100 101 111 001 010 00 "
    "101 111 101 101 111 100 110 101 111 010 00 "
#     u    v   w   x  y   z   äa   ö
    "101 101 101 101 101 111 101 101 000 000 00 "
    "101 111 111 010 111 010 000 000 111 000 00 "
    "101 111 111 101 010 100 111 111 000 000 00 "
    "111 010 101 101 010 111 111 111 000 000 00 "
)

BITMAP = BITMAP3x4.replace(" ", "")

# --- Validierung ---
if len(BITMAP) != W*H or any(c not in "01" for c in BITMAP):
    raise ValueError(f"Bitmap muss genau {W*H} Bits enthalten (0/1) {len(BITMAP)}")

# --- Zeilenweise in UINT packen ---
rows = []
for y in range(H):
    row_bits = 0
    comment_str = ""
    for gx_block in range(W // 4):
        for x in range(4):
            x_global = gx_block*4 + x
            bit = int(BITMAP[y*W + x_global])
            if bit:
                row_bits |= 1 << (W - 1 - x_global)
            comment_str += str(bit)
        if gx_block < (W//4 - 1):
            comment_str += " "
    rows.append((row_bits, comment_str))

# --- GLSL-kompatibel ausgeben ---
print("const uint bitmap[{}] = uint[](".format(H))
for val, comment_str in rows:
    print(f"    0x{val:08X}u, // {comment_str}")
print(");")