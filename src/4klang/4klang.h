// some useful song defines for 4klang
#define SAMPLE_RATE 44100
#define BPM 127.000000
#define MAX_INSTRUMENTS 13
#define MAX_PATTERNS 51
#define PATTERN_SIZE_SHIFT 4
#define PATTERN_SIZE (1 << PATTERN_SIZE_SHIFT)
#define SAMPLES_PER_TICK 5208
#define POLYPHONY 1
#define FLOAT_32BIT
#define SAMPLE_TYPE float


// 1. Berechne die Anzahl der Pausen-Samples (12 Beats) 
#define BEATS_PAUSE 12
#define TICKS_PER_BEAT  4
#define PAUSE_SAMPLES  (BEATS_PAUSE * TICKS_PER_BEAT * SAMPLES_PER_TICK)
#define MAX_TICKS (MAX_PATTERNS*PATTERN_SIZE)
#define MAX_SAMPLES (SAMPLES_PER_TICK*MAX_TICKS+PAUSE_SAMPLES*2)

#define WINDOWS_OBJECT

// declaration of the external synth render function, you'll always need that
extern "C" void  __stdcall	_4klang_render(void*);
// declaration of the external envelope buffer. access only if you're song was exported with that option
extern "C" float _4klang_envelope_buffer;
// declaration of the external note buffer. access only if you're song was exported with that option
extern "C" int   _4klang_note_buffer;
