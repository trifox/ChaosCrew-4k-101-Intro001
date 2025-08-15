#version 130

uniform int m; // Time in sample player

const float PI = radians(180.);
const float PI2= PI*2.;
const float HALF_PI=PI/2.;
const vec2 iResolution= vec2(1920.,1080.);
const float BAILOUT=256;
const int SIXTEEN=16;

float MAX_ITER = 150.; 
const float bpm = 154.0;
const float secsPerBeat = 60.0 / bpm;
const float one=1.;
const float zero=0.;
// complex one
const vec2 cone = vec2(one,zero);

float t;
const float beatTrack_1[SIXTEEN]=float[SIXTEEN](
    
    1.,0.,0.5,1.,
    0.,1.,0.,0.5, 
    .1,0.,1.,0.,
    0.,0.,0.,1.
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


const int ANZ_LOCATIONS=7;
// vec4 real,imag,scale for locations  
const vec4 locations[ANZ_LOCATIONS] = vec4[ANZ_LOCATIONS](  
 vec4(0.360402,0.614907,0.0116,2.47),
vec4(-1.8700,0,0.0002674561862707285,0.),
vec4(-0.52597,0.6969436,0.001252159,-1.412),
vec4(-0.528326,0.7040732,0.0001073184,-2.0375),
vec4(-0.724136,0.3615743,0.000676235,-0.35356),
vec4(-0.690942,0.465349,0.00832064,2.71871975),
vec4(-0.7112999,0.47361824034266,0.0000614022,-3.0772)  

);
vec4 location= locations[int(0)%ANZ_LOCATIONS ];

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
    return smoothstep(0.0, 0.2, t) * (1.0 - smoothstep(0.2, 0.5, t));
} 
vec2 cmul(vec2 a, vec2 b) { 
  return vec2(a.x*b.x-a.y*b.y,  a.x*b.y+a.y*b.x);
}
vec3 mandelbrotCore(vec2 c, vec2 z0) {
  vec2 z = z0; 
  float i; 
  for(i = 0.; i < MAX_ITER; i++) {
    z = cmul(z, z) + c; 
    if(dot(z,z) > BAILOUT) break;
  }
  
//  float diff = log2(log2(dot(z,z))) -4.;

  return vec3(z.xy,i/MAX_ITER);

}  
vec2 rotor(float a) {
  return vec2(cos(a), sin(a));
}

// util rotate
vec2 rotate(vec2 p, float angle) {
    return cmul(p,rotor(angle));
}
  
vec2 project(vec2 uv,vec2 center, float scale, float angle ){
return rotate(center+uv*scale,radians(angle));
}
float mandelbrotExt(vec2 c,vec2 start,vec2 center, float scale, float angle) {
return mandelbrotCore(project(c,center,scale,angle),start).z; 
}
float juliaExt(vec2 c,vec2 start,vec2 center, float scale, float angle) {
return mandelbrotCore(start,project(c,center,scale,angle)).z;
}

float env(float t){
  return sin(t*PI);
}

vec2 man_seedEyes=vec2(0.);
vec2 man_seedMouth;
vec2 man_headPos;

float mandelMan(vec2 uvIn)
{
float fragColor=0.;
    // Normalized pixel coordinates (from 0 to 1)
vec2 uv = rotate(uvIn,radians(90.));
vec2 center=vec2( 0.5,-0.  );
float scale=2.;
// Mandelbrot 
fragColor= mandelbrotExt(uv,man_seedEyes* .25,center+vec2(-1.3,0),scale* .4 ,180.)* .75; 
uv+=man_headPos;
vec2 eyePos=center+vec2(  3.150, 2.40);
fragColor += mandelbrotExt(uv,vec2(0.),center,scale*1. ,180.);
fragColor -= juliaExt(uv,man_seedEyes ,              center+eyePos,scale*8.,-90.) ;
fragColor -= juliaExt(vec2(uv.x, -uv.y),man_seedEyes ,center+eyePos,scale*8.,-90.) ;

/// den mund, da wollen wir die schwarzen bereiche mit zaehnen also vertikalen streifen rendern
float mund= juliaExt(uv,man_seedMouth,center+vec2(   -5.,.0),scale*8.,90.) ;
fragColor-=mund;
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
    return a + b*cos( 6.28318*(c*t+d) );
}


vec3 makePal1(float i){
  // return pal(i, vec3(0.3,0.2,0.5),vec3(0.6,0.2,0.8),vec3(2.0,1.0,0.0),vec3(0.5,2.20,0.25) );
 return pal(i,
    vec3(0.5, 0.2, 0.1),  // Grundton: warm-golden
    vec3(.25, 0.35, 0.45),   // Amplitude: Gold -> Orange -> Rot
    vec3(3.0, 4.0,  .50), // Hohe Frequenz: pulsierende Energie
    vec3(t*2., t/4., t*8.)   // Phase für „rollende“ Farbwellen
);
}
 

// refurio cardioid abrollen 
float arg(vec2 z) {
  return atan(z.y, z.x);
} 
vec2 cdiv(vec2 a, vec2 b) {
  return vec2(dot(a,b), a.y*b.x-a.x*b.y)/dot(b,b);
}
vec2 cinv(vec2 b) {
  return vec2(b.x, b.y)/dot(b,b);
}
vec2 cexp(vec2 z) {
  float e = exp(z[0]);
  return vec2(e*cos(z[1]), e*sin(z[1]));
}
vec2 cln(vec2 z) {
  return vec2(log(sqrt(dot(z,z))), arg(z));
}
vec2 cpow(vec2 b, vec2 e) {
  return cexp(cmul(e,cln(b)));
}
vec2 csqrt(vec2 z) {
  return cpow(z, vec2(.5,0.));
}
 
vec4 icolor(int i) {
  float x = float(i);
  return vec4(sin(x*100.), sin(x*200.), sin(x*300.), 0.);
}  
// Refurio Julia Bobs
   
float sqr(float x) {
  return x*x;
}
  
   

// Exponentielle Interpolation zwischen a und b mit Parameter t in [0,1]
// t=0 -> a, t=1 -> b
// Exponentielle Interpolation für positive Werte a,b > 0
float expInterp(float a, float b, float t) {
    // t=0 => a, t=1 => b
    // Interpoliert so, dass die Werte sich *multiplikativ* ändern
    // (logarithmische lineare Interpolation)
    return exp(mix(log(a), log(b), t));
}

vec3 mandelbrotRender( vec2 c,vec4 loc){
     c = rotate(c,loc.w) * loc.z + loc.xy;
    return mandelbrotCore(c,vec2(0.));
}
vec3 mandelbrotRenderJulia( vec2 c,vec4 loc){
     c = rotate(c,loc.w) * loc.z + loc.xy;
    return mandelbrotCore(loc.xy,c);
}
 
float explerp(float v0, float v1, float t) {
    return exp(mix(log(v0), log(v1), t));
}


vec2 brotVisibilities=vec2(zero,one);
 // minibrote trifox
vec4 scene2Mandelbroetchen(vec2 fragCoord )
{
 
    float interval = fract(t); 
    vec2 v = fragCoord; // to -1 +1 real,imag
    // arg allgemeiner winkel, normalisiert dann auf 0..1 also der winkel 0..360
    float arg=(atan( v.x,v.y)+PI)/PI2;

    int index=int(t)%SIXTEEN;
//    int indexAchtel=int(floor(mod(t,32.)));
//    vec4 keyframe=getKeyFrame(t);

    vec3 l = mandelbrotRender(v,location  );

    vec3 ljulia = mandelbrotRenderJulia(v,
    vec4(location.xy,location.z*smoothStepCounter(4.-mod(t*1.,4.) ,1.,0.2),location.w+easeInOutTap(fract(t/8.))*(PI/2.)));

     vec4 result =brotVisibilities.x*beatTrack_1[index]*vec4(makePal1(l.z),1.);
          result+=brotVisibilities.y*beatTrack_2[index]*vec4(makePal1(ljulia.z),1.) ;

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
 



 
float f_k; 
vec2 f_z;
bool f(vec2 c, vec2 z0) {
  f_z = z0;
  for(f_k = 0.; f_k < MAX_ITER; ++f_k) {
    f_z = cmul(f_z, f_z) + c;
    if(dot(f_z,f_z) > 4.)
      return false;
  }
  return true;
}
vec2 lissajous(float lissa, float shift, float t) {
  return vec2(cos(t - shift*lissa), sin(t - shift));
}
 



vec3 hsv(float h, float s, float v) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(vec3(h,h,h) + K.xyz) * 6.0 - K.www);
  return v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);
}
vec3 cmix(vec3 a, vec3 b, float t) {
  return sqrt(mix(a*a, b*b, t));
}
  
float radiusRotor = 0.1; 
float       
      cam_a = 0.,
      cam_d = 1.,
        
      nbobs = 30.,
  
      lissa = 1., // 1.0 is a circle
      amplitude = .25, // of lissjous animation
      arclen = 1., // 1.0 is full circle
      lspeed = 1./4., // of lissajous anmation
        
      speed = 1./2., // at which julia parameters are animated
  
      roughness = 1.2, // of julia pertubation
      cangle = 1., // distance the parameter c travels from head to tail
        
      column_height = 1.,
      column_shift = -.1,
        
      // julia view
      radius = 2.,
      angle = 0.;
        
vec2 center = vec2(0.),
     r,
     c, p ;

vec3 col,
     ray,
     offset;
 vec3 xxxNew_scene0(vec2 xy, float t)  {
  radius = location.z;
  r = radius * rotor(angle);
  col = vec3(0.);
  
  vec2 cr = rotor(cam_a);
  vec3 cam_pos = vec3(0., 0., cam_d);
  cam_pos.yz = cmul(cr, cam_pos.yz);
  
  vec3 bg;

  for(float i = 0.; i < nbobs; ++i) {
    vec2 pertubation = .07*roughness*rotor(t*speed*PI2 + i/nbobs*cangle)*radius;
    center = c = location.xy+pertubation;
  
    offset = vec3(amplitude * lissajous(lissa, PI2 * i/nbobs * arclen, t*lspeed*2.*PI),
                  -column_height * (i/nbobs) + column_shift);

    ray = vec3(xy, 1.);
    ray.yz = cmul(cr, ray.yz);
    bg = cmix(hsv(.6, .7, .8), vec3(0.), clamp(0., 1., -ray.y));
    ray = ray * (cam_pos.z - offset.z)/ray.z - cam_pos;
    if(dot(cam_pos, ray) < 0.)
      continue;
    
    vec2 uv = cmul(ray.xy - offset.xy, r) - center + pertubation;
    float z = 1.-length(ray);

    if(f(c, uv))
      // inside
      if(i == 0.)
        return hsv(1., 1., 1.);
      else
        return hsv(0., 0., 1.-i/nbobs);
        
    // outside
    col += hsv(.6, .5, pow(f_k/MAX_ITER, .01));
  }
  return bg;
  //return vec3(0.);
  return col/nbobs;
}


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
 
float cos1(float x) {
  return -cos(x*PI2)/2.+.5;
}
float pulses(float w, float t) {
  //return sin(t/w*PI2)>0. ? 1. : 0.;
  return smoothstep(0., 1., cos1(t/w));
}
    vec4 result=vec4(0.);  
    // die sichtbarkeiten der layer, hier haben wir 3 layer daher vec, sind alpha blends quasi
vec3 layerVisibilities=vec3(0.);
vec2 sway;
void animate() {
  float blink;
  location=locations[6];
  cam_a = 0.; // -PI/4.;
  blink = pulses(4./1., t) * pulses(4./2., t);
//  blink = 0.;
//  blink = pulses(4./1., t) * pulses(4./2., t) * pulses(4./8., t);
  sway = vec2(cos(t*PI2/4./2.), sin(t*PI2/4./4.))*.025;
  if(t < 4.*1.)
    MAX_ITER = 80.*t/4.;
    MAX_ITER=50 ;
  float t0;
  if(t < 4.*1.) // intro
    blink = 0.;
  else if(t < 4.*4.) // sec1 first half
    speed = 0.;
  else if(t < 4.*8.) // sec1 second half
    speed = -1./2.;
  else if(t < 4.*16.+4.*1.) // sec2
  {
    
  MAX_ITER=250;
  brotVisibilities=vec2(1.,0.);
    amplitude = 0.;
  }
  else if(t < 4.*24.) // sec3
 {   
  location= locations[int(t)%ANZ_LOCATIONS ];

  brotVisibilities=vec2(1.,1.);
  // achtung hier clampt die kamera doof, noch anpassen
    cam_a = sin(t*PI2/16.)*PI2/8.;
}
  else if(t < 4.*32.) // Letzter Takt
{
      cam_a = PI2/8.;
}
// bob anzahl lassen wir einfach ansteigen
 nbobs =(sin(t/4)+1)*200+10;
  // eye seed
  man_seedEyes=  vec2(sin(t*PI)     ,0)*0.01-vec2(0.35,0.);  
  // mouth seed
  man_seedMouth= vec2(sin(t*PI*1.25),sin(t*PI*0.5))*0.3;  
  // head pos
  man_headPos=  vec2(0.,0.);

// am ende lachendes maenneken mit shaky head
 layerVisibilities.z=clamp(smoothstep(0,4*8,t)*sin(t),0.,1.);

 layerVisibilities.x=blink;
 layerVisibilities.y=1.-blink;

// layerVisibilities.z=clamp(sin(t),0.,1.);
  //return cmix(scene0(xy+sway, t), scene1(xy, t), blink);

if(t>4*65)
{
  layerVisibilities=vec3(0,0,1);
  man_headPos=vec2(sin(t*PI*2.)*0.1, 0.);
  man_seedMouth= vec2(-0.7,0.);  
  man_seedEyes=  vec2(sin(t)*0.25-0.75,0.4);  
}

}

vec4 mainWrap(vec2 fragCoord,float t){
 


/// achtung hier die methode direkt zu returnen
// unten werden aber alle 4 auch aufgerufen, man sollte also 
// hier die params fuer unten festlegen

 
    
//    column_height=(sin(t*30.)/2.+.5)*1.;
// ... grundgeruest, nach intro faengt spring und locationwechsel an

  animate();
  
//        vec4 scene_1= scene2Mandelbroetchen(fragCoord,t) ;
//     return scene_1;

/* develop */

  
vec4 mandelTriklops=vec4(layerVisibilities.z*mandelMan(fragCoord*2.5+vec2(1.5,0.5)));   



vec4 dieMiniBrote=layerVisibilities.y*scene2Mandelbroetchen(fragCoord);


vec4 bobs=layerVisibilities.x*vec4(xxxNew_scene0(fragCoord+sway,t),1.);




   return  max(bobs,max(dieMiniBrote,mandelTriklops));
   


/**
Demoi teil von robert


    if(t < 4.*16.) {
      const float ref1[8]=float[8](
        1.,1.,1.,0.,   0.,0.,0.,0.
      );
      if(t >= 4.*1. && mod(t,2.)<1.)
      return vec4(1.0,0.0,0.,1.0);

        if(false)
        return mix(scene2Mandelbroetchen(fragCoord,t/.2),
                   vec4(xxxNew_scene0(fragCoord, t/4.), 1.),
                   easeInOutTap(t)*flashBang8(t*2.,ref1));
        else
        return vec4(easeInOutTap(t)*flashBang8(t*2.,ref1)));

      return vec4(xxxNew_scene0(fragCoord, t/4.), 1.);
    }


*/



return result;
}

//EOE/////////////////////////////////////////////////////////////////////////////////////////////////////// 
//
// This is c++ call wrap header, ommit this when editing it in the editor
//
// Reasoning:
// out declarations toplevel are not really useful, in c++ world it is the declared output of the shader
// in glsl this is handled similarly but using that gl_FragColor instead, having the mainWrap() method to be used in html editor


out vec4 o;
void main()
{

  // t is timed to beat
  t = (float(m) / 44100.0)/secsPerBeat;


// debug offset
//t-=0.5;
  vec4 rz = mainWrap((gl_FragCoord.xy/iResolution)*2.0-1.0,t);
  o=rz;
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

