#version 130

uniform int m; // Time in sample player
out vec4 o;

const float PI = 3.1416;

const int MAX_ITER = 256;
const int NUM_LOCATIONS = 2;
const float bpm = 140.0;

float t = float(m) / 44100.0;
float secsPerBeat = 60.0 / bpm;

// vec3 real,imag,scale for locations 
const vec3 locations[11] = vec3[11](
  ///////////////////// 1
vec3(0.247111618194178,-0.623180551151656,0.000004765875645556761),
///////////////////// 2
vec3(0.2468358241206,-0.62233812068098,0.000019064651170418126),
///////////////////// 3
vec3(0.2486724622029,-0.622475099766,0.000111649626153617),
///////////////////// 4
vec3(0.2530077896631,-0.6209132651989,0.0007365673507609041),
///////////////////// 5
vec3(0.262830545002,-0.612259573735,0.007310447938098119),
///////////////////// 6
vec3(0.3473586076513,-0.7015597670608,0.00012845819773175184),
///////////////////// 7
vec3(0.3524825397224,-0.6983372395833,0.000805890368318295),
///////////////////// 8
vec3(0.359892739013,-0.684762020212,0.005553083570499503),
///////////////////// 9
vec3(0.35925922476,-0.64251373714,0.04714342394528389),
///////////////////// 10
vec3(-0.15652016683,-1.0322471089,0.08188697027694743),
///////////////////// 11
vec3(-1.754877666,0,0.18201981627989672)

);

float getDiddle(vec2 one,vec2 two,float t){



return 0;

}


float mandelbrot(in vec2 c,float t)
{ 
    float l = 0.0;
    vec2 z = vec2(0.0);

    int currentTimeInterval = int(floor(t / secsPerBeat )) % 11;
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
    o = vec4(0.,0.,0.1*sin(t*1000.0), 1.0);
}else{


    vec2 res = vec2(1280, 720);
    vec2 q = gl_FragCoord.xy / res.xy; // Normalize
    vec2 v = -1.0 + 2.0 * q; // to -1 +1 real,imag

    float l = mandelbrot(v,t-12.0*secsPerBeat);
    o = vec4(l, l, l, 1.0);
}
}
