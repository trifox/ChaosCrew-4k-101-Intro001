#version 130

uniform int m; // Time in sample player
out vec4 o;

const float PI = 3.1416;

const int MAX_ITER = 128;
const int NUM_LOCATIONS = 2;
const float bpm = 120.0;

float t = float(m) / 44100.0;
float secsPerBeat = 60.0 / bpm;

// vec3 real,imag,scale for locations 
const vec3 locations[4] = vec3[4](
  vec3(-1.02819385245,0.361376517119, 0.1),
  vec3(-1.40844648574,-0.136171997305, 0.01),
  vec3(-1.2563679301, -0.38032096347, 0.1),
  vec3( 0.44332563340, -0.37296241666, 0.1)
);

float mandelbrot(in vec2 c)
{ 
    float l = 0.0;
    vec2 z = vec2(0.0);

    int currentTimeInterval = int(floor(t / secsPerBeat/4.0)) % 4;
    vec3 loc = locations[currentTimeInterval];
    c = c * loc.z + loc.xy;

    for (int i = 0; i < MAX_ITER; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if (dot(z, z) > 4.0) break;
        l += 1.0;
    }

    return l / float(MAX_ITER);
}

float explerp(float v0, float v1, float t) {
    return exp(mix(log(v0), log(v1), t));
}

void main()
{
    float currentTimeInterval = t / secsPerBeat;
    float interval = fract(currentTimeInterval);

    vec2 res = vec2(1280, 720);
    vec2 q = gl_FragCoord.xy / res.xy; // Normalize
    vec2 v = -1.0 + 2.0 * q; // to -1 +1 real,imag

    float l = mandelbrot(v);
    o = vec4(l, l, l, 1.0);
}
