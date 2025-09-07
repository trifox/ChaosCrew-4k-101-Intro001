#version 330
const vec2 iResolution=vec2(1920,1080);  

uniform int m; // Time in sample player 
out vec4 o; 
////////////////////////////////////////////////////////////////
float man_Size=2.5;
const float PI = acos(-1.);
const float PI2= PI*2;
const float HALF_PI=PI/2;
const float BAILOUT=256;
const int SIXTEEN=16;

float MAX_ITER = 70; 
const float bpm = 127.0; // forcompletion beats per minute 
// returns vignette intensity at uv for a given rectangular area
vec2 vigCenter=vec2(.5,.5 );
vec2 vigSize=vec2(1,1);
float vigIntensity=31.;
float vigPower=  .5;

float t;

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
const int NLOCATIONS=7;
// vec4 real,imag,scale for locations  
const vec4 locations[NLOCATIONS] = vec4[NLOCATIONS]( 

vec4(.3812,.5993,.0043,.21),
vec4(.3604,.6149,.0116,2.47),
vec4(.3771,.6668,.0010,1.51),
vec4(.3768,.6785,.0012,.65),
vec4(.3598,.6847,.0055,3.12),
vec4(.3592,.6425,.0471,2.04),
vec4(.156,1.0322,.0818,2.47)



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
vec4 location = locations[4];


/////////////////// 
/////////////////// Font stuff
/////////////////// 

const int A=0;
const int B=1;
const int C= 2;
const int D= 3;
const int E= 4;
const int F= 5;
const int G= 6;
const int H= 7;
const int I= 8;
const int J= 9;
const int K= 10;
const int L= 11;
const int M= 12;
const int N =13;
const int O= 14;
const int P= 15;
const int Q= 16;
const int R =17;
const int S =18;
const int T =19;
const int U =20;
const int V= 21;
const int W= 22;
const int X= 23;
const int Y= 24;
const int Z= 25;
const int OE= 26;
const int MINUS= 30;
const int PLUS =28;
const int SLASH= 27;
const int THING =29;
const int _ =31  ;



const uint bitmap3x3vertical[9] = uint[]( 
    // 32 3x3 characters packed in this one
                 //  abcdefghijklmnopqrstuvwxyz
    0x6F3BDFA0u, //  01101111001110111101111110100000  
    0xAEC7F04Cu, //  10101110110001111111000001001100
    0x3D2FFFF0u, //  00111101001011111111111111110000
    0xFF3FEE6Eu, //  11111111001111111110111001101110
    0xDDED77FEu, //  11011101111011010111011111111110
    0xD30FAE6Eu, //  11010011000011111010111001101110
    0xFF7FEB70u, //  11111111011111111110101101110000
    0x7A9ABEECu, //  01111010100110101011111011101100
    0xFB3E4B20u  //  11111011001111100100101100100000
);
 
uint characterVertical(vec2 uv,uint c){
    uint b=bitmap3x3vertical[int(uv.y*3.)*3+int(uv.x*3.) ]; 
    return (b >> ( 31u-c )) & 1u;
} 

float sdCircle( vec2 p, float r )
{
    return length(p) - r;
}

float characterMasked(vec2 uv,uint chari){  
    float circ=sdCircle(uv*2.-1.,1.);
    return float(characterVertical(uv,chari))*smoothstep( 0.25,.0,circ );
}

const int TEXT_LEN = 18;
const int[TEXT_LEN] text = int[TEXT_LEN](
MINUS,_,M,A,N,D,E,L,B,R,OE,T,C,H,E,N,_,MINUS
);

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
    return smoothstep(.0, .25, t) * (1.0 - smoothstep(.01, .25, t));
} 
vec2 cmul(vec2 a, vec2 b) { 
  return vec2(a.x*b.x-a.y*b.y,  a.x*b.y+a.y*b.x);
}
vec2 rotor(float a) {
  return vec2(cos(a), sin(a));
}

vec3 hsv(float h, float s, float v) {
  vec4 Ki = vec4(1, 2 / 3, 1 / 3, 3);
  vec3 p = abs(fract(vec3(h,h,h) + Ki.xyz) * 6 - Ki.www);
  return v * mix(Ki.xxx, clamp(p - Ki.xxx, 0, 1), s);
}
vec3 cmix(vec3 a, vec3 b, float t) {
  return sqrt(mix(a*a, b*b, t));
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
  return vec3(f_z.xy,  f_k/MAX_ITER  );
}
vec2 project(vec2 uv,vec2 center, float scale, float angle ){
  return cmul(center+uv*scale,rotor(radians(angle)));
}
float mandelbrotExt(vec2 c,vec2 start,vec2 center, float scale, float angle) {
  return mandelbrotCore(project(c,center,scale,angle),start).z; 
}
float juliaExt(vec2 c,vec2 start,vec2 center, float scale, float angle) {
  return mandelbrotCore(start,project(c,center,scale,angle)).z;
}
vec3 mandelbrotRender(vec2 c){
  return mandelbrotCore(cmul(c,rotor(location.w)) * location.z + location.xy, vec2(0.));
}
vec3 mandelbrotRenderJulia( vec2 c,vec4 loc){
  return mandelbrotCore(loc.xy, cmul(c,rotor(loc.w)) * loc.z + loc.xy);
}

vec2 man_seedEyes=vec2(0);
vec2 man_seedBody=vec2(0);
vec2 man_seedMouth=vec2(0);
vec2 man_headPos=vec2(0);
float man_scale=1;
float manFace=1;
float manEyesOpen=0; // eyes open 0 = outside closed 
float manEyesSymmetry=.9; // eyes open 0 = outside closed 
float mandelMan(vec2 uvIn)
{
  

  MAX_ITER=250;
  float fragColor=0;
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = cmul(uvIn,rotor(radians(90)))*man_scale;
  vec2 center=vec2( .5,-0  );
  float scale=2.;
  vec2 eyePos=center+vec2(  3.150, 2.40);
  // Mandelbrot 
  fragColor = mandelbrotExt(uv ,man_seedBody*  .25,center+vec2(-1.3,0),scale* .4 ,180)* .75;  
 
  uv+=man_headPos;
  fragColor += mandelbrotExt(uv,vec2(0),center,scale*1 ,180)
            -  juliaExt(uv,man_seedEyes-vec2(manEyesOpen*manEyesSymmetry,0) ,               center+eyePos,scale*8.,-90)*manFace
            -  juliaExt(vec2(uv.x, -uv.y),man_seedEyes-vec2(manEyesOpen,0)  ,center+eyePos,scale*8.,-90)*manFace
            /// den mund, da wollen wir die schwarzen bereiche mit zaehnen also vertikalen streifen rendern
            -  juliaExt(uv,man_seedMouth,center+vec2(   -5.,.0),scale*8.*manFace,90);
  return fragColor;
}
//////////////////////////
float smoothStepCounter(float t, float stepDuration, float rampFrac)
{
    // t: Zeit (z. B. iTime)
    // stepDuration: Zeit pro Ganzzahl (z. B. 1.0 Sekunde pro Schritt)
    // rampFrac: Anteil der Zeit, der für den Übergang benutzt wird (z. B. 0.1 = 10%)

    float totalSteps = t / stepDuration;   // float step counter
    float base = floor(totalSteps);        // aktueller Ganzzahlwert
    float phase = fract(totalSteps);       // 0..1 innerhalb des Schritts
    float ramp;

    if (phase < rampFrac) {
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
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( PI2*(c*t+d) );
}


vec3 makePal2(float i){
return vec3(.2549,    .8824,.4118 )*i;
}
float pal_1_speed=0;
vec3 makePal1(float i){
  // return pal(i, vec3(0.3,0.2,0.5),vec3(0.6,0.2,0.8),vec3(2.0,1.0,0.0),vec3(0.5,2.20,0.25) );
 return pal(i,
    hsv(.7,.7,.8),  // Grundton: warm-golden
    vec3(.25, .35, .45),   // Amplitude: Gold -> Orange -> Rot
    vec3(1, 2,  3), // Hohe Frequenz: pulsierende Energie
    vec3(t*2*pal_1_speed, t/4*pal_1_speed, t*8*pal_1_speed)   // Phase für „rollende“ Farbwellen
);
}

float juliastep=0;

vec2 brotVisibilities=vec2(1,0);
 // minibrote trifox
vec4 scene2Mandelbroetchen(vec2 fragCoord )
{
  MAX_ITER=250;
  int index=int(t)%SIXTEEN;
  float interval = fract(t);
//  float vis=beatTrack_1[index]; 
  vec2 v = fragCoord; // to -1 +1 real,imag
  // arg allgemeiner winkel, normalisiert dann auf 0..1 also der winkel 0..360

//    int indexAchtel=int(floor(mod(t,32.)));
//    vec4 keyframe=getKeyFrame(t);

  vec3 l = mandelbrotRender(v);
  vec3 ljulia = mandelbrotRenderJulia(v,
    vec4(location.xy,
         location.z*(juliastep>0.?smoothStepCounter(4.-mod(t*1.,4.), 1.,.2):1.),
         location.w+easeInOutTap(fract(t/8.))*(PI/2.)));

  vec4 result = brotVisibilities.x*vec4(makePal1(l.z),1.)
              + brotVisibilities.y*vec4(makePal1(ljulia.z),1.) ;

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

  return  result; 
}
float cubicIn(float t) {
  return t * t  ;
} 
float cubicInOut(float t) {
  return t < .5
    ? 4.0 * t * t * t
    : .5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}
float backIn(float t) {
  return pow(t, 3.0) - t * sin(t * PI);
}
float flashBang(float time, float[16] arr){
  return easeInOutTap(fract(time)) * arr[ int(time)%16];
}  

float flashBang4(float time, float[4] arr){
  return easeInOutTap(fract(time)) * arr[ int(time)%4];
}  
float flashBang8(float time, float[8] arr){
  return easeInOutTap(fract(time)) * arr[ int(time)%8];
}  

///////////////////
////////////// for the sake of code, we have to redo this globall method using
// an init function for setting the iteration? wtf!
 
vec2 lissajous(float lissa, float shift, float t) {
  return vec2(cos(t - shift*lissa), sin(t - shift));
}
 
float sqr(float x) {
  return x*x;
}


vec2 cardioid(float a, float radius) {
  vec2 r = rotor(a)*radius;
  return vec2(1.-(sqr(r.x-1.)-sqr(r.y)),
              -2.*(r.x-1.)*r.y
             )/4.;
}
float       
      cam_a = .5,
      cam_d = 1.,
        
      nbobs = 100,
  
      lissa = 1., // 1.0 is a circle
      amplitude =  .0, // of lissjous animation
      arclen =  .1, // 1.0 is full circle
      lspeed = 1./16., // of lissajous anmation
        
      speed =  .125, // at which julia parameters are animated
      roughness = .5, // of julia pertubation
      cangle = 10, // angle pertubation changes from head to tail
      
      column_height = 1.,
      column_shift = -.1 ;
        
      // julia view ;
      //angle = 0.;
        
vec2 center = vec2(0),
     r,
     c, p,
     cr, pertubation, uv;

vec3 col,
     ray,
     offset,
     cam_pos;
      
float seedStrengsth=0; // lisajou julia strength
vec3 camera(float a, float d, vec3 v) {
  v.yz = cmul(v.yz, rotor(a));
  //v.xy *= (-1.-d)/(v.z-1.-d);
  v.xy *= (d-1.)/(v.z+1.+d);
  return v;
}
float osc(float lo, float hi, float x) {
  return (sin(t-x*2.*PI)/2.+.5)*(hi-lo) + lo;
}
vec3 scene0_NEU(vec2 xy) {   
  
         
  //radius = loc.z;
  vec2 center = location.xy,
       r = location.z*8 * rotor(location.w),
       c, p;

  vec3 col = vec3(0),
       offset;

  for(float i = 0; i < nbobs; ++i) { 
    
    offset = vec3(0 , -0,
                  -column_height * (i/nbobs) + column_shift);
                  
    vec2 cr = rotor(cam_a);
    vec3 cam_pos = vec3(0, 0, cam_d); // cot(a)?
    cam_pos.yz = cmul(cr, cam_pos.yz);
    vec3 ray = vec3(xy, 1.);
    ray.yz = cmul(cr, ray.yz);
    ray = ray * (cam_pos.z - offset.z)/ray.z - cam_pos;
    vec2 uv = cmul(ray.xy, r) + offset.xy;
    float z = 1.-length(ray);

    uv = cmul(uv, r)+ center;

     
    c =center+ seedStrengsth*location.z*cardioid(+t/16.-i/nbobs/4., osc(.995, 1.009, 1.-i/nbobs));
//    c = cardioid(t/8.-i/n/4., osc(1.05, 0.99, i/n));
//    c = mix(vec2(.25, 0.), vec2(.26, 0.), i/n*sin(t));
    if(f(c,  uv)) {
      // inside
      if(i==0){
     return vec3(0);

      }else{
     return makePal1(1);
      }
      //return vec3(1.-i/n);
    }
    else{

   
//      col += vec3(pow(f_k/f_n, .0125));
//      col += 1.-i/n*spectrum(f_k/f_n);
//      return vec3(f_k/f_n)-col/i/2.;
     col+= makePal1(f_k/MAX_ITER )/length(ray)  ;
//      return 1.-vec3(pow(f_k/f_n,1.));
    // outside
    //col += hsv(0.6, 0.5, pow(f_k/f_n, 1.)); }
  }
  }
//  return vec3(0.);
  return col/nbobs;// vec3(0.,0.,.15);
}

float vignetteScale=116.,vignettePow=.25;
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
float bang2=0;
float cos1(float x) {
  return -cos(x*PI2)/2+.5;
}
float pulses(float w, float t) {
  return sin(t/w*PI2)>0 ? 1 : 0;
}

// 4 44tel slide
const float ding1[8]=float[8](
  // achtung wird als 8tel takt genutzt!
    1,0,1,0,   0,0,0,0
    ); 
float flash44Kick;
float flash44Hihat;
vec2 manPos=vec2(-1.80,.5);
//vec2 manPos=vec2(-1.80,.5);

vec4 result=vec4(0);  
// die sichtbarkeiten der layer, hier haben wir 3 layer daher vec, sind alpha blends quasi
vec3 layerVisibilities=vec3(0,0,1);

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


float sin3(float x){
  return (sin(x*1)+sin(x*2)+sin(x*3))/3;
}
float sin2(float x){
  return (sin(x*1)+sin(x*2) )/2;
}
float easeOutQuad(float t) {
    return 1.0f - (1.0f - t) * (1.0f - t);
}
float easeInOutQuad(float t) {
    return t < .5f
        ? 2.0f * t * t
        : 1.0f - pow(-2.0f * t + 2.0f, 2.0f) / 2.0f;
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
  flash44Hihat=easeInOutTap(fract(t));

  bang2 = easeInOutTap(fract(t/4.))
        + easeInOutTap(fract((t+2)/4));

  // eye seed
  man_seedEyes=   vec2(-.35,0);  

  // mouth seed
  //man_seedMouth= vec2(sin(t*PI*.5),cos(t*PI))*.3;  
  man_seedMouth= vec2(-1,0);  
  // head pos
  man_headPos=  vec2(-.1,0);

  blink = pulses(1, t) * pulses(4/2, t); 
  roughness = sin(t)*.2+1.1;
float beat1=t; // ganze note
float beat2=t*2; // halbe noten
float beat3=beat2*2; // viertel noten


if(beat1>=0){
  // comming mode
  manPos=vec2(mix(3.6,0,smoothstep(0,1,beat1/4)),.5);
} 
if(beat1<8&& beat1>4){
  //gucki mode
  man_seedEyes+=cardioid(smoothstep(0,3,beat1-4)*PI2,1);
}
if(beat1>8&&beat1<12){
  // dancie mode
  man_seedBody+=cardioid(sin(beat2)*PI,1.5);
}
if(beat1>12 ){
  // zwinker mode
  manPos+=vec2(smoothstep(0,1,beat1-12)*4.5,4.5);
}
if(beat1>12&&beat1<16){
  // zwinker mode 
  man_seedEyes+=cardioid(sin(beat2)*PI,1.5);
}
// beat 12/14 or something then will become the beam into the eye

if(beat1>15){
  // zoomie
  man_scale=expInterp(1,.01,fract((beat1-15)/4  ));
}

if(beat1>24){
  layerVisibilities.x=1;
}

  return  max(
    layerVisibilities.x*vec4(scene0_NEU(fragCoord),1),
    layerVisibilities.y*scene2Mandelbroetchen(fragCoord));
}

//EOE/////////////////////////////////////////////////////////////////////////////////////////////////////// 
//
// This is c++ call wrap header, ommit this when editing it in the editor
//
// Reasoning:
// out declarations toplevel are not really useful, in c++ world it is the declared output of the shader
// in glsl this is handled similarly but using that gl_FragColor instead, having the mainWrap() method to be used in html editor
float vignette(vec2 uv){
   
    return pow(uv.x*uv.y * 15, .25); // change pow for modifying the extend of the  vignette

} 



float vignetteRect(vec2 uv )
{
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
   t = (float(m) / 44100)/(60/bpm);
 
// debug offset
//t-=0.5;
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  
  vec4 rz = mainWrap(uv*2-1);
  vec4 mandelTriklops=vec4(layerVisibilities.z*makePal2(mandelMan((uv*2-1)*man_Size+manPos)),1);   
 
// o=rz;
  o=(rz/1)*vignetteRect(uv);
  o=max(o,mandelTriklops);

uv = gl_FragCoord.xy / iResolution.xy;


    vec2 uvOri=uv;


// text stuff
     uv.y=1.-uv.y;
    uv.x*=2.;
    uv.x+=t*.1;
    uv*=12.;
    
if(
    fract(uv.x)<.5 && 
    fract(uv.y)<.5 &&  
    uvOri.y<.5&&uvOri.y>.42)
    {
o+=vec4(characterVertical(fract(uv*(1./.5)),uint(text[int(uv.x)%TEXT_LEN])) );
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
