#version 130

uniform int m; // Time in sample player
const vec2 iResolution= vec2(1920.,1080.);
out vec4 o;

////////////////////////////////////////////////////////////////
const float PI = radians(180.);
const float PI2= PI*2.;
const float HALF_PI=PI/2.;
const float BAILOUT=256.;
const int SIXTEEN=16;

float MAX_ITER = 70.; 
const float bpm = 154.0;
const float one=1.;
const float zero=0.;

float t;
const float beatTrack_1[SIXTEEN]=float[SIXTEEN](
    
    1.,0.,1.,1.,
    1.,0.,1.,1.0, 
    1.,0.,1.,1.,
    1.,0.,1.,1.
    );
const float beatTrack_2[SIXTEEN]=float[SIXTEEN](
  // classic paradiddle
    0.,1.,0.,0.,
    1.,0.,1.,1., 
    0.,1.,0.,0.,
    1.,0.,1.,1.
    ); 

const float beatTrack_4Achtel[8]=float[8](
  // achtung wird als 8tel takt genutzt!
    0.,0.,0.,1.,   0.,1.,1.,1.
    ); 

// cowbell
const float beatTrack_3[16]=float[16](
    0.,0.,0.,0.,
    0.,0.,0.,0., 
    0.,0.,0.,0.,
    0.,0.,0.,0.
    ); 


const int NLOCATIONS=7;
// vec4 real,imag,scale for locations  
const vec4 locations[] = vec4[NLOCATIONS](  
vec4(0.3604,0.61491,0.0116,2.47),
vec4(-1.87,0.,0.0002675,0.),
vec4(-0.52597,0.696944,0.001252,-1.41),
vec4(-0.528326,0.704073,0.0001073,-2.04),
vec4(-0.724136,0.361574,0.000676,-0.35),
vec4(-0.69094,0.46535,0.00832,2.72),
vec4(-0.7113,0.473618,6.14e-05,-3.08)
);
vec4 location = locations[4];

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
  
float easeInOutTap(float t) {
    return smoothstep(0.0, 0.01, t) * (1.0 - smoothstep(0.01, 0.25, t));
} 
vec2 cmul(vec2 a, vec2 b) { 
  return vec2(a.x*b.x-a.y*b.y,  a.x*b.y+a.y*b.x);
}
float arg(vec2 z) {
  return atan(z.y, z.x);
}
vec2 rotor(float a) {
  return vec2(cos(a), sin(a));
}

vec3 hsv(float h, float s, float v) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(vec3(h,h,h) + K.xyz) * 6.0 - K.www);
  return v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);
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
  return vec3(f_z.xy,  f_k/MAX_ITER*4. );
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

vec2 man_seedEyes=vec2(0.);
vec2 man_seedMouth;
vec2 man_headPos;

float mandelMan(vec2 uvIn)
{
  MAX_ITER=250.;
  float fragColor=0.;
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = cmul(uvIn,rotor(radians(90.)));
  vec2 center=vec2( 0.5,-0.  );
  float scale=2.;
  vec2 eyePos=center+vec2(  3.150, 2.40);
  // Mandelbrot 
  fragColor = mandelbrotExt(uv,man_seedEyes* .25,center+vec2(-1.3,0),scale* .4 ,180.)* .75; 
  uv+=man_headPos;
  fragColor += mandelbrotExt(uv,vec2(0.),center,scale*1. ,180.)
            -  juliaExt(uv,man_seedEyes ,               center+eyePos,scale*8.,-90.)
            -  juliaExt(vec2(uv.x, -uv.y),man_seedEyes ,center+eyePos,scale*8.,-90.)
            /// den mund, da wollen wir die schwarzen bereiche mit zaehnen also vertikalen streifen rendern
            -  juliaExt(uv,man_seedMouth,center+vec2(   -5.,.0),scale*8.,90.);
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

    if (phase < rampFrac) {
        // Im Ramp-Bereich → sanft hochziehen
        float ramp = smoothstep(0.0, rampFrac, phase);
        return base + ramp;
    } else {
        // Plateau → konstanter Wert
        return base + 1.0;
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
return vec3(0.2549,    .8824,0.4118 )*i;
}
float pal_1_speed=0.;
vec3 makePal1(float i){
  // return pal(i, vec3(0.3,0.2,0.5),vec3(0.6,0.2,0.8),vec3(2.0,1.0,0.0),vec3(0.5,2.20,0.25) );
 return pal(i,
    hsv(t,0.6,.8),  // Grundton: warm-golden
    vec3(.25, 0.35, 0.45),   // Amplitude: Gold -> Orange -> Rot
    vec3(1.0, 2.0,  1.0), // Hohe Frequenz: pulsierende Energie
    vec3(t*2.*pal_1_speed, t/4.*pal_1_speed, t*8.*pal_1_speed)   // Phase für „rollende“ Farbwellen
);
}

float juliastep=0.;

vec2 brotVisibilities=vec2(one,zero);
 // minibrote trifox
vec4 scene2Mandelbroetchen(vec2 fragCoord )
{
  MAX_ITER=250.;
  float interval = fract(t); 
  vec2 v = fragCoord; // to -1 +1 real,imag
  // arg allgemeiner winkel, normalisiert dann auf 0..1 also der winkel 0..360
  float arg=(atan( v.x,v.y)+PI)/PI2;

  int index=int(t)%SIXTEEN;
//    int indexAchtel=int(floor(mod(t,32.)));
//    vec4 keyframe=getKeyFrame(t);

  vec3 l = mandelbrotRender(v);

  float vis=beatTrack_1[index]; 
  vec3 ljulia = mandelbrotRenderJulia(v,
    vec4(location.xy,
         location.z*(juliastep>0.?smoothStepCounter(4.-mod(t*1.,4.), 1.,0.2):1.),
         location.w+easeInOutTap(fract(t/8.))*(PI/2.)));

  vec4 result = brotVisibilities.x*vis*vec4(makePal1(l.z),1.)
              + brotVisibilities.y*(1.0-vis) *vec4(makePal1(ljulia.z),1.) ;

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
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}
float backIn(float t) {
  return pow(t, 3.0) - t * sin(t * PI);
}
float flashBang(float time, float[16] arr){
  return easeInOutTap(fract(time)) * arr[ int(time)%16];
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

float       
      cam_a = 0.,
      cam_d = 1.,
        
      nbobs = 100.,
  
      lissa = 1., // 1.0 is a circle
      amplitude = .0, // of lissjous animation
      arclen = 1., // 1.0 is full circle
      lspeed = 1./16., // of lissajous anmation
        
      speed = .125, // at which julia parameters are animated
      roughness = 1.5, // of julia pertubation
      cangle = 0., // angle pertubation changes from head to tail
      
      column_height = 1.,
      column_shift = -.1,
        
      // julia view
      scale = 1.,
      angle = 0.;
        
vec2 center = vec2(0.),
     r,
     c, p ;

vec3 col,
     ray,
     offset;
     
vec3 xxxNew_scene0(vec2 xy, float t) {
  r = location.z/scale * rotor(angle);
  col = vec3(0.);
  
  vec2 cr = rotor(-cam_a),
       pertubation, uv;
  vec3 cam_pos = vec3(0., 0., cam_d);
  cam_pos.yz = cmul(cr, cam_pos.yz);
  
  for(float i = 0.; i < nbobs; ++i) {
    pertubation = .07*roughness*rotor((t*speed + i/nbobs*cangle)*PI2)*location.z/scale;
    center = c = location.xy+pertubation;
  
    offset = vec3(amplitude * lissajous(lissa, PI2 * i/nbobs * arclen, t*lspeed*PI2),
                  -column_height * (i/nbobs) + column_shift);

    ray = vec3(xy, 1.);
    ray.yz = cmul(cr, ray.yz);
    ray = ray * (cam_pos.z - offset.z)/ray.z - cam_pos;
    
    uv = cmul(ray.xy - offset.xy, r) - center + pertubation;
    float z = 1.-length(ray);

    if(f(c, uv))
      // inside
      if(i == 0.)
        return makePal1(0.);
      else
        return hsv(0., 0., (1.-i/nbobs)*z*1.)+col/nbobs;
        
    // outside
    col += hsv(.6, .5, pow(f_k/MAX_ITER, 2.));
  }
  return col/nbobs;
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
 float bang2=0.;
float cos1(float x) {
  return -cos(x*PI2)/2.+.5;
}
float pulses(float w, float t) {
  return sin(t/w*PI2)>0. ? 1. : 0.;
}

// 4 44tel slide
const float ding1[8]=float[8](
  // achtung wird als 8tel takt genutzt!
    1.,0.,1.,0.,   0.,0.,0.,0.
    ); 
float flash44MainKick;
float flash44Hihat;
vec2 manPos=vec2(1.4,0.5);

vec4 result=vec4(0.);  
// die sichtbarkeiten der layer, hier haben wir 3 layer daher vec, sind alpha blends quasi
vec3 layerVisibilities=vec3(0.);

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
        + easeInOutTap(fract((t+2.)/4.));

  // eye seed
  man_seedEyes=   vec2(-0.35,0.);  

  // mouth seed
  man_seedMouth= vec2(sin(t*PI*0.5),cos(t*PI))*0.3;  
  // head pos
  man_headPos=  vec2(0.,0.);

  blink = pulses(1./1., t) * pulses(4./2., t);
  roughness = sin(t)*.2+1.1;

  // sec 1
  // short intro
  if(t < 4.*1.) {
    vignetteScale=150.*t/4.;
    MAX_ITER *= t/4.;
    blink = 0.;
  }
<<<<<<< HEAD
  float t0;
  if(t < 4.*4.) // sec1 first half
 // naja, ok, was geht hier hab, 4mal4 sind 16 also nen voller 44tel  takt aktion
    speed = 0.;
  else if(t < 4.*8.) // sec1 second half
  // wegen kleiner gleich haben hier wir irgendwas was nur auf dewn ersten beiden takten aktiv ist
    speed = -1./2.;
  else if(t < 4.*17.) // sec2
  {
    // hier haben wir gedoens was genau am 17ten takt tri tra triggert, also wegen dem <
  man_seedEyes=vec2(-0.2,0.65);
  blink = pulses(8., t) * pulses(12., t);
    
  MAX_ITER=250.;
  brotVisibilities=vec2(0.,1.);
    amplitude = zero;
  }
  else if(t < 4.*24.) // sec3
 {   
juliastep=1.;
  brotVisibilities=vec2(1.,1.);
  // achtung hier clampt die kamera doof, noch anpassen
    cam_a = sin(t*PI2/16.)*PI2/8.;
}
  else if(t < 4.*32.) // Letzter Takt
{
  // ok, andernfalls halt 32ter takt hier halt gedoenst, ews ist ungefaehr die mitte, max ist 65
  pal_1_speed=1.;
      cam_a = PI2/8.;
}else if(t<4.*48.){
  // else nochmal die gute if, hier end eskalation weil hoich
location.w=radians(smoothStepCounter(t*2.,0.5,0.2));
}

if(t<4*35) 
// hier halt wechsel position mandelman
 manPos=vec2(1.4,0.5);
// am ende lachendes maenneken mit shaky head
 layerVisibilities.z=t>4.*16.?clamp(smoothstep(0.,4.*8.,t)*sin(t/2.)*4.,0.,1.):0.;


 layerVisibilities.x=1.;
 layerVisibilities.y=blink;

// layerVisibilities.z=clamp(sin(t),0.,1.);
  //return cmix(scene0(xy+sway, t), scene1(xy, t), blink);
  // achtung; ihier faengt >= bereich an, also sachen die ab dann leben
if(t>4.*24.){ 
  man_seedEyes=vec2(-0.5,0.5);
  location=locations[int(t)%16];
  brotVisibilities=vec2(one,one);
}
if(t>4.*65.)
{ 
  manPos=vec2(zero,0.5);
  layerVisibilities=vec3(0,0,1);
  man_headPos=vec2(sin(t*PI*2.)*0.1, zero);
  man_seedMouth= vec2(-0.7,0.);  
  man_seedEyes=  vec2(sin(t*2.)*0.25-0.65,0.4);  
}
 
}

vec4 mainWrap(vec2 fragCoord){
 


/// achtung hier die methode direkt zu returnen
// unten werden aber alle 4 auch aufgerufen, man sollte also 
// hier die params fuer unten festlegen

 
    
//    column_height=(sin(t*30.)/2.+.5)*1.;
// ... grundgeruest, nach intro faengt spring und locationwechsel an

  animate();
=======
>>>>>>> 0536b862a26eff2e7ccaf0e14b7e1ebe680b12c7
  
  // sec1 second half
//  if(t > 4.*4.)
  
  // sec2
  if(t > 4.*8.) {
    cangle = smoothstep(0., 1., (t-4.*8.)/8.);
    if(t < 4.*17.) {
      // hier haben wir gedoens was genau am 17ten takt tri tra triggert, also wegen dem <
      man_seedEyes=vec2(-0.2,0.65);
      blink = pulses(4./1., t) * pulses(4./2., t) * pulses(4./8., t);
      brotVisibilities=vec2(0.,1.);
      speed = smoothstep(0., 1., (t-4.*8.)/4.)/8.;
    }
  }
  
  // am ende lachendes maenneken mit shaky head
  layerVisibilities = vec3(1., blink,
    t>4.*16.?clamp(smoothstep(0.,4.*8.,t)*sin(t/2.)*4.,0.,1.):0.);
// layerVisibilities.z=clamp(sin(t),0.,1.);
  //return cmix(scene0(xy, t), scene1(xy, t), blink);
    
  if(t > 4.*17.) {
    amplitude = .5;
  }

  if(t>4.*24.){ 
    cam_a = smoothstep(0., 1., (t-4.*24.)/8.)*PI/4.;
    man_seedEyes=vec2(-0.5,0.5);
    location=locations[int(t)%NLOCATIONS];
  }
  
  if(t>4.*32.) {
    nbobs = 10.;
    pal_1_speed=1.;
    // hier halt wechsel position mandelman
    manPos=vec2(-1.4,0.5);
  }

  if(t>4.*40.) {
    juliastep=1.;
    brotVisibilities=vec2(1.,1.);
    amplitude = smoothstep(0., 1., (t-4.*48.)/16.);
  }
  if(t>4.*48.) {
    location.w=radians(smoothStepCounter(t*2.,0.5,0.2));
  }
  if(t>4.*56.)
  
  if(t>4.*65.)
  {
    manPos=vec2(zero,0.5);
    layerVisibilities=vec3(0,0,1);
    man_headPos=vec2(sin(t*PI2)*0.1, zero);
    man_seedMouth= vec2(-0.7,0.);  
    man_seedEyes=  vec2(sin(t)*0.25-0.75,0.4);  
  }

//        vec4 scene_1= scene2Mandelbroetchen(fragCoord,t) ;
//     return scene_1;

/* develop */

//  layerVisibilities.y=1;
//brotVisibilities=vec2(1.,1.); 

  return  max(
    layerVisibilities.x*vec4(xxxNew_scene0(fragCoord,t),1.),
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
   
    return pow(uv.x*uv.y * 15.0, 0.25); // change pow for modifying the extend of the  vignette

}
void main() {
  // t is timed to beat
  t = float(m) / 44100.0 / 60. * bpm;


// debug offset
//t-=0.5;
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 uv2 = uv*( 1.0 - uv.yx);   //vec2(1.0)- uv.yx; -> 1.-u.yx; Thanks FabriceNeyret !
    float vig = uv2.x*uv2.y * vignetteScale; // multiply with sth for intensity
    vig = pow(vig,vignettePow); // change pow for modifying the extend of the  vignette

  vec4 rz = mainWrap(uv*2.0-1.0);
vec4 mandelTriklops=vec4(layerVisibilities.z*makePal2(mandelMan((uv*2.0-1.0)*2.5+manPos)),1.);   

  o=rz*vig;
  o=max(o,mandelTriklops);
 

 
/*
if(uv.y>0.2 && uv.x<t/256 ) {
  o=vec4(0,1.,0.,1.);
}
*/
  return;

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
