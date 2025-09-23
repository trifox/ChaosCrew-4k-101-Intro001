#version 330
const vec2 iResolution = vec2(1920, 1080);

uniform int m; // Time in sample player 
out vec4 o; 
////////////////////////////////////////////////////////////////
float man_Size = 2.5;
const float PI = acos(-1.);
const float PI2 = PI * 2;
const float HALF_PI = PI / 2;
const float BAILOUT = 256;
const int SIXTEEN = 16;

float MAX_ITER = 170;
const float bpm = 127.0; // forcompletion beats per minute 
// returns vignette intensity at uv for a given rectangular area
vec2 vigCenter = vec2(.5, .5);
vec2 vigSize = vec2(1, 1);
float vigIntensity = 31.;
float vigPower = .5;
float effectVisibility = 0;
float t;
bool isMandel = true;
/*
const float beatTrack_1[SIXTEEN]=float[SIXTEEN](
  // paradiddle pattern
    1,0,1,1,
    0,1,0,0, 
    1,0,1,1,
    0,1,0,0
    );
}
const float beatTrack_4Achtel[8]=float[8](
  // achtung wird als 8tel takt genutzt!
    0,0,0,1,   0,1,1,1
    ); 
 
// schnitter
const float beatTrack_schnitter_nimm_beat3[16]=float[16](
  // achtung wird als 8tel takt genutzt!
    0,0, 0,0,    0,0, 0,0,    0,0, 0,0,    0,0, 1,0
    ); 



const float beatTrack_4Achtel2[16]=float[16](
  // das sind die halben noten,
  // daher acht, man trift die mitte eines beats damit, zur not kann man auch wiederverwenden fuer viertel, aber dann halt aufpassen mit skalierung
    0,0,0,0,    1,0,1,0,    1,0, 0,0,    0,0, 0,0
    ); 

*/

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}
const int NLOCATIONS = 3;
// vec4 real,imag,scale for locations  
const vec4 locations[NLOCATIONS] = vec4[NLOCATIONS](vec4(-1.52181, 0, .0044053, 0), vec4(.262830, .6122595, 0.007310, 2.179), vec4(-.69094, .4653495, 0.008320, 2.718)
/// alte coords

/*
vec4(0.3604,.61491,0.0116,2.47),
vec4(-1.87,0.,.0002675,0),
vec4(-0.52597,.696944,0.001252,-1.41),
vec4(-0.528326,.704073,0.0001073,-2.04),
vec4(-0.724136,.361574,0.000676,-0.35),
vec4(-0.69094,.46535,0.00832,2.72),
vec4(-0.7113,.473618,6.14e-05,-3.08)
*/
);
vec4 location = locations[0];

/////////////////// 
/////////////////// Font stuff
/////////////////// 

const int A = 23;
const int B = 22;
const int C = 21;
const int D = 20;
const int E = 19;
const int F = 18;
const int G = 17;
const int H = 16;
const int I = 15;
const int L = 14;
const int M = 13;
const int N = 12;
const int O = 11;
const int P = 10;
const int R = 9;
const int S = 8;
const int T = 7;
const int U = 6;
const int X = 5;
const int Y = 4;
const int OE = 3; 
const int COLON = 2;
const int SLASH = 1; 
const int _ = 0;

const int TEXT_LEN = 114;
const int[TEXT_LEN] text = int[TEXT_LEN](
  _,
   
  
   _, M, A, N, D, E, L, B, R, OE, T, C, H, E, N, _,
   G, R, E, E, T, I, N, G, S, COLON,_, 
   N, U, A, N, C, E, _, R, E, B, E, L, S, _, F, R, A, C, T, A, L,SLASH,F, O, R, U, M, S,SLASH,C,H,A,T,S, _,
    D, E, A, D, L, I, N, E, P, A, R, T, Y, _,
      C, O, D, E,COLON,_ , 
     T, R, I, F, O, X, SLASH, R, E, F, U, R, I, O, 
     _, M, U, S, I, C, COLON,_, C, H, L, U, M, P, I, E, _);

const vec3[3] textanim = vec3[3](
  // wordindex, numwords to show, beatindex
vec3(0, 1, 16), vec3(0, 1, 10 * 4), vec3(0, 1, 25 * 4));
const int bitmap3x3vertical[9] = int[]( 
    // 24 3x3 characters packed in this one
    //              //  abcdefghijklmnopqrstuvwxyzö/:d-_ d=ding
    // 0x6F3BDFA0u, //  01101111001110111101111110100000  
    // 0xAECFF04Cu, //  10101110110011111111000001001100
    // 0x3D2FFFF0u, //  00111101001011111111111111110000
    // 0xFF3FEE66u, //  11111111001111111110111001100110
    // 0xDDED73F6u, //  11011101111011010111001111110110
    // 0xD30FAE66u, //  11010011000011111010111001100110
    // 0xFF7FEB74u, //  11111111011111111110101101110100
    // 0x7A92BEECu, //  01111010100100101011111011101100
    // 0xFB3E4B24u  //  11111011001111100100101100100100
    // 24 3x3 characters packed in this one
       //                      ABCDEFGHILMNOPRSTUXY  
    0x6F6EF8, //  00000000011011110110111011111000  
    0xAEBF82, //  00000000101011101011111110000010
    0x3D3FFC, //  00000000001111010011111111111100
    0xFF7F48, //  00000000111111110111111101001000
    0xDDB7BC, //  00000000110111011011011110111100
    0xD33D48, //  00000000110100110011110101001000
    0xFF7F6C, //  00000000111111110111111101101100
    0x7AC9DA, //  00000000011110101100100111011010
    0xFB7A68  //  00000000111110110111101001101000

);

uint characterVertical(vec2 uv, uint c) {
  uint b = uint(bitmap3x3vertical[int(uv.y * 3.) * 3 + int(uv.x * 3.)]);
  return (b >> c) & 1u;
}

vec2 word2(int idx) {
  int start = 0;
  int w = -1;
  for(int i = 0; i < TEXT_LEN; i++) {
    if(text[i] == _) {
      w++;
      if(w == idx) {
        int j = i + 1;
                // warning disabled overflow check, always place _ at end of text array
        while(text[j] != _)
          j++;
        return vec2((i + 1), (j - i - 1));
      }
    }
  }
  return vec2(0); // falls index zu groß
}
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float characterMasked(vec2 uv, uint chari) {
  float circ = sdCircle(uv * 2. - 1., 1.);
  return float(characterVertical(uv, chari)) * smoothstep(0.25, .0, circ);
}

vec2 cardioid(vec2 r) {
  return (r+r-cmul(r,r))/4.;
}


/////////////////





/////////////////////////////////////////////////////////////////////
// Utility Methods, 

  // Dies Soll die core mandelbrot methode werden,
  // input:
  // c  = constante to add
  // z0 = start value for z mandelbrot iteration 
  // remark:
  // use it for julia rendering by flipping the inputs yourself
  //
  // returns>
  // vec4(
  // zreal
  // zimag
  // iteration normalized
  // smoothed iters
  // )

// Exponentielle Interpolation zwischen a und b mit Parameter t in [0,1]
// t=0 -> a, t=1 -> b
// Exponentielle Interpolation für positive Werte a,b > 0
float expInterp(float a, float b, float t) {
    // t=0 => a, t=1 => b
    // Interpoliert so, dass die Werte sich *multiplikativ* ändern
    // (logarithmische lineare Interpolation)
  return exp(mix(log(a), log(b), t));
}

float easeInOutTap(float t) {
  return smoothstep(.0, .2, t) * (1.0 - smoothstep(.8, 1, t));
}
vec2 rotor(float a) {
  return vec2(cos(a), sin(a));
}

vec3 hsv(float h, float s, float v) {
  return v * mix(vec3(1), clamp(abs(6.*fract(h + vec3(3,2,1)/3.) - 3.) - 1., 0., 1.), s);
}


vec3 cmix(vec3 a, vec3 b, float t) {
  return sqrt(mix(a * a, b * b, t));
}

float f_k;
vec2 f_z;
bool f(vec2 c, vec2 z0) {
  f_z = z0;
  for(f_k = 0.; f_k < MAX_ITER; ++f_k) {
    f_z = cmul(f_z, f_z) + c;
    if(dot(f_z, f_z) > BAILOUT)
      return false;
  }
  return true;
}

vec3 mandelbrotCore(vec2 c, vec2 z0) {
  f(c, z0);
  return vec3(f_z.xy, f_k / MAX_ITER);
}
vec2 project(vec2 uv, vec2 center, float scale, float angle) {
  return cmul(center + uv * scale, rotor(radians(angle)));
}
float mandelbrotExt(vec2 c, vec2 start, vec2 center, float scale, float angle) {
  return mandelbrotCore(project(c, center, scale, angle), start).z;
}
float juliaExt(vec2 c, vec2 start, vec2 center, float scale, float angle) {
  return mandelbrotCore(start, project(c, center, scale, angle)).z;
}
vec3 mandelbrotRender(vec2 c) {
  return mandelbrotCore(cmul(c, rotor(location.w)) * location.z + location.xy, vec2(0.));
}
vec3 mandelbrotRenderJulia(vec2 c, vec4 loc) {
  return mandelbrotCore(loc.xy, cmul(c, rotor(loc.w)) * loc.z + loc.xy);
}

vec2 man_seedEyes = vec2(0);
vec2 man_seedBody = vec2(0);
vec2 man_seedMouth = vec2(0);
vec2 man_headPos = vec2(0);
float man_scale = 1;
float manFace = 1;
float manEyesOpen = 0; // eyes open 0 = outside closed 
float manEyesOpenSymmetry = .0; // controls how much of the opennes the second eye follows  
float manEyesSymetry = 1; // -1 eyes x pos mirrored, 1 same seed for both eyes
float mandelMan(vec2 uvIn) {

  float fragColor = 0;
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = cmul(uvIn, rotor(radians(90.))) * man_scale;
  vec2 center = vec2(.5, -0);
  float scale = 2.;
  vec2 eyePos = center + vec2(3.150, 2.40); 
  // Mandelbrot 
  fragColor = mandelbrotExt(uv, man_seedBody * .25, center + vec2(-1.3, 0), scale * .4, 180) * .75;

  uv += man_headPos;
  fragColor += mandelbrotExt(uv, vec2(0), center, scale * 1, 180) - juliaExt(uv, man_seedEyes - vec2(manEyesOpen * manEyesOpenSymmetry, 0), center + eyePos, scale * 8., -90) * manFace - juliaExt(vec2(uv.x, manEyesSymetry * uv.y), man_seedEyes - vec2(manEyesOpen, 0), center + vec2(eyePos.x, eyePos.y * -manEyesSymetry), scale * 8., -90) * manFace
            /// den mund, da wollen wir die schwarzen bereiche mit zaehnen also vertikalen streifen rendern
  - juliaExt(uv, man_seedMouth, center + vec2(-5., .0), scale * 8. * manFace, 90);
  return fragColor;
}
//////////////////////////
float smoothStepCounter(float t, float stepDuration, float rampFrac) {
    // t: Zeit (z. B. iTime)
    // stepDuration: Zeit pro Ganzzahl (z. B. 1.0 Sekunde pro Schritt)
    // rampFrac: Anteil der Zeit, der für den Übergang benutzt wird (z. B. 0.1 = 10%)

  float totalSteps = t / stepDuration;   // float step counter
  float base = floor(totalSteps);        // aktueller Ganzzahlwert
  float phase = fract(totalSteps);       // 0..1 innerhalb des Schritts
  float ramp;

  if(phase < rampFrac) {
        // Im Ramp-Bereich → sanft hochziehen
    ramp = smoothstep(0, rampFrac, phase);
    return base + ramp;
  } else {
        // Plateau → konstanter Wert
    return base + 1;
  }
}
// A simple anf really efficient way to create color variation.
//
// Short video about this method to make palettes:
//
//   https://www.youtube.com/shorts/TH3OTy5fTog
//
// and a longer article here:
//
//   https://iquilezles.org/articles/palettes for more information
// its a and b control aplitude and offset, c and d control frequency and shidft
vec3 pal(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return a + b * cos(PI2 * (c * t + d));
}

vec3 makePal2(float i) {
  return vec3(.2549, .8824, .4118) * i;
}
float pal_1_speed = 0;
vec3 makePal1(float i) {
  // return pal(i, vec3(0.3,0.2,0.5),vec3(0.6,0.2,0.8),vec3(2.0,1.0,0.0),vec3(0.5,2.20,0.25) );
  return pal(i, hsv(.7, .7, .8),  // Grundton: warm-golden
  vec3(.25, .35, .45),   // Amplitude: Gold -> Orange -> Rot
  vec3(1, 2, 3), // Hohe Frequenz: pulsierende Energie
  vec3(t * 2 * pal_1_speed, t / 4 * pal_1_speed, t * 8 * pal_1_speed)   // Phase für „rollende“ Farbwellen
  );
}

float juliastep = 0;

vec2 brotVisibilities = vec2(1, 0);
 // minibrote trifox
vec4 scene2Mandelbroetchen(vec2 fragCoord) {
  MAX_ITER = 250;
  int index = int(t) % SIXTEEN;
  float interval = fract(t);
//  float vis=beatTrack_1[index]; 
  vec2 v = fragCoord; // to -1 +1 real,imag
  // arg allgemeiner winkel, normalisiert dann auf 0..1 also der winkel 0..360

//    int indexAchtel=int(floor(mod(t,32.)));
//    vec4 keyframe=getKeyFrame(t);

  vec3 l = mandelbrotRender(v);
  vec3 ljulia = mandelbrotRenderJulia(v, vec4(location.xy, location.z * (juliastep > 0. ? smoothStepCounter(4. - mod(t * 1., 4.), 1., .2) : 1.), location.w + easeInOutTap(fract(t / 8.)) * (PI / 2.)));

  vec4 result = brotVisibilities.x * vec4(makePal1(l.z), 1.) + brotVisibilities.y * vec4(makePal1(ljulia.z), 1.);

  //    result.x+=beatTrack_1[index]*(1.0-interval);
  //    result.y+=beatTrack_2[index]*(1.0-interval);
  //    result.z+=beatTrack_4_8chtel[indexAchtel]*(1.0-interval);

/*
     if(l.z<1.0){
        // circular shading :) optimize please
        // also hier noch irgendwie nen slope mit reinmachen ey
        float tap=easeInOutTap(fract(t));
        result.x+=tap*beatTrack_4_8chtel[indexAchtel]*0.6*sin(arg*arg*PI2 +.23);
        result.y+=tap*beatTrack_4_8chtel[indexAchtel]*0.6*sin(arg*arg*PI2 +.23);
        result.z+=tap*beatTrack_4_8chtel[indexAchtel]*0.6*sin(arg*arg*PI2 +.23);
     }}*/

  return result;
}
float cubicIn(float t) {
  return t * t;
}
float cubicInOut(float t) {
  return t < .5 ? 4.0 * t * t * t : .5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

float backOut(float t) {
  float f = 1.0 - t;
  return 1.0 - (pow(f, 3.0) - f * sin(f * PI));
}

float backIn(float t) {
  return pow(t, 3.0) - t * sin(t * PI);
}
float flashBang(float time, float[16] arr) {
  return easeInOutTap(fract(time)) * arr[int(time) % 16];
}

float flashBang4(float time, float[4] arr) {
  return easeInOutTap(fract(time)) * arr[int(time) % 4];
}
float flashBang8(float time, float[8] arr) {
  return easeInOutTap(fract(time)) * arr[int(time) % 8];
}  

///////////////////
////////////// for the sake of code, we have to redo this globall method using
// an init function for setting the iteration? wtf!

vec2 lissajous(float lissa, float shift, float t) {
  return vec2(cos(t - shift * lissa), sin(t - shift));
}

float sqr(float x) {
  return x * x;
}

float cam_a = .5, cam_d = 1., nbobs = 100, lissa = 1., // 1.0 is a circle
amplitude = .0, // of lissjous animation
arclen = .1, // 1.0 is full circle
lspeed = 1. / 16., // of lissajous anmation

speed = .125, // at which julia parameters are animated
roughness = .5, // of julia pertubation
cangle = 10, // angle pertubation changes from head to tail

column_height = 1., column_shift = -.1;

      // julia view ;
      //angle = 0.;

vec2 center = vec2(0), r, c, p, cr, pertubation, uv;

vec3 col, ray, offset, cam_pos;

float seedStrengsth = 0; // lisajou julia strength
vec3 camera(float a, float d, vec3 v) {
  v.yz = cmul(v.yz, rotor(a));
  //v.xy *= (-1.-d)/(v.z-1.-d);
  v.xy *= (d - 1.) / (v.z + 1. + d);
  return v;
}
float osc(float lo, float hi, float x) {
  return (sin(t - x * 2. * PI) / 2. + .5) * (hi - lo) + lo;
} 

float vignetteScale = 116., vignettePow = .25;
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////--------------------------------------------------------
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
float bang2 = 0;
float cos1(float x) {
  return -cos(x * PI2) / 2 + .5;
}
float pulses(float w, float t) {
  return sin(t / w * PI2) > 0 ? 1 : 0;
}

// 4 44tel slide
const float ding1[8] = float[8](
  // achtung wird als 8tel takt genutzt!
1, 0, 1, 0, 0, 0, 0, 0);
float flash44Kick;
float flash44Hihat;
vec2 manPos = vec2(-1.80, .5);
//vec2 manPos=vec2(-1.80,.5);

vec4 result = vec4(0);

float blink;

  // ß000000000000000000000000000000000000000000000000000000000000000000000000000000
  // ß000000000000000000000000000000000000000000000000000000000000000000000000000000
  // marker animate methode
  // erklaerung:
  // hier findet die zeitbasierte aktualisierung aller params statt
  // die engine rendert hier 3 layer wobei jedes layer animationsparameter hat - diese werden im prinzip hier gesetzt
  // ß000000000000000000000000000000000000000000000000000000000000000000000000000000
  // ß000000000000000000000000000000000000000000000000000000000000000000000000000000
  // ß000000000000000000000000000000000000000000000000000000000000000000000000000000
  // ß000000000000000000000000000000000000000000000000000000000000000000000000000000

float sin3(float x) {
  return (sin(x * 1) + sin(x * 2) + sin(x * 3)) / 3;
}
float sin2(float x) {
  return (sin(x * 1) + sin(x * 2)) / 2;
}
float easeOutQuad(float t) {
  return 1.0 - (1.0 - t) * (1.0 - t);
}
float easeInOutQuad(float t) {
  return t < .5 ? 2.0 * t * t : 1.0 - pow(-2.0 * t + 2.0, 2.0) / 2.0;
}
float easeOutSine(float x) {
  return sin((x * PI) / 2);
}
// GLSL: Gauß-Spike zentriert bei x = 0.5
// f(x) = exp(-alpha * (x - 0.5)^2)

float spike(float x, float alpha) {
  float d = x - 0.5;
  return exp(-alpha * d * d);
}















//////////////////////////////////









/////////////////////////////////////////////////
// geter fuer char text
const int num_chars=114;

int getCharText(int index){

int index1=index%32;
int index2=(index/32)*5;
// dann ist result quasi die 5 index1 bits aber index2+n (n=1..5) nehmen

return 0;

}

////////////////////////////////////////////
/****
interface proposal>


deine f() methode, die sollten wir nun gemeinsam finalisieren als interface, so dass wir sie gemeinsam nutzen, also ich fuer faceman und du fuer auch alles wo du sie schon benutzt da mir das interface nicht klar ist wuerde ich es gerne hier definieren und abstimmen

/////////////////

interface globalmandel{
 float mandel_bailout=16.;
 int MAX_ITER=100;
 vec2 mandel_start=(0.0,0.0); 
 vec2 mandel_seed=(0.0,0.0);
 vec2 mandel_result_escapez;
 vec2 mandel_result_escapezvirtual; // for special intros
 int mandel_result_escapeiteration; 
 int mandel_result_escapeiterationvirtual; // for special intros
 void m() // m dann halt impl der mandelbrot iteration


/* Lemma>

normalisierte iter :mandel_result_escapeiteration/MAX_ITER;
smooth mandel: tbd irgendwas mit log
color by mandel_result_escapez
increase bailout for nicer smoothness
increase iter for deeper results in double/float range
julia mode> use pixel for mandel_start, mandel_seed for julia seed
mandelbrot mode> 0,0 for mandel_start, mandel_seed is pixel
mandelbrot pertubationmode> seed for mandel start, mandel_seed is pixel
}











*/

float maxiter = 45.,
      bailout = 4.,
      n = 100., // number of bobs
      height = 2., // of bob column
      pitch, // of camera
       k, i, jitter;

vec2 xy, z;
 
vec2 csqrt(vec2 z) {
  return pow(length(z), .5) * rotor(.5*atan(z.y, z.x));
}


void f() {
  for(k = 0.; k < maxiter; ++k) {
    z = cmul(z,z) + c;
    if(dot(z,z) > bailout)
      break;
  }
}
// julia view
//vec4 loc = vec4(0,0,2,0);
vec3 scene_refurio_julibob_tunnel (vec2 uv) {  
  float t=t/16;
  vec4 loc=vec4(0,0,2,0);

  pitch = cos(t)*.7; // horizon appears at -pi/4
  jitter = mod(t, 1./n);
  
  loc.w = t - 1.;
  r = loc.z * rotor(loc.w)/2.;
  
  // same as below, but jitter and i are zero:
  c = cardioid(rotor(t)); // A2
  // stable fixed point: z²-z+c = 0 => x1,2 = 1/2+-sqrt(1/4-c)
  loc.xy += vec2(.5, 0)-csqrt(vec2(.25, 0)-c);
  
  cr = rotor(pitch);
  cam_pos.yz = cmul(cr, cam_pos.yz);
  for(; i < n; ++i) {
    ray = vec3(uv, 1); // angle of view
    ray.yz = cmul(cr, ray.yz);
    ray = ray * (cam_pos.z + height*(i/n - jitter))/ray.z - cam_pos;
    
    // hide stuff behind camera
    if(ray.z > 0.) {
      c = cardioid(rotor(t + i/n - jitter)*1.0045); // A2
      // rolling morph effect:
      //c = cardioid(rotor(t + (i/n - jitter)*1.1)*1.0045); // A2
      z = cmul(ray.xy, r) + loc.xy;
      f();
      if(k < maxiter)
        break;
    }
  } 
  return hsv(.6, 1.-k/maxiter, 1.-length(ray)/height);
}


vec3 scene_refurio_julibob_columns (vec2 xy) {
  //t = sin(t*PI);
  t/=2.;
  
  float // camera
        pitch = -.5, // horizon appears at -pi/4
        
        // bobs
        n = 200., // number of bobs
        height = 2., // of bob column
        
        i,
        jitter = mod(t, 1./n);
  
  // same as below, but jitter and i are zero:
  c = cardioid(rotor(t)); // A2

  // julia view
  location.w += t/4.;
  
  vec2 r = location.z * rotor(location.w)/2.,
       cr;
  
  maxiter = 12.;
  
  // stable fixed point: z²-z+c = 0 => x1,2 = 1/2+-sqrt(1/4-c)
  //loc.xy = vec2(.5, 0.)-csqrt(vec2(.25, 0.)-c);
  
  vec3 cam_pos, ray;
  jitter = 0.;
  for(i = 0.; i < n; ++i) {
    cr = rotor(pitch);
    cam_pos = vec3(0., .5, 1.25); // view position
    cam_pos.yz = cmul(cr, cam_pos.yz);
    ray = vec3(xy, 1.); // angle of view
    ray.yz = cmul(cr, ray.yz);
    ray = ray * (cam_pos.z - height*(jitter - i/n))/ray.z - cam_pos;
    
    // hide stuff behind camera
    if(ray.z < -0.01)
      continue;

    // debug: highlight fixed points
    if(i > 3. && length(cmul(z,z) + c - z) < .002)
      return vec3(1.,0.,0.);

    vec2  m = vec2(.25);
    c = cardioid(rotor(t - jitter + i/n*m.x*8.))*1.5; // A2
    //c = rotor(t - jitter + i/n + loc.w)*loc.z + loc.xy; // A2
    // rolling morph effect:
    //c = cardioid(t - (jitter - i/n)*1.1, 1.0045); // A2
    z = cmul(ray.xy, r) + location.xy;
    f();
    if(k >= maxiter) {
      if(i == 0.) {
        float kk = k;
        maxiter = 30.;
        z = cmul(ray.xy, r) + location.xy;
        f();
        float s = (k-kk)/(maxiter-kk);
        return hsv(.6, s, 1.-length(ray)/height/3.);
      }
      break;
    }
  }
  return hsv(.6, 1.-k/maxiter, 1.-length(ray)/height/2.);
}







/////////////////////////////////////











float scene1=1;
vec4 wrapRefurio(vec2 fragCoord){
return scene1>0.5?
vec4(scene_refurio_julibob_tunnel(fragCoord),1):
vec4(scene_refurio_julibob_columns(fragCoord), 1);
}






vec4 mainWrap(vec2 fragCoord) {

/// achtung hier die methode direkt zu returnen
// unten werden aber alle 4 auch aufgerufen, man sollte also 
// hier die params fuer unten festlegen

//    column_height=(sin(t*30.)/2.+.5)*1.;
// ... grundgeruest, nach intro faengt spring und locationwechsel an

  // animate()
  // void animate() {

  // bobs one perspektive top down view
  // blink schaltet echt die beiden main layer x,y um, als crossfade, kann aber spaeter angepasst werden

  // unkritischer code, kann genutzt werden um halt was mal kurz flashen zu lassen
 // flash44Hihat = easeInOutTap(fract(t));

 // bang2 = easeInOutTap(fract(t / 4.)) + easeInOutTap(fract((t + 2) / 4));

  // eye seed
  man_seedEyes = vec2(-.35, 0);  

  // mouth seed
  //man_seedMouth= vec2(sin(t*PI*.5),cos(t*PI))*.3;  
  man_seedMouth = vec2(-1, 0);  
  // head pos
  man_headPos = vec2(-.1, 0);

  blink = pulses(1, t) * pulses(4 / 2, t);
  roughness = sin(t) * .2 + 1.1;
  float beat1 = t; // ganze note
  float beat2 = t * 2; // halbe noten
  float beat3 = beat2 * 2; // viertel noten

  if(beat1 >= 0) {
  // comming mode 
    manPos = vec2(mix(4.0, 0, easeOutQuad(smoothstep(0, 1, beat1 / 4))), 
    
    1 - (1 - smoothstep(0, 1, beat1 / 4)) * abs(sin(beat3) * 0.5) - 0.4);
  }
  if(beat1 > 4 && beat1 <= 8) {
  //gucki mode
//  man_seedEyes+=cardioid(smoothstep(0,3,beat1-4)*PI2,1);
// man_seedEyes += smoothstep(0, 1, beat1 - 4) * mix(vec2(-.2, .2), vec2(-.2, -0.2), sin((beat1 / 2) * PI));
// manEyesOpen=mix(0,0.5,sin(beat2*PI))
    manEyesOpen = 0.0;
    manEyesOpenSymmetry = 1;

    float animhead[4] = float[4](-0.1, 0, 0.05, 0);
    man_headPos.y += animhead[int(beat1 - 4)];
    manEyesOpen = animhead[int(beat1 - 4)] == 0 ? 0. : 0.8;
  }
  if(beat1 > 8 && beat1 <= 12) {
    // dancie mode
    //man_seedBody +=spike(fract(beat1),100)* sin(beat3);  
    man_headPos.x += clamp(sin((beat2 - 16) * PI), 0, 1) * 0.2;
    manPos.x -= abs(sin((beat3 - 32) * PI / 4)) * 0.1;

  }

  if(beat1 > 12 && beat1 < 14) {
    manEyesOpenSymmetry = 0.9;
  // zwinker mode
  //manPos+=vec2(smoothstep(0,1,beat1-12)*4.5,4.5);
    manEyesOpen += spike(fract(beat1 / 2), 100.);
    manEyesOpenSymmetry = 0;
  }
// beat 12/14 or something then will become the beam into the eye

  if(beat1 > 16 && beat1 <= 20) {




  // zoomie
    man_scale = expInterp(1., .01, fract((beat1 - 16) / 4));

    effectVisibility = smoothstep(15, 20, beat1);
      
    effectVisibility = 1;
  
    n=5;
scene1=0;
 location=vec4(0,0,2,0);
  }
//////////////////////////////////////// refurio edit start


  if(beat1 > 20 && beat1 < 40) {
 // firsty effect part  


    man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;
    n=5;
   location = locations[int(beat1 / 4) % NLOCATIONS];
scene1=0;
 location=vec4(0,0,2,0);
 
  }
if(beat1>40 &&beat1<48){
// title scene
    man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;
   location = locations[int(beat1 / 4) % NLOCATIONS];
scene1=1;
 // location=vec4(0,0,2,0);
 
}
if(beat1>=48 && beat1<16*4+12 ){
// scene zwischen titel und greetings
    man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;
   location = locations[int(beat1 ) % NLOCATIONS];
scene1=1;
// location=vec4(0,0,2,0);
 
}

if(beat1>=16*4+12 && beat1<16*4+6*8-4+12){
// greetings
    man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;

    n=flashBang4((beat1-4)/2,float[4](0,0,1,0))*90+10;
   location = locations[int(beat1 / 4) % NLOCATIONS];

scene1=1;
 //location=vec4(0,0,2,0);
 
}

if(  beat1>=16*4+6*8-4+12 && beat1<10*16){
 //main effect bis credits
     man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;
   location = locations[int(beat1 / 4) % NLOCATIONS];
scene1=0;
 location=vec4(0,0,2,0);
  
}

if(  beat1>=10*16&& beat1<10*16+4*6){

 //main effect bis credits
     man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;
   location = locations[int(beat1 / 4) % NLOCATIONS];
scene1=1;
  //location=vec4(0,0,2,0);
}


if(  beat1>=10*16+4*6&&beat1<10*16+4*6+8 ){

 //main effect bis credits
     man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;
   location = locations[int(beat1 / 4) % NLOCATIONS];
scene1=0;
  location=vec4(0,0,2,0);

}
 
if(beat1>=184&&beat1<200){
// 
//    .. ..
//     mandel
// main effekt power action

     man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;
   location = locations[int(beat1 / 4) % NLOCATIONS];
scene1=1; 

}



  if(beat1 > 10 * 16 + 12 && beat1 < 10 * 16 + 4 * 6 + 12) {
// credits und outro intro
// jedes wort wird 4 beat 1 angezeigt
// 1. credits nothing special
// 2. code nothing special
// 3. trifox mandelbrot 2d
// 4. refurio mandelbrot bobs
// 5. music nothing special
// 6. chlumpi bubumdadap

    man_Size = 0;
    float tnorm = t - 10 * 16;
    if(tnorm > 8 && tnorm < 12) {
  // trifox
     
    }
    if(tnorm > 12 && tnorm < 16) {
  // refurio
 
    }
    if(tnorm > 20 && tnorm < 24) {
  //chlumpie 

    }

  // bump zoom bei credits
 location.z += effectVisibility * flashBang8(tnorm * 2, float[8](0, 1, 1, 0, 1, 0, 0, 1)) * location.z;

  }

  // if(beat1 > 10 * 16 + 4 * 6 && beat1 < 12 * 16) {
  //   man_scale = expInterp(1, .01, 1 - fract((beat1) / 4));
  // }

  return effectVisibility * wrapRefurio(fragCoord);
}


//EOE/////////////////////////////////////////////////////////////////////////////////////////////////////// 
//
// This is c++ call wrap header, ommit this when editing it in the editor
//
// Reasoning:
// out declarations toplevel are not really useful, in c++ world it is the declared output of the shader
// in glsl this is handled similarly but using that gl_FragColor instead, having the mainWrap() method to be used in html editor
float vignette(vec2 uv) {

  return pow(uv.x * uv.y * 15, .25); // change pow for modifying the extend of the  vignette

}

float vignetteRect(vec2 uv) {
    // map uv into rectangle coords [0..1]
  vec2 rel = (uv - (vigCenter - vigSize * .5)) / vigSize;

    // clamp to rectangle range
  rel = clamp(rel, 0, 1);

    // same trick: stronger near edges
  vec2 f = rel * (1 - rel);

  float vig = f.x * f.y * vigIntensity;

    // control falloff
  vig = pow(vig, vigPower);

  return vig;
}
//EOE/////////////////////////////////////////////////////////////////////////////////////////////////////// 
//
// This is c++ call wrap header, ommit this when editing it in the editor
//
// Reasoning:
// out declarations toplevel are not really useful, in c++ world it is the declared output of the shader
// in glsl this is handled similarly but using that gl_FragColor instead, having the mainWrap() method to be used in html editor

void main() {
  // t is timed to beat
  t = (float(m) / 44100) / (60 / bpm);

// debug offset
//t-=0.5;
  vec2 uv = gl_FragCoord.xy / iResolution.xy;

  vec4 rz = mainWrap(uv * 2 - 1);
  vec4 mandelTriklops = vec4(makePal2(mandelMan((uv * 2 - 1) * man_Size + manPos)), 1);   

 o=rz;
  //o = rz * vignetteRect(uv);
  o = max(o, mandelTriklops);

  uv = gl_FragCoord.xy / iResolution.xy;

  vec2 uvOri = uv;

// text stuff
  uv.y = 1 - uv.y;
  uv.x *= 2;
//    uv.x+=t*.1;
  uv *= 12;
  int wordi = 0;
    // Manual Word encoding

  if(t > 40 && t < 48) {
      // name/title
    wordi = 1;
  }
  if(t > 4 * 16 + 3 * 4 && t < 4 * 16 + 3 * 4 + 6 * 8 - 4) {
      //greetings
    wordi = 2 + int(((t - (4 * 16 + 3 * 4)) + 4) / 8) % 6;
  }
  if(t > 160 && t < 160 + 4 * 5) {
      //credits
    wordi = 8 + int((t - 10 * 16) / 4) % 5;
  }

  vec2 wordPos = word2(wordi);
  if(uvOri.y < .54 && uvOri.y > .42 ) {

// black bg
    o *= .5;

    if(
  // nutze nur ausschnitt aus space
    fract(uv.x) < .5 &&
      fract(uv.y) < .5) {

      int charIndex = int(wordPos.x) + int(uv.x) % TEXT_LEN;
      charIndex -= int((26 - wordPos.y) / 2);
      o += vec4(characterVertical(fract(uv * (1 / .5)), uint(text[charIndex >= (wordPos.x) && charIndex <= wordPos.x + wordPos.y ? charIndex : 0])));
    }
  }  
/*
if(uv.y>0.2 && uv.x<t/256 ) {
  o=vec4(0,1.,0.,1.);
}
*/ 
/** Anti Alias 
  
  for (float i=0.; i<4.; i++) 
  {
    vec2  of = floor(vec2(i/2.,mod(i,2.)))-0.5;
    vec2 project = gl_FragCoord.xy+ of;
    rz += mainWrap((project/iResolution)*2.0-1.0,t);
  }
    
  rz /= 5.;
  o= rz;
*/
}

////////////////////////////////////////////////////////////////
