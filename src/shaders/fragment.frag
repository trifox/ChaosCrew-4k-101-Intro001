#version 430
const vec2 iResolution = vec2(1920, 1080);

uniform int m; // Time in sample player 
out vec4 o; 
////////////////////////////////////////////////////////////////
float man_Size = 2.5;
const float PI = acos(-1.);
const float PI2 = PI * 2;
//const float HALF_PI = PI / 2;
const float BAILOUT = 256;
//const int SIXTEEN = 16;
float MAX_ITER = 250; 
// returns vignette intensity at uv for a given rectangular area
//vec2 vigCenter = vec2(.5, .5);
//vec2 vigSize = vec2(1, 1);
//float vigIntensity = 31.;
//float vigPower = .5;
//float effectVisibility = 0;
float t;
bool isMandel = true;



vec2 xy;

/*
const float beatTrack_1[SIXTEEN]=float[SIXTEEN](
  // paradiddle pattern
    1,0,1,0,
    0,0,0,0, 
    0,0,0,0,
    0,0,0,0
    ); 
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
const int NLOCATIONS = 14;
// vec4 real,imag,scale for locations  
//const vec4 locations[NLOCATIONS] = vec4[NLOCATIONS](
//vec4(-0.525971082531,-0.696943648552,0.0012521592421613436,-1.4127195914530066)
//);


const vec3 locations[NLOCATIONS] = vec3[NLOCATIONS](

vec3(-0.52597,.696944,0.001252),
// nice 
vec3(-0.1565,1.0322,0.081886),
// oker 
vec3(-1.408446,0.136171,0.005327),
// line ok 
vec3(-1.625413,0,0.040293),
// on the line, ok 
vec3(-1.754877666,0,0.18201981627989672),


vec3(-0.596891,0.662980,0.021384),

vec3(-1.966773216393,0,0.00035591307491505736),


/// alte coords


vec3(0.3604,.61491,0.0116),
vec3(-1.87,0.,.0002675),
vec3(-0.52597,.696944,0.001252),
vec3(-0.528326,.704073,0.0001073),
vec3(-0.724136,.361574,0.000676),
vec3(-0.69094,.46535,0.00832),
vec3(-0.7113,.473618,6.14e-05)

);
vec4 location = vec4(locations[0],0);

/////////////////// 
/////////////////// Font stuff
/////////////////// 

const int A = 9;
const int TWO = 24;
const int B = 23;
const int C = 8;
const int D = 22;
const int E = 0;
const int F = 21;
const int G = 20;
const int H = 19;
const int I = 3;
const int L = 7;
const int M = 18;
const int N = 2;
const int O = 6;
const int P = 17;
const int R = 1;
const int S = 4;
const int T = 10;
const int U = 5;
const int V = 16;
const int X = 15;
const int Y = 16;
const int OE = 13; 
const int COLON = 11;
const int SLASH = 12; 
const int _ = 30;

//const int TEXT_LEN = 109;
const int[109] text = int[109](
  _,
   
  
   _, M, A, N, D, E, L, B, R, OE, T, C, H, E, N, _,
   G, R, E, E, T, I, N, G, S, COLON,_, 
   N, U, A, N, C, E, _, R, E, B, E, L, S, _, F, R, A, C, T, A, L,SLASH,F, O, R, U, M, S,SLASH,C,H,A,T,S, _,
    R, E, V, I, S, I, O, N,  _,
      C, O, D, E,COLON,_ , 
     T, R, I, F, O, X, SLASH, R, E, F, U, R, I, O, 
     _, M, U, S, I, C, COLON,_, C, H, L, U, M, P, I, E, _);

//const vec3[3] textanim = vec3[3](
  // wordindex, numwords to show, beatindex
//vec3(0, 1, 16), vec3(0, 1, 10 * 4), vec3(0, 1, 25 * 4));
/*
const int bitmap3x3verticalold[9] = int[]( 
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
*/
const int bitmap3x3vertical[9] = int[]( 
                   //         2bdfghmpvxyö/:taclousinre
    0x1BFE5E3, //  00000001101111111110010111100011  
    0x1360F5F, //  00000001001101100000111101011111
    0x16FF577, //  00000001011011111111010101110111
    0xFF23F7, //  00000000111111110010001111110111
    0x1EEF61F, //  00000001111011101111011000011111
    0xDF2274, //  00000000110111110010001001110100
    0x01FEB3F7, //  00000001111111101011001111110111
    0x1D16DF9, //  00000001110100010110110111111001
    0x1DCA3E7  //  00000001110111001010001111100111
);

uint characterVertical(vec2 uv, uint c) {
  uint b = uint(bitmap3x3vertical[int(uv.y * 3) * 3 + int(uv.x * 3)]);
  return (b >> c) & 1u;
}

vec2 word2(int idx) { 
  int w = -1;
  for(int i = 0; i < 109; i++) {
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
/*
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}
*/
/*float characterMasked(vec2 uv, uint chari) {
  float circ = sdCircle(uv * 2. - 1., 1.);
  return float(characterVertical(uv, chari)) * smoothstep(0.25, .0, circ);
}
*/

vec2 cardioid(vec2 r) {
  return (r+r-cmul(r,r))/4;
}


/////////////////
// zeit performance im timelapse wir haben 18:55 die fraktal panel show angefangen aber erst 20:30 kommen wir angelaufen,
// im video zeit 36:31 




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
/*
float easeInOutTap(float t) {
  return smoothstep(.0, .2, t) * (1.0 - smoothstep(.8, .1, t));
}
*/
vec2 rotor(float a) {
  return vec2(cos(a), sin(a));
}

vec3 hsv(float h, float s, float v) {
  return v * mix(vec3(1), clamp(abs(6*fract(h + vec3(3,2,1)/3) - 3) - 1, 0, 1), s);
}

/*
vec3 cmix(vec3 a, vec3 b, float t) {
  return sqrt(mix(a * a, b * b, t));
}
 */


float       bailout = 256, 
      height = 4, // of bob column
      pitch=.2, // of camera
       k, jitter=.2;

vec2   z,c;
 
/*vec2 csqrt(vec2 z) {
  return pow(length(z), .5) * rotor(.5*atan(z.y, z.x));
}
*/


 

bool fMandelbrot(vec2 c, vec2 z0) {
  z = z0;
  for(k = 0; k < MAX_ITER; ++k) {
    z = cmul(z, z) + c;
    if(dot(z, z) > BAILOUT)
      return false;
  }
  return true;
} 



void f() {
      if(isMandel){
            vec2 zsafe=z;
            z=c;
            c=zsafe;
      }
// lets wrap it
fMandelbrot(c,z);

//  for(k = 0; k < MAX_ITER; ++k) {
//    z = cmul(z,z) + c;
//    if(dot(z,z) > bailout)
//      break;
//  }
} 

vec3 mandelbrotCore(vec2 c, vec2 z0) {
  fMandelbrot(c, z0);
  return vec3(z.xy, k / MAX_ITER);
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
  return mandelbrotCore(cmul(c, rotor(location.w)) * location.z + location.xy, vec2(0));
}
vec3 mandelbrotRenderJulia(vec2 c, vec4 loc) {
  return mandelbrotCore(loc.xy, cmul(c, rotor(loc.w)) * loc.z + loc.xy);
}


vec2 man_seedEyes = vec2(0);
vec2 man_seedBody = vec2(0);
vec2 man_seedMouth = vec2(0);
vec2 man_headPos = vec2(0);
vec2 man_scaleCenter= vec2(-.15,.15);
float man_scale = 1;
//float manFace = 1;
float manEyesOpen = 0; // eyes open 0 = outside closed 
float manEyesOpenSymmetry = 0; // controls how much of the opennes the second eye follows  
float manEyesSymetry = 1; // -1 eyes x pos mirrored, 1 same seed for both eyes
float mandelMan(vec2 uvIn) {

  float fragColor = 0;
  // Normalized pixel coordinates (from 0 to 1)
  vec2 center = vec2(.5, 0);
  float scale = 2;
  vec2 eyePos = center + vec2(3.15, 2.4); 
  vec2 uv = (cmul(uvIn, rotor(radians(90)))-man_scaleCenter  )* man_scale+man_scaleCenter ;
  // Mandelbrot 
  fragColor =step(1, mandelbrotExt(uv, man_seedBody * .25, center + vec2(-1.3, 0), scale * .4, 180)) * .75;

  uv += man_headPos;
  fragColor +=step(1, mandelbrotExt(uv, vec2(0), center, scale * 1, 180) );

  fragColor=fragColor
  - juliaExt(uv, man_seedEyes - vec2(manEyesOpen * manEyesOpenSymmetry, 0), center + eyePos, scale * 8, -90)  

  - juliaExt(vec2(uv.x, manEyesSymetry * uv.y), man_seedEyes - vec2(manEyesOpen, 0), center + vec2(eyePos.x, eyePos.y * -manEyesSymetry), scale * 8, -90)
            /// den mund, da wollen wir die schwarzen bereiche mit zaehnen also vertikalen streifen rendern
  - juliaExt(uv, man_seedMouth, center + vec2(-5, 0), scale * 8 , 90);

  return fragColor;
}
//////////////////////////
/*
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

*/

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


vec3 makePal2(float i) {
  return vec3(.2549, .8824, .4118) * i;
}


/*
vec3 pal(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return a + b * cos(PI2 * (c * t + d));
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
*/

//float juliastep = 0;

vec2 brotVisibilities = vec2(1, 0);
 // minibrote trifox
vec4 scene2Mandelbroetchen( ) {  
//  float vis=beatTrack_1[index]; 
  // vec2 v = fragCoord; // to -1 +1 real,imag
  // arg allgemeiner winkel, normalisiert dann auf 0..1 also der winkel 0..360

//    int indexAchtel=int(floor(mod(t,32.)));
//    vec4 keyframe=getKeyFrame(t);

  vec3 l = mandelbrotRender(xy);
  vec3 ljulia = mandelbrotRenderJulia(xy, vec4(location.xy, location.z *2, location.w));

  vec4 result = brotVisibilities.x * vec4(hsv(0,1-l.z,l.z), 1) + brotVisibilities.y * vec4(hsv(ljulia.z+t,1-ljulia.z,ljulia.z), 1);

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

/*
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
*/
///////////////////
////////////// for the sake of code, we have to redo this globall method using
// an init function for setting the iteration? wtf!
/*
vec2 lissajous(float lissa, float shift, float t) {
  return vec2(cos(t - shift * lissa), sin(t - shift));
}
*/
/*
float sqr(float x) {
  return x * x;
}
*/
float   nbobs = 100; // 1.0 is a circle
//amplitude = .0, // of lissjous animation
//arclen = .1, // 1.0 is full circle
//lspeed = 1. / 16., // of lissajous anmation

//speed = .125, // at which julia parameters are animated
//roughness = .5, // of julia pertubation
//cangle = 10, // angle pertubation changes from head to tail

//column_height = 1., column_shift = -.1;

      // julia view ;
      //angle = 0.;

vec2 center = vec2(0), r,   cr, uv;

vec3 col, ray, offset, cam_pos;

//float seedStrengsth = 0; // lisajou julia strength
vec3 camera(float a, float d, vec3 v) {
  v.yz = cmul(v.yz, rotor(a));
  //v.xy *= (-1.-d)/(v.z-1.-d);
  v.xy *= (d - 1) / (v.z + 1 + d);
  return v;
}
/*
float osc(float lo, float hi, float x) {
  return (sin(t - x * 2. * PI) / 2. + .5) * (hi - lo) + lo;
} 
*/
//float vignetteScale = 116., vignettePow = .25;
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
//float bang2 = 0;
/*float cos1(float x) {
  return -cos(x * PI2) / 2 + .5;
}
float pulses(float w, float t) {
  return sin(t / w * PI2) > 0 ? 1 : 0;
}
*/
// 4 44tel slide
/*const float ding1[8] = float[8](
  // achtung wird als 8tel takt genutzt!
1, 0, 1, 0, 0, 0, 0, 0);*/
//float flash44Kick;
//float flash44Hihat;
vec2 manPos = vec2(-1.8, .75);
//vec2 manPos=vec2(-1.80,.5);

//vec4 result = vec4(0);

//float blink;

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
float easeOutQuad(float t) {
  return 1 - (1 - t) * (1 - t);
}

// GLSL: Gauß-Spike zentriert bei x = 0.5
// f(x) = exp(-alpha * (x - 0.5)^2)

float spike(float x, float alpha) {
  float d = x - .5;
  return exp(-alpha * d * d);
}

/*
float sin3(float x) {
  return (sin(x * 1) + sin(x * 2) + sin(x * 3)) / 3;
}
float sin2(float x) {
  return (sin(x * 1) + sin(x * 2)) / 2;
}
float easeInOutQuad(float t) {
  return t < .5 ? 2.0 * t * t : 1.0 - pow(-2.0 * t + 2.0, 2.0) / 2.0;
}
float easeOutSine(float x) {
  return sin((x * PI) / 2);
}
*/














//////////////////////////////////









/////////////////////////////////////////////////
// geter fuer char text 



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

/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
////////////// REFURIO 20251002
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
 int j;
//vec2 cstart=vec2(0);
////////////////////////////////////////////////////////////////

vec3 scene_all(int which/* 0...3 3 is 2d*/,float t) {   
    location.w += t ;
  if(which == 0) { // anemone
    
//    maxiter = 25.;
    pitch = cos(t)*.17;
    height=2;
    jitter =1*location.z;
//    cam_pos = vec3(sin(t*4)*0.25, cos(t*4)*0.25, sin(t)+1.25); // view position
    cam_pos = vec3(sin(t)*.1,sin(t)*.1,  .6); // view position
  }
  if(which == 1) { // tunnel
   t=t/8;
     height=3;
    pitch = cos(t)*.17;
//    location.w = t  ; 
  //  location.x+=location.z*1;
//    height=0;
    // jitter =  mod(t, 1./nbobs); 
    cam_pos = vec3(0,0, .6); // view position
//    jitter = 3;
   // jitter = 10.5*location.z;
  //  location.xy += location.z*( vec2(.5, 0)-csqrt(vec2(.25, 0)-c));
  }
  r = location.z * rotor(location.w)/2;  
  // this rotor crap, for what is it good, a 2d rotation?
  cr = rotor(pitch);
  cam_pos.yz = cmul(cr, cam_pos.yz);
  float s;
  vec3 col;
  for(; j < nbobs; ++j) {
    ray = vec3(xy, 1); // angle of view
    ray.yz = cmul(cr, ray.yz);
    ray = ray * (cam_pos.z + height*(j/nbobs - jitter))/ray.z - cam_pos;
    
    // hide stuff behind camera
    if(ray.z > .001) {
      z = cmul(ray.xy, r)  + location.xy ; 
      if(which == 0) // anemone
        c = location.xy+location.z* .07*cardioid(rotor(t + j/nbobs*2 - jitter))*1.4; // A2
      if(which == 1) // tunnel
        c = location.xy+location.z*0.15*cardioid(rotor(t + j/nbobs - jitter)*1.0045); // A2
        // rolling morph effect:
        //c = cardioid(rotor(t + (i/n - jitter)*1.1)*1.0045); // A2
     
//c=cstart;
//if(brotVisibilities.y>0){
//  z=cstart;
//  c=z;

//}

      f();

      s = 1-k/MAX_ITER;
 
      if(which == 0) { // anemone
        if(k >= MAX_ITER) {
          if(j == 1) { // compute cap
            float kk = MAX_ITER;
         //   maxiter = 30.;
            z = cmul(ray.xy, r) + location.xy;
            f();
            s = (k-kk)/(MAX_ITER-kk);
          }
          break;
        }
      }
      else  if(k < MAX_ITER)
        break;
    }
  } 
  return hsv(.6, s, 1-(length(ray)-cam_pos.y)/height);
}
 
////////////////////////////////////////////////////////////////
   
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////

/* glsl miinifer just not working, comment out unused stuff manually now
const int EFFECTYVISIBILITY_KEY_INDEX=0;
 const int NBOBS_KEY_INDEX=2;
const int MANDELBROT_VISIBILITY_INDEX=1;
const int BOBMODE_KEY_INDEX=3; 
const int MAX_ITER_KEY_INDEX=4;

float keyframes2[9*5]=   {
  // effectvisibility, mandelbrotvisibility , nbobs, bobmode,maxiter
  // intro
  0,0,0,0,200,
  // effect1
  0,1,0,0,200,
  // titel
  0.0,.5,10,0,200,
  // effect2
  1,1,25,0,200,
  // greetings
  0.0,0.5,10,0,200,
  // effect 3
  1,1,50,1,200,
  // credits   
  0,.5,0,0,200,
  // effect 4
  1,1,50,1,200,
  // outro
  0,0,0,0,200


};
 

float[5] getSceneKeyframe(float t){ 
  int scene=getSceneValues(t)*5;
  return float[5](
    keyframes2[scene+0],
    keyframes2[scene+1],
    keyframes2[scene+2],
    keyframes2[scene+3],
    keyframes2[scene+4]
    );
}
*/

 const int scenes[9]=int[9](
  // scene indexes, dies sind die takte  an welchen die wechsel stattfinden
    // intro,pretitle,title,posttitle,greetings,postgreetings,credits,postcredits,outro
    0,20,40,48,76,120,160,190,294
    
);

int getSceneIndexFromTime(float t){
  // absolute convenience method, we need this for distinguishing between scenes rather than checking t with bpm count
  for(int i=8;i>=0;i--){
    if(scenes[i]<=t){
      return i;
    }
  }
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
 
//  roughness = sin(t) * .2 + 1.1;
  float beat1 = t; // ganze note
  float beat2 = t * 2; // halbe noten
  float beat3 = beat2 * 2; // viertel noten





// Keyframe
//float[5] keyframe=getSceneKeyframe(t); 
//effectVisibility=keyframe[EFFECTYVISIBILITY_KEY_INDEX];
//nbobs=keyframe[NBOBS_KEY_INDEX];  

float xxxVisibility=0;
float mandelbrotVis=0;//keyframe[MANDELBROT_VISIBILITY_INDEX];
//location=locations[int(t*keyframe[LOCATION_SPEED_KEY_INDEX])%NLOCATIONS];

location.xyz=locations[int(beat3/16)%NLOCATIONS];

// die locations anim soll lang kurz kurz sein
//t*=4;
 if(mod(beat3,16)<8){
  location.z*=1+mod(t,8)/8;
  brotVisibilities=vec2(1,0);
    isMandel=true;
}else if(mod(beat3,16)<12){
  brotVisibilities=vec2(0,1);
//  location.z*=2+mod(t,4)/4;
    isMandel=false;
  location.z*=1;
}else{
  location.z*=.66;
    brotVisibilities=vec2(0,1);
    isMandel=false;
}

//location.z*=flashBang(t*2,beatTrack_1)+1.;

//int which=int(keyframe[BOBMODE_KEY_INDEX]);
//isMandel=keyframe[JULIAMODE_KEY_INDEX]<.5; 
//MAX_ITER=int(keyframe[MAX_ITER_KEY_INDEX]);

 man_Size=2.5;

  if(beat1 >=0) {
  // comming mode  
    manPos = vec2(mix(4, 0, easeOutQuad(smoothstep(0, 1, beat1 / 4))), 
    
    1 - (1 - smoothstep(0, 1, beat1 / 4)) * abs(sin(beat3) * .5) - .8);
  }
  if(beat1 > 4 && beat1 <= 8) {

  //gucki mode
//  man_seedEyes+=cardioid(smoothstep(0,3,beat1-4)*PI2,1);
// man_seedEyes += smoothstep(0, 1, beat1 - 4) * mix(vec2(-.2, .2), vec2(-.2, -0.2), sin((beat1 / 2) * PI));
// manEyesOpen=mix(0,0.5,sin(beat2*PI))
    manEyesOpen = 0;
    manEyesOpenSymmetry = 1;
 
    float animhead[4] = float[4](-.1, 0, .05, 0);
    man_headPos.y += animhead[int(beat1 - 4)];
    manEyesOpen = animhead[int(beat1 - 4)] == 0 ? 0 : .8; 
     man_seedMouth = vec2(animhead[int(beat1 - 4)]==0?-1:-1.25, .05);  
  }
  if((beat1 > 8 && beat1 <= 12) || (beat1>204&&beat1<206)){ 
    // dancie mode
    //man_seedBody +=spike(fract(beat1),100)* sin(beat3);  
    man_headPos.x += clamp(sin((beat2 - 16) * PI), 0, 1) * .2;
    manPos.x -= abs(sin((beat3 - 32) * PI / 4)) * .1;

  man_seedMouth+= vec2(sin(t*PI*2.5),cos(1*t*PI))*vec2(.5,.25);  
  //  man_scale=1;

  }

  if((beat1 > 12 && beat1 < 14) || (beat1>206&&beat1<208)) {
    manEyesOpenSymmetry = .9;
 man_Size=2.5;
  // zwinker mode
  //manPos+=vec2(smoothstep(0,1,beat1-12)*4.5,4.5);
    manEyesOpen += spike(fract(beat1 / 2), 100);
    manEyesOpenSymmetry = 0;
//    man_scale=1;
  }
// beat 12/14 or something then will become the beam into the eye

  if(beat1 > 16 && beat1 <= 20) {

 

  // zoomie
    man_scale = expInterp(1, .01, fract((beat1 - 16) / 4)); 
//    manPos.y+=1.5;
//    manPos.x-= 1.75;
    mandelbrotVis = smoothstep(15, 20, beat1);
      
  }
  int whichEffect=0;
// man verstecken 
if(beat1>20&&beat1<200){
  man_Size=0;
  mandelbrotVis=1;
} 

int indexscene=getSceneIndexFromTime(t);
if(indexscene==3||indexscene==4 ){
xxxVisibility=1;
  mandelbrotVis=0;
  whichEffect=1;
}else

if(indexscene==5||indexscene==6){
xxxVisibility=1;
  mandelbrotVis=0;
  whichEffect=0;
}else
if(indexscene==7){
xxxVisibility=.5;
  mandelbrotVis=.5;
  whichEffect=int(t)%2;
  nbobs=sin(t)*50+50;
} else{
  xxxVisibility=0;
}
/*
if(getSceneIndexFromTime(t)==8){
  effectVisibility=1;
  mandelbrotVis=1;
  whichEffect=int(t/4)%2;
}
*/

//////////////////////////////////////// refurio edit start
/*
  if(beat1 > 20 && beat1 < 40) {
 // firsty effect part  


    man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 4;
   location = locations[int(beat1 / 4) % NLOCATIONS]; 
 location=vec4(0,0,2,0);
 
  }
if(beat1>40 &&beat1<48){
// title scene
    man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;
   location = locations[int(beat1 / 4) % NLOCATIONS]; 
 // location=vec4(0,0,2,0);
 
}
if(beat1>=48 && beat1<16*4+12 ){
// scene zwischen titel und greetings
    man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;
   location = locations[int(beat1 ) % NLOCATIONS]; 
// location=vec4(0,0,2,0);
 
}

if(beat1>=16*4+12 && beat1<16*4+6*8-4+12){
// greetings
    man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;

    nbobs=flashBang4((beat1-4)/2,float[4](0,0,1,0))*90+10;
   location = locations[int(beat1 / 4) % NLOCATIONS];
 
 //location=vec4(0,0,2,0);
 
}

if(  beat1>=16*4+6*8-4+12 && beat1<10*16){
 //main effect bis credits
     man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;
   location = locations[int(beat1 / 4) % NLOCATIONS]; 
 location=vec4(0,0,2,0);
  
}

if(  beat1>=10*16&& beat1<10*16+4*6){

 //main effect bis credits
     man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;
   location = locations[int(beat1 / 4) % NLOCATIONS]; 
  //location=vec4(0,0,2,0);
}


if(  beat1>=10*16+4*6&&beat1<10*16+4*6+8 ){

 //main effect bis credits
     man_Size = 0;
    effectVisibility = 1;
    cam_a = 0;
    nbobs = 1;
   location = locations[int(beat1 / 4) % NLOCATIONS]; 
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

//;  return effectVisibility * wrapRefurio(fragCoord);

*/
;
// pitch = cos(t/4)*.7; 
 
 //   jitter = 0.1;
 //   cam_pos = vec3(0., .5, 1.25); // view position
//  location.w = t/32 ; 
//nbobs=100; 
//location=vec4(0,0,2,0);
//location.z
// location.z=2;
//location.xy +=location.z* (vec2(.5, 0)-csqrt(vec2(.25, 0)-c));
//  jitter = mod(t/32, 1./nbobs); 
 

vec4 res=   mandelbrotVis*scene2Mandelbroetchen();
if(xxxVisibility>0){
   res       +=vec4( scene_all(whichEffect,t/4),1)*xxxVisibility ;
}
return res;
  }


//EOE/////////////////////////////////////////////////////////////////////////////////////////////////////// 
//
// This is c++ call wrap header, ommit this when editing it in the editor
//
// Reasoning:
// out declarations toplevel are not really useful, in c++ world it is the declared output of the shader
// in glsl this is handled similarly but using that gl_FragColor instead, having the mainWrap() method to be used in html editor
/*
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
*/
//EOE/////////////////////////////////////////////////////////////////////////////////////////////////////// 
//
// This is c++ call wrap header, ommit this when editing it in the editor
//
// Reasoning:
// out declarations toplevel are not really useful, in c++ world it is the declared output of the shader
// in glsl this is handled similarly but using that gl_FragColor instead, having the mainWrap() method to be used in html editor


// text engine keyframes
// start, end, wordpos,words
int  wordMap[3*4]={
40,48,1,1,
76,116,2,6,
160,192,7,5
};
int getWord(){

for(int i=0;i<3;i++){
if(t>=wordMap[i*4] && t<wordMap[i*4+1])
  return     wordMap[i*4+2] + int((t - wordMap[i*4]) / 8)%wordMap[i*4+3];
}

  return 0;
}
void main() {
  // so ultra hardcore release hack:
  // this formula evaluates due to the optimizer to an error, it is best to manually calc the factor and just put it in like this for 26 revision release:   t =float(m)*4.8e-5;
  // t is timed to beat 
  float bpm=147.;
  t = (float(m) / 44100) / (60 / bpm);

  // t is timed to beat lol hard code due to minimier 0s i
  // production build  
//  t =float(m)*4.8e-5;

  xy = (2*gl_FragCoord.xy-iResolution.xy)/max(iResolution.x, iResolution.y);
  // debug offset
  //t-=0.5;
  vec2 uv = gl_FragCoord.xy / iResolution.xy;

  vec4 rz = mainWrap(xy);
  vec4 mandelTriklops = vec4(makePal2(mandelMan((xy) * man_Size + manPos)), 1);   
 
  o=rz;
 // o = rz * vignetteRect(uv);
  o = max(o,step(1,man_Size)* mandelTriklops);
 

  vec2 uvOri = uv;

// text stuff
  uv.y = 1 - uv.y;
  uv.x *= 2;
//    uv.x+=t*.1;
  uv *= 12; 
int word=getWord();
  vec2 wordPos = word2(word);
  if(word!=0 && uvOri.y < .54 && uvOri.y > .42 ) {
// black bg
    o *= .5;
    if(
  // nutze nur ausschnitt aus space
    fract(uv.x) < .5 &&
      fract(uv.y) < .5) {
      int charIndex = int(wordPos.x) + int(uv.x) % 109;
      charIndex -= int((26 - wordPos.y) / 2);
      o += vec4(characterVertical(fract(uv * (1 / .5)), uint(text[charIndex >= (wordPos.x) && charIndex <= wordPos.x + wordPos.y ? charIndex : 0])));
    }
  }  
  
}

////////////////////////////////////////////////////////////////
