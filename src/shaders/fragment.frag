#version 130

uniform int m; // Time in sample player
out vec4 o;

const float PI = 3.1416;

const int MAX_ITER = 128;
const int NUM_LOCATIONS = 2;
const float bpm = 140.0;

float t = float(m) / 44100.0;
float secsPerBeat = 60.0 / bpm;

// vec3 real,imag,scale for locations 
const vec3 locations[18] = vec3[18](

// Takt 1und2 ein paradidle

// paradidle 1

  vec3(-1.02819385245,0.361376517119, 0.1), // A
  vec3(-1.40844648574,-0.136171997305, 0.01), // B
  vec3(-1.02819385245,0.361376517119, 0.1), // A

// paradidle 2
 vec3(-1.40844648574,-0.136171997305, 0.1), // B
  vec3(-1.02819385245,0.361376517119, 0.01), // A
 vec3(-1.40844648574,-0.136171997305, 0.1),  // B



// Takt 3und4 ein paradidle

// paradidle 1

  vec3(-1.02819385245,0.361376517119, 0.1), // A
  vec3(-1.40844648574,-0.136171997305, 0.01), // B
  vec3(-1.02819385245,0.361376517119, 0.1),  // A


// paradidle 2
 vec3(-1.40844648574,-0.136171997305, 0.1), // B
  vec3(-1.02819385245,0.361376517119, 0.01), // A
 vec3(-1.40844648574,-0.136171997305, 0.1),  // B

// Takt 5und6 ein paradidle

// paradidle 1

  vec3(-1.02819385245,0.361376517119, 1.), // A
  vec3(-1.40844648574,-0.136171997305, 0.1), // B
  vec3(-1.02819385245,0.361376517119, 1.0),  // A

// paradidle 2
 vec3(-1.40844648574,-0.136171997305, 2.0), // B
  vec3(-1.02819385245,0.361376517119, 0.1), // A
 vec3(-1.40844648574,-0.136171997305, 2.0)  // B


);

float getDiddle(vec2 one,vec2 two,float t){



return 0;

}


float mandelbrot(in vec2 c,float t)
{ 
    float l = 0.0;
    vec2 z = vec2(0.0);

    int currentTimeInterval = int(floor(t / secsPerBeat )) % 18;
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

if(currentTimeInterval<12.0){

// need to chek, green for firsr ywa, 3 i
    o = vec4(0.,1.,0., 1.0);
}else{


    vec2 res = vec2(1280, 720);
    vec2 q = gl_FragCoord.xy / res.xy; // Normalize
    vec2 v = -1.0 + 2.0 * q; // to -1 +1 real,imag

    float l = mandelbrot(v,t-12.0*secsPerBeat);
    o = vec4(l, l, l, 1.0);
}
}
