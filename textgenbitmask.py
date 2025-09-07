# 5-Bit Encoding -> GLSL int array
# ================================
from collections import Counter
import string


def string_statistik(text):
    stats = {
        'length': len(text),
        'letters': sum(c.isalpha() for c in text),
        'digits': sum(c.isdigit() for c in text),
        'whitespace': sum(c.isspace() for c in text),
        'uppercase': sum(c.isupper() for c in text),
        'lowercase': sum(c.islower() for c in text),
        'punctuation': sum(c in string.punctuation for c in text),
        'char_frequency': Counter(text),
        'char_count': len(Counter(text))
    }
    return stats
symbols = {
    "A": 0, "B": 1, "C": 2, "D": 3, "E": 4,
    "F": 5, "G": 6, "H": 7, "I": 8, "J": 9,
    "K": 10, "L": 11, "M": 12, "N": 13, "O": 14,
    "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19,
    "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24,
    "Z": 25, " ": 26, "1": 27, "2": 28, "3": 29,
    "4": 30,  
}

rev_symbols = {v: k for k, v in symbols.items()}


def encode_bits(text: str) -> int:
    """Encode text in einen großen Integer (5 Bit pro Zeichen)."""
    value = 0
    for ch in text:
        code = symbols[ch]
        value = (value << 5) | code
    return value


def int_to_glsl_array(value: int, num_bits: int) -> list[int]:
    """Teilt den Integer in 32-Bit Blöcke für GLSL int[]."""
    ints = []
    while value > 0:
        ints.append(value & 0xFFFFFFFF)  # letzter 32-Bit Block
        value >>= 32
    return ints[::-1]  # Reihenfolge umdrehen (MSB zuerst)


if __name__ == "__main__":
    text = "WIR GRUESSEN DIE EVOKE"

    stat = string_statistik(text)
    for k, v in stat.items():
        print(f"{k}: {v}")


    buf = encode_bits(text)

    print("Original:", text)
    print("Encoded Integer:", buf)

    # Anzahl benötigter Bits = 5 * Länge
    num_bits = len(text) * 5
    glsl_array = int_to_glsl_array(buf, num_bits)

    # Ausgabe als GLSL int[]
    print("\nGLSL Buffer:")
    print("int buffer[%d] = int[](%s);" % (len(glsl_array), ", ".join(str(x) for x in glsl_array)))
