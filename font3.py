# --- Beispiel: 32 Zeichen jeweils 3x3 als Strings pro Zeile ---
# Jeder Eintrag: 3 Strings = 3 Zeilen pro Zeichen
# Für Übersichtlichkeit hier nur 4 Zeichen als Demo
chars = [
    [ # A
        "010", 
        "111", 
        "101"],  
    [ # b
        "100",
        "111",
        "111"
        ],  # Zeichen 1
    [ #c 
        "111",
        "100",
        "111"
        ],
          
    [ #d 
        "001",
     "111", 
     "111"], 
    [ #e 
     "111",
     "110", 
     "111"], 
       [ #f 
     "111",
     "110", 
     "100"], 
       [ #g 
     "110",
     "101", 
     "111"], 
       [ #h 
     "101",
     "111", 
     "101"], 
       [ #i 
     "010",
     "010", 
     "010"], 
       [ #j 
     "010",
     "010", 
     "100"], 
       [ #k 
     "101",
     "110", 
     "101"], 
       [ #l 
     "100",
     "100", 
     "111"], 
       [ #m 
     "111",
     "111", 
     "101"], 
       [ #n 
     "011",
     "111", 
     "101"], 
       [ #o 
     "111",
     "101", 
     "111"], 
       [ #p 
     "111",
     "111", 
     "100"], 
       [ #q 
     "111",
     "101", 
     "110"], 
       [ #r 
     "111",
     "110", 
     "101"], 
       [ #s 
     "011",
     "111", 
     "110"], 
       [ #t 
     "111",
     "010", 
     "010"], 
       [ #u 
     "101",
     "101", 
     "111"], 
       [ #v 
     "101",
     "101", 
     "010"], 
       [ #w 
     "101",
     "111", 
     "111"], 
       [ #x 
     "101",
     "010", 
     "101"], 
       [ #y 
     "101",
     "010", 
     "010"], 
       [ #z 
     "011",
     "111", 
     "110"], 
     
       [ #oe 
     "101",
     "111", 
     "111"],
       [ #slash 
     "001",
     "010", 
     "100"],
       [ #plus + 
     "010",
     "111", 
     "010"],
       [ #ding 
     "010",
     "111", 
     "111"], 
       [ #- 
     "000",
     "111",
     "000"],
       [ # leerzeichen 
     "000",
     "000", 
     "000"], 
      
       # Zeichen 3
    # ... bis 32 Zeichen
]

num_chars = len(chars)
char_w, char_h = 3, 3

# --- Bits auf 9 Zeilen pro Zeichen verteilen ---
rows = [0] * (char_w * char_h)  # 9 Zeilen für 3x3

for c_idx, ch in enumerate(chars):
    # Flatten 3x3 zu 9 Bits
    bits = "".join(ch)
    for bit_idx, b in enumerate(bits):
        # Jede Zeile bekommt den entsprechenden Bit von allen Zeichen
        rows[bit_idx] <<= 1
        rows[bit_idx] |= int(b)
def convert_to_binary(number):
    binary_str = bin(number)[2:]
    binary_32_bit = binary_str.zfill(32)
    return binary_32_bit
# --- GLSL-kompatibel ausgeben ---
print(f"const uint bitmap[{len(rows)}] = uint[](")
for val in rows:
    print(f"    0x{val:08X}u, //  {convert_to_binary(val)}  ")
print(");")