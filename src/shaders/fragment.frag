#version 130

uniform int m; // Time in sample player

const float PI = 3.1416;
const float PI2= PI*2.;
const vec2 iResolution= vec2(1920.,1080.);

 

const int MAX_ITER = 100; 
const float bpm = 154.0;
const float secsPerBeat = 60.0 / bpm;
const float beatTrack_1[16]=float[16](
    
    1.,0.,0.,0.,
    1.,0.,0.,0., 
    1.,0.,0.,0.,
    1.,0.,0.,0.
    ); 
const float beatTrack_2[16]=float[16](
    0.,1.,0.,0.,
    0.,1.,0.,0., 
    0.,1.,0.,0.,
    0.,1.,0.,0.
    ); 

// cowbell
const float beatTrack_3[16]=float[16](
    0.,0.,0.,0.,
    0.,0.,0.,0., 
    0.,0.,0.,0.,
    0.,0.,0.,0.
    ); 

// achtelnoten
const float beatTrack_4_8chtel[32]=float[32](

    1.,0.,0.,0.,0.0,0.,0.,0.,
    0.,0.,0.,0.,0.0,0.,0.,0.,
    0.,0.,0.,0.,0.0,0.,0.,0.,
    0.,0.,0.,0.,0.0,0.,0.,0. 

    ); 


// vec4 real,imag,scale for locations  
const vec4 locations[17] = vec4[17](
vec4(-1.7683588440488,0.05142235910284,0.00005355907904092338,0.27563548147126493),
vec4(-1.766495147994,0.0417267061464,0.00044402239147676086,0.1517894639121909),
vec4(-1.769261670277,0.0569195003956,0.0002995182771678725,0.23423347691063795),
vec4(-1.90728009107,0,0.0011754560896387338,3.141592653589793),
vec4(-1.8607825222,0,0.007767650197946792,3.141592653589793),
vec4(-1.94079980653,0,0.00983928985307716,3.141592653589793),
vec4(-1.754877666,0,0.18201981627989672,3.141592653589793),
vec4(0.38798963546146,0.61197516811835,0.00004396647496816971,-2.380696251364367),
vec4(0.3890111704987,0.6084278463908,0.0005274726330800535,2.686827005755999),
vec4(0.381237793363,0.599378097942,0.004300393224212388,0.21065064233145478),
vec4(0.36040230539,0.61490698108,0.011646798131609109,2.4731928462200328),
vec4(0.377149286568,0.666878777916,0.0010316522371209885,-1.5133807978646205),
vec4(0.376893240379,0.67856869319,0.0012574438753357167,0.6599920743443956),
vec4(0.359892739013,0.684762020212,0.005553083570499503,3.1212786038479035),
vec4(0.35925922476,0.64251373714,0.04714342394528389,2.0447869433636376),
vec4(-0.15652016683,1.0322471089,0.08188697027694743,2.4777729354236357),
vec4(-1.754877666,0,0.18201981627989672,3.141592653589793) 
);



vec2 rotate(vec2 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(
        c * p.x - s * p.y,
        s * p.x + c * p.y
    );
}
 
// Amplitude
//  1.0 ──┐
//        │\
//        │ \
//        │  \      Sustain-Level (s)
//        │   \───────────────
//        │                   │
//        │                   │
//  0.0 ──┴───────────────────┴─────────> Zeit
//       |   |        |       |    |
//       0   a        a+d     duration r
//           ↑        ↑        ↑       ↑
//           |        |        |       |
//         Attack   Decay   Sustain  Release
// Klassische ADSR-Hüllkurve
// time: Zeit seit Note-Start (Sekunden)
// a: Attack-Zeit (Sekunden)
// d: Decay-Zeit (Sekunden)
// s: Sustain-Level (0.0–1.0)
// r: Release-Zeit (Sekunden)
// duration: Dauer der Note, danach beginnt Release
float envelopeADSR(float time, float a, float d, float s, float r, float duration) {
    if (time < 0.0) return 0.0;

    if (time < a) {
        // Attack: Linearer Anstieg auf 1.0
        return time / a;
    } else if (time < a + d) {
        // Decay: Exponentieller Abfall auf Sustain-Level
        float decayT = (time - a) / d;
        return mix(1.0, s, decayT);
    } else if (time < duration) {
        // Sustain-Phase
        return s;
    } else if (time < duration + r) {
        // Release: Exponentieller Abfall von s auf 0
        float releaseT = (time - duration) / r;
        return mix(s, 0.0, releaseT);
    }

    // Nach der Note: Stille
    return 0.0;
}

float mandelbrot(vec2 c,vec2 start, float maxIterations) {
    vec2 z = start;
    float iter = 0.0; 
    for (float i = 0.0; i < maxIterations; i++) {
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
        if(dot(z,z) > 4.0) break;
        iter += 1.0;
    }
    return iter / maxIterations;
}
 

vec4 mandelbrotExt(vec2 c,vec2 start,vec2 center, float scale, float angle,float iterations) {

// Mandelbrot
vec2 uv=center+c*scale;
uv=rotate(uv,radians(angle));
return vec4(vec3(mandelbrot(uv,start,float(iterations))),1.);
}
vec4 juliaExt(vec2 c,vec2 start,vec2 center, float scale, float angle,float iterations) {

// Mandelbrot
vec2 uv=center+c*scale;
uv=rotate(uv,radians(angle));
return vec4(vec3(mandelbrot(start,uv,float(iterations))),1.);
}


// hehe der mandelman

vec4 mandelMan(vec2 uv ,vec2 seed,vec2 headPos, float iterations,float triops,float iTime)
{
vec4 fragColor=vec4(0.);
    // Normalized pixel coordinates (from 0 to 1)
uv = rotate(uv,radians(90.));
vec2 center=vec2( 0.5,-0.  );

float scale=2.;

// Mandelbrot 
fragColor= mandelbrotExt(uv,seed* .25,center+vec2(-1.3,0),scale* .4 ,180.,iterations)* .5;


// Nodding/Head Movement

float beatPosition=mod(iTime ,1.) ;

float env=envelopeADSR(beatPosition,secsPerBeat*0.2,
secsPerBeat*0.2,0.5,secsPerBeat*0.6 ,0.1);
uv+=headPos;

 
fragColor += mandelbrotExt(uv,seed* .25,center,scale*1. ,180.,iterations);
fragColor-= juliaExt(uv,seed ,              center+vec2(  3.150, 2.40),scale*8.,-90.,iterations) ;
fragColor -= juliaExt(vec2(uv.x, -uv.y),seed ,center+vec2(   3.150,2.40),scale*8.,-90.,iterations) ;
fragColor -= juliaExt(uv,seed,center+vec2(   -5.,.0),scale*8.,90.,iterations) ;
  
 uv=rotate(uv,radians(-90.)); 
if(triops<0.5){
// tri-fox hat halt drei mandelbrote, sehen lustigerweise aus wie ne krone, also genommen
 fragColor+=0.5*mandelbrot((rotate(uv,radians( 90.))+vec2(  .40,-.15 )  )*7.,vec2(0.0),MAX_ITER);
 fragColor+=0.5*mandelbrot((rotate(uv,radians( 90.))+vec2(  .40,.0 )  )*8.,vec2(0.0),MAX_ITER);
 fragColor+=0.5*mandelbrot((rotate(uv,radians( 90.))+vec2(  .40,.15 )  )*7.,vec2(0.0),MAX_ITER);
}  else{
// 2te variante also refurio in dem fall versuch es genauso komplex zu machen, also 3 mandelbrot aufrufe, damit nicht sinnloser stall entsteht
// refurio hat weisen bart ist die idee sozusagen, also einen krone oben und 2 unten dann
 // oben, check das passt
 fragColor+=0.5*mandelbrot((rotate(uv,radians( 90.))+vec2(  .45,.0 )  )*8.,vec2(0.0),MAX_ITER);
 
 // unten mal sehen
   fragColor+=0.5*mandelbrot((rotate(uv,radians( -90.))+vec2(  .385,.0 )  )*8.,vec2(0.0),MAX_ITER);
  fragColor+=0.15*mandelbrot((rotate(uv,radians( -90.))+vec2(  .685,.0 )  )*2.,vec2(0.0),MAX_ITER);
 
 
 
 
}
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

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}


vec3 makePal1(float i){
    return pal( i, vec3(0.3,0.3,0.3),vec3(0.6,0.6,0.6),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25) );
}
// refurio cardioid abrollen

float funFactor=10.;

float abs2(vec2 z) {
  return dot(z,z);
}
float arg(vec2 z) {
  return atan(z.y, z.x);
}
vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);
}
vec2 cdiv(vec2 a, vec2 b) {
  return vec2(dot(a,b), a.y*b.x-a.x*b.y)/abs2(b);
}
vec2 cinv(vec2 b) {
  return vec2(b.x, b.y)/abs2(b);
}
vec2 cexp(vec2 z) {
  float e = exp(z[0]);
  return vec2(e*cos(z[1]), e*sin(z[1]));
}
vec2 cln(vec2 z) {
  return vec2(log(sqrt(abs2(z))), arg(z));
}
vec2 cpow(vec2 b, vec2 e) {
  return cexp(cmul(e,cln(b)));
}
vec2 csqrt(vec2 z) {
  return cpow(z, vec2(.5,0.));
}
float osc(float lo, float hi, float f, float t) {
  float d=(hi-lo)/2.;
  return sin(t*f*PI*2.)*d;
}

// https://github.com/hughsk/glsl-hsv2rgb/blob/master/index.glsl
vec3 hsv2rgb(in vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
 
vec4 icolor(int i) {
  float x = float(i);
  return vec4(sin(x*100.), sin(x*200.), sin(x*300.), 0.);
}
vec4 black = vec4(0., 0., 0., 1.);
vec4 white = vec4(1., 1., 1., 1.);

vec2 center = vec2(0.,0.);
float radius = 1.5;
float angle = radians(float(0.));

vec4 scene3Cardioid_Content(vec2 c,float angle) {  
//    c = p2c(c);
  c=c*2.;
  int n = MAX_ITER;
  const vec2 one = vec2(1.,0.);
  float di = 1.5*(1.+cos(angle));
  c = cinv(csqrt(one-4.*c)) - vec2(0.,di);
  c = 0.25*(one-cinv(cmul(c,c)));
  vec2 z = c;
  vec2 dz = vec2(0.,0.);
  vec2 phi = z;
  for(int i=0; i<n; ++i) {
    dz = 2.*cmul(z,dz);
    z = cmul(z,z);
    z+=c;
    vec2 a = cdiv(z,z-c);
    float s = pow(0.5, float(i));
    phi = cmul(phi, cpow(a, vec2(s,0.)));
    if(abs2(z) > 10000.) {
      return vec4(0.73,0.6,0.8,1.) ;
    }
  }
  return vec4(makePal1(arg(z)),1.0);
}


vec4 scene3Cardioid(vec2 c,float iTime) { 

return scene3Cardioid_Content(c,smoothStepCounter(iTime,secsPerBeat*4.,0.4)*(PI/16.) );
}

// Refurio Julia Bobs
   
float sqr(float x) {
  return x*x;
}

vec3 hsv(float h, float s, float v) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(vec3(h,h,h) + K.xyz) * 6.0 - K.www);
  return v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);
}
vec4 cmix(vec4 a, vec4 b, float t) {
  return sqrt(mix((a)*(a), (b)*(b), t));
}


vec2  p2c_wh2;
float p2c_pr;
vec2  p2c_r;
vec2 p2c_center;
void p2c_init(vec2 center, float radius, float angle) {
  p2c_wh2 = iResolution.xy/2.;
  p2c_pr = min(p2c_wh2.x, p2c_wh2.y);
  p2c_r = radius * vec2(cos(angle), sin(angle));
  p2c_center = center;
}
 
 
vec2 cardioid(float a) {
  float r = 1.;
  float x = cos(a)*r;
  float y = sin(a)*r;
  return vec2(1.-(sqr(x-1.)-sqr(y)),
              -2.*(x-1.)*y
             )/4.;
}


float f_n;
float f_k;
vec2 f_ph;
void f_init(int n) {
  f_n = float(n);
}
bool f(vec2 c, vec2 z0) {
  vec2 z = z0;
  f_ph = z;
  for(f_k = 0.; f_k < f_n; ++f_k) {
    z = cmul(z, z) + c; 
    if(abs2(z) > 256.)
      return false;
  }
  return true;
} 
vec3 scene0(vec2 xy,float iTime) {
  xy*=2.;
  f_init(50);
  float t = iTime*2.;
  float n = 100.; 
  float r = 0.2; // (sin(t/10.)/2.+.5)*2.; // amplitude of movements
  float ia = 1.; // (sin(t/3.)/2.); // how much of the circle to draw
  float lissa = 1.; // (sin(t/12.)/2.+.5)*2.+1.;
  float scale = 1.3;
  r /= scale;
  float b = 0.;
  vec3 col = vec3(0.);
  for(float i = 0.; i < n; ++i) {
    vec2 c = cardioid(t+i/n*sin(t/20.))*1.1;
    vec2 o = r*vec2(cos(t-i/n*PI*2.*ia*lissa), sin(-t+i/n*PI*2.*ia));
//    o = c;
    p2c_init(vec2(0., 0.), float(2.), float(0.));
    vec2 p = xy/scale-o;    
    if(f(c, p)) {
      if(i==0.)
        return vec3(1.);
      return hsv((t/4.-i/n/3.), .5, pow(1.-i/n, 2.));
    } 
    col += hsv(0.03, 0.5, pow(f_k/f_n, 1./8.)); // weird glow
  }
  return col/f_n;
}
////////////////


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
    return smoothstep(0.0, 0.1, t) * (1.0 - smoothstep(0.1, 0.2, t));
}

vec4 mandelbrotRenderFormula( vec2 c,vec2 start){
    float l = 0.0;
    vec2 z =start;
    for (int i = 0; i < MAX_ITER; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if (dot(z, z) > 4.0) break;
        l += 1.0;
    } 
    float diff = log2(log2(dot(z,z))) -4.;
    return vec4(z, l / float(MAX_ITER),diff);
}
vec4 mandelbrotRender( vec2 c,vec4 loc){
     c = rotate(c,loc.w) * loc.z + loc.xy;
    return mandelbrotRenderFormula(c,vec2(0.));
}
vec4 mandelbrotRenderJulia( vec2 c,vec4 loc){
     c = rotate(c,loc.w) * loc.z + loc.xy;
    return mandelbrotRenderFormula(loc.xy,c);
}

vec4 getKeyFrame(float t){
    // Achtung, hier kommt schon auf bpm normalisiertes "t" rein
    int currentTimeInterval = int(t) % 17;
    return locations[currentTimeInterval];
} 
float explerp(float v0, float v1, float t) {
    return exp(mix(log(v0), log(v1), t));
}


vec3 colorMandelResultIteration(vec4 result){

    return makePal1(result.z);

}

 // minibrote trifox
vec4 scene2Mandelbroetchen(vec2 fragCoord,float t)
{


 
    float interval = fract(t); 
    vec2 v = fragCoord; // to -1 +1 real,imag
    // arg allgemeiner winkel, normalisiert dann auf 0..1 also der winkel 0..360
    float arg=(atan( v.x,v.y)+PI)/PI2;

    int index=int(floor(mod(t,16.)));
    int indexAchtel=int(floor(mod(t,32.)));
    vec4 keyframe=getKeyFrame(t);

    vec4 l = mandelbrotRender(v,keyframe  );

    vec4 ljulia = mandelbrotRenderJulia(v,vec4(keyframe.xyz,keyframe.w+easeInOutTap(fract(t/8.))*(PI/2.)));
     vec4 result=vec4(l.zzz,1.);
       result+=beatTrack_1[index]*vec4(colorMandelResultIteration(l),1.);
       result+=beatTrack_2[index]*vec4(colorMandelResultIteration(ljulia),1.) ;



    //    result.x+=beatTrack_1[index]*(1.0-interval);
    //    result.y+=beatTrack_2[index]*(1.0-interval);
    //    result.z+=beatTrack_4_8chtel[indexAchtel]*(1.0-interval);

     if(l.z<1.0){
        // circular shading :) optimize please
        // also hier noch irgendwie nen slope mit reinmachen ey
        float tap=easeInOutTap(fract(t));
        result.x+=tap*beatTrack_4_8chtel[indexAchtel]*0.2*sin(arg*arg*PI2 +.23);
        result.y+=tap*beatTrack_4_8chtel[indexAchtel]*0.2*sin(arg*arg*PI2 +.23);
        result.z+=tap*beatTrack_4_8chtel[indexAchtel]*0.2*sin(arg*arg*PI2 +.23);
     }



    return  result; 



}


vec4 mainWrap(vec2 fragCoord,float t){
 
    vec4 result=vec4(0.);
    vec4 noise=vec4(sin(t*10.)*0.5+0.5);
        vec4 scene_0=   scene3Cardioid(fragCoord,t) ;
        vec4 scene_1= scene2Mandelbroetchen(fragCoord,t) ;
        vec4 scene_2=   vec4(scene0(fragCoord,t),1.);


vec4 mandelTriklops=mandelMan(fragCoord,vec2(sin(t)),vec2(0,sin(t)*0.1),100.,0.,t);
vec4 mandelRefurio=mandelMan(fragCoord,vec2(cos(t)),vec2(0.),100.,1.,t);

    if(t<2.){
      // mini intro     
      result.xyzw=vec4(fract(t/2.));
    }else
    if(t<4.){
      // uebergang zu main wums 
        result=noise;
        result.y=1.0-result.y;

    }else
    if(t<4.*9){
      // Main Wums Scene
        result=scene_0;
    }else
    if(t<4.*16.5){
      result=scene_0+noise;
    }else
    if(t<4.*24.){
      result=scene_1;
    }else
    if(t<4.*39.){
      result=scene_1+noise;
    }else
    if(t<4.*55.){
      result=scene_2;
    }else
    if(t<4.*58.){
      result=scene_2+noise; 
    }else
    if(t<4.*64.){
      result=mandelRefurio; 
    }else{
      //outro

result+=mandelTriklops;


      result=noise;
    }
  
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
  float t = (float(m) / 44100.0)/secsPerBeat;

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

