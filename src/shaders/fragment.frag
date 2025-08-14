#version 130

uniform int m; // Time in sample player

const float PI = radians(180.);
const float PI2= PI*2.;
const float HALF_PI=PI/2.;
const vec2 iResolution= vec2(1920.,1080.);
const float BAILOUT=256;
 

const int MAX_ITER = 150; 
const float bpm = 154.0;
const float secsPerBeat = 60.0 / bpm;
const float one=1.;
const float zero=0.;
// complex one
const vec2 cone = vec2(one,zero);

const float beatTrack_1[16]=float[16](
    
    1.,0.,0.5,1.,
    0.,1.,0.,0.5, 
    .1,0.,1.,0.,
    0.,0.,0.,1.
    ); 
const float beatTrack_2[16]=float[16](
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

// achtelnoten
const float beatTrack_4_8chtel[32]=float[32](

    1.,0.,1.,0.,1.0,0.,1.,0.,
    0.,0.,0.,1.,0.0,0.,1.,0.,
    0.,0.,0.,1.,1.0,0.,0.,0.,
    0.,1.,1.,1.,0.0,0.,0.,0. 

    ); 


// vec4 real,imag,scale for locations  
const vec4 locations[7] = vec4[7](  
 
vec4(-1.870003880829,0,0.0002674561862707285,3.141592653589793),
vec4(-0.525971082531,-0.696943648552,0.0012521592421613436,-1.4127195914530066),
vec4(-0.5283268509101,-0.7040732663739,0.00010731840819160572,-2.0375321234958355),


vec4(-0.7241362058945,0.3615746809763,0.0006762353967640741,-0.3535661995436758),

vec4(-0.690942897652,0.465349538581,0.008320645697370592,2.718719757271499),
vec4(-0.71129999537417,0.47361824034266,0.00006140226906652181,-3.0772975283438235),
vec4(-0.7064983534592,0.4721945038287,0.0006342193550945032,2.9386115579413823)


);

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
float abs2(vec2 z) {
  return dot(z,z);
}
vec2 cmul(vec2 a, vec2 b) { 
  return vec2(a.x*b.x-a.y*b.y,  a.x*b.y+a.y*b.x);
}
vec4 mandelbrotCore(vec2 c, vec2 z0,float iterations) {
  vec2 z = z0; 
  float i; 
  for(i = 0.; i < iterations; i++) {
    z = cmul(z, z) + c; 
    if(abs2(z) > BAILOUT) break;
  }
  
  float diff = log2(log2(dot(z,z))) -4.;

  return vec4(z.xy,i/iterations,diff);

} 
float mandelbrotIters(vec2 c, vec2 z0,float iterations) {
  // yes utility method utilizing the other to get a result in environment of formula or something weird
  vec4 result=mandelbrotCore(c,z0,iterations);
  return result.z;
}
vec2 rotor(float a) {
  return vec2(cos(a), sin(a));
}

// util rotate
vec2 rotate(vec2 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(
        c * p.x - s * p.y,
        s * p.x + c * p.y
    );
}
  

vec4 mandelbrotExt(vec2 c,vec2 start,vec2 center, float scale, float angle,float iterations) {

// Mandelbrot
vec2 uv=center+c*scale;
uv=rotate(uv,radians(angle));
vec4 res=mandelbrotCore(uv,start,float(iterations));
return vec4(res.zzz,1.);
}
vec4 juliaExt(vec2 c,vec2 start,vec2 center, float scale, float angle,float iterations) {

// Mandelbrot
vec2 uv=center+c*scale;
uv=rotate(uv,radians(angle));
vec4 res=mandelbrotCore(start,uv,float(iterations));
return vec4(res.zzz,1.);
}

float env(float t){
  return sin(t*PI);
}float sdCircle( vec2 p, float r )
{
    return length(p) - r;
}
// hehe der mandelman
// UV: 0..1, nur x wird hier benutzt
float toothPattern(vec2 uv, float teeth, float gapFraction) {
    float period = 1.0 / teeth;
    float u = fract(uv.y / period);        // Position innerhalb einer Periode
    float duty = 1.0 - gapFraction;        // Anteil der "hellen" Fläche
    return step(u, duty);                  // 1.0 = hell, 0.0 = dunkel
}
float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

vec4 mandelMan(vec2 uvIn ,vec2 seedEyes,vec2 seedMouth,vec2 headPos, float iterations,
float triops,float iTime,float teethOpen,vec3 eye1Color,float eyeSize, float browPos,float eyeAngle,vec2 eyePosOffset)
{
vec4 fragColor=vec4(0.);
    // Normalized pixel coordinates (from 0 to 1)
vec2 uv = rotate(uvIn,radians(90.));
vec2 center=vec2( 0.5,-0.  );

float scale=2.;

// Mandelbrot 
fragColor= mandelbrotExt(uv,seedEyes* .25,center+vec2(-1.3,0),scale* .4 ,180.,iterations)* .75;


// Nodding/Head Movement

float beatPosition=mod(iTime ,1.) ;

float env=env(beatPosition);
uv+=headPos;


vec2 eyePos=center+vec2(  3.150, 2.40);
float eye=sdCircle(uv+vec2(0.27,0.15)+eyePosOffset,eyeSize);
float eyestep=smoothstep(0.02,0.,eye);
if(eyestep>0){
 fragColor.xyz+=eye1Color*(1.0-eyestep)*0.95;
}
float eye2=sdCircle(uv+vec2(0.27,-0.15)+eyePosOffset,eyeSize);
float eye2step=smoothstep(0.02,0.,eye2);

if(eye2step>0){
 fragColor.xyz+=(1.0-eye2step)*0.95;
}



fragColor += mandelbrotExt(uv,vec2(0.),center,scale*1. ,180.,iterations);
fragColor-= juliaExt(uv,seedEyes ,              center+eyePos,scale*8.,-90.,iterations) ;
fragColor -= juliaExt(vec2(uv.x, -uv.y),seedEyes ,center+eyePos,scale*8.,-90.,iterations) ;



float nose=sdBox(uv+vec2(0.02,0.),vec2(0.06,0.0005));
fragColor-=smoothstep(0.01,0.,nose)*0.25;

float eyebrow1=sdBox(rotate(uv,radians(eyeAngle))+vec2(browPos,0.15),vec2(0.005,0.06));
float eyebrow2=sdBox(rotate(uv,radians(-eyeAngle))+vec2(browPos,-0.15),vec2(0.005,0.06));

//float teethOpen=0.03;
/// den mund, da wollen wir die schwarzen bereiche mit zaehnen also vertikalen streifen rendern
vec4 mund= juliaExt(uv,seedMouth,center+vec2(   -5.,.0),scale*8.,90.,iterations) ;
fragColor-=mund.x==1.0&&(uv.x<0.28-teethOpen||uv.x>0.28+teethOpen)?1.0-toothPattern(uv,28,0.25):mund.x;


 uv=rotate(uv,radians(-90.)); 
if(triops<0.5){
// tri-fox hat halt drei mandelbrote, sehen lustigerweise aus wie ne krone, also genommen 
 fragColor=max(fragColor,mandelbrotIters((rotate(uv,radians( 90.))+vec2(  .40,-.15 )  )*7.,vec2(0.0),MAX_ITER));
 fragColor=max(fragColor,mandelbrotIters((rotate(uv,radians( 90.))+vec2(  .40,.0 )  )*8.,vec2(0.0),MAX_ITER));
 fragColor=max(fragColor,mandelbrotIters((rotate(uv,radians( 90.))+vec2(  .40,.15 )  )*7.,vec2(0.0),MAX_ITER)); 



}  else{
// 2te variante also refurio in dem fall versuch es genauso komplex zu machen, also 3 mandelbrot aufrufe, damit nicht sinnloser stall entsteht
// refurio hat weisen bart ist die idee sozusagen, also einen krone oben und 2 unten dann
 // oben, check das passt
 fragColor+=1.*mandelbrotIters((rotate(uv,radians( 90.))+vec2(  .40,.0 )  )*8.,vec2(0.0),MAX_ITER);
 
 // unten mal sehen
   fragColor+=1.*mandelbrotIters((rotate(uv,radians( -90.))+vec2(  .385,.0 )  )*8.,vec2(0.0),MAX_ITER);
 // fragColor+=0.15*mandelbrotIters((rotate(uv,radians( -90.))+vec2(  .685,.0 )  )*2.,vec2(0.0),MAX_ITER);
 
 
 
 
}


fragColor-=smoothstep(0.01,0.,eyebrow1)*.75;
fragColor-=smoothstep(0.01,0.,eyebrow2)*.75;

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
    vec3(0.5, 0.5, 0.5),  // Grundton: warm-golden
    vec3(.5, 0.5, 0.5),   // Amplitude: Gold -> Orange -> Rot
    vec3(3.0, 4.0,  .50), // Hohe Frequenz: pulsierende Energie
    vec3(0.25, .9, 0.0)   // Phase für „rollende“ Farbwellen
);
}

  
vec3 makePal2(float i){
    return pal(i,
    vec3(0.0, 0.1, 0.2),   // Grundton: kaltes Sternenblau
    vec3(0.5, 1.0, 1.0),   // Amplitude: Cyan -> Türkis -> Weiß
    vec3(5.0, 10.0, 5.0),  // Mehrfachwiederholungen: „Wellenfronten“ im Farbraum
    vec3(0.5, 0.0, 0.75)   // Phase für asynchrone Peaks
);
       

} 

// refurio cardioid abrollen 
float arg(vec2 z) {
  return atan(z.y, z.x);
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
 
vec4 icolor(int i) {
  float x = float(i);
  return vec4(sin(x*100.), sin(x*200.), sin(x*300.), 0.);
} 
 
vec4 scene3Cardioid_Content(vec2 c,float ggg) {  
vec2 center = vec2(0.,0.);
float radius = 1.5;
float angle = radians(float(0.));
  c=c; 
  c = cinv(csqrt(cone-4.*c)) - vec2(0.,ggg);
  c = 0.25*(cone-cinv(cmul(c,c)));
  
  vec2 z = c;
  vec2 dz = vec2(0.,0.);
  vec2 phi = z;
  for(int i=0; i<MAX_ITER; ++i) {
    dz = 2.*cmul(z,dz);
    z = cmul(z,z);
    z+=c;
    vec2 a = cdiv(z,z-c);
    float s = pow(0.5, float(i));
    phi = cmul(phi, cpow(a, vec2(s,0.)));
    if(abs2(z) > 10000.) {
      return vec4(0.6)*clamp(abs2(z)/pow(2.,float(i)/(1.+ggg)),0.,1.);
    }
  }
  return vec4(makePal2(arg(z)),1.);
  
  }

 
vec4 scene3Cardioid(vec2 c,float iTime) {  
return scene3Cardioid_Content((c-vec2(0.5,0.))*2.,iTime );
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

vec4 mandelbrotRender( vec2 c,vec4 loc){
     c = rotate(c,loc.w) * loc.z + loc.xy;
    return mandelbrotCore(c,vec2(0.),MAX_ITER);
}
vec4 mandelbrotRenderJulia( vec2 c,vec4 loc){
     c = rotate(c,loc.w) * loc.z + loc.xy;
    return mandelbrotCore(loc.xy,c,MAX_ITER);
}

vec4 getKeyFrame(float t){
    // Achtung, hier kommt schon auf bpm normalisiertes "t" rein
    int currentTimeInterval = int(t) % 7;
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

    vec4 ljulia = mandelbrotRenderJulia(v,
    vec4(keyframe.xy,keyframe.z*smoothStepCounter(4.-mod(t*1.,4.) ,1.,0.2),keyframe.w+easeInOutTap(fract(t/8.))*(PI/2.)));

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
        result.x+=tap*beatTrack_4_8chtel[indexAchtel]*0.6*sin(arg*arg*PI2 +.23);
        result.y+=tap*beatTrack_4_8chtel[indexAchtel]*0.6*sin(arg*arg*PI2 +.23);
        result.z+=tap*beatTrack_4_8chtel[indexAchtel]*0.6*sin(arg*arg*PI2 +.23);
     }



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
 




float f_n;
float f_k;
void f_init(int n) {
  f_n = float(n);
}
vec2 f_z;
bool f(vec2 c, vec2 z0) {
  f_z = z0;
  for(f_k = 0.; f_k < f_n; ++f_k) {
    f_z = cmul(f_z, f_z) + c;
    if(abs2(f_z) > 4.)
      return false;
  }
  return true;
}
vec2 lissajous(float lissa, float shift, float t) {
  return vec2(cos(t - shift*lissa), sin(t - shift));
}

vec3 camera(float a, float d, vec3 v) {
  v.yz = cmul(v.yz, rotor(a));
  //v.xy *= (-1.-d)/(v.z-1.-d);
  v.xy *= (d-1.)/(v.z+1.+d);
  return v;
} 



vec3 hsv(float h, float s, float v) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(vec3(h,h,h) + K.xyz) * 6.0 - K.www);
  return v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);
}
vec3 cmix(vec3 a, vec3 b, float t) {
  return sqrt(mix(a*a, b*b, t));
}

vec2 cardioid(float a) {
  vec2 v = rotor(2.*PI*a);
  v.x -= 1.;
  return vec2(
    1.-(sqr(v.x-v.y)),
    -2.*(v.x)*(v.y)
  )/4.;
}

vec3 xxxNew_scene0(vec2 xy, float t) {
  f_init(100);
  
  float cam_a = sin(t)*PI/2.,
        cam_d = 1.,
        
        n = 100., // number of bobs
  
        lissa = 1., // 1.0 is a circle
        amplitude = .25, // of lissjous animation
        arclen = 3., // 1.0 is full circle
        lspeed = 1., // of lissajous anmation
        
        speed = 1.25, // at which julia parameters are animated
  
        roughness = t/10., // scale complex parameter c, 1.0 is on cardioid
        cangle = 1., // distance the parameter c travels from head to tail
        
        column_height = (sin(t*30.)/2.+.5)*1.,
        column_shift = -.1,
        
            // julia view
        radius = 2.,
        angle = 0.;
        vec4 location= locations[int(t)%7 ];
    radius =location.z;
        
  vec2 center = vec2(0.),
       r = radius * rotor(angle),
       c, p;

  vec3 col = vec3(0.),
       offset;
  for(float i = 0.; i < n; ++i) {
    //c = cardioid(t*speed + i/n*cangle)*roughness;
    //c = vec2((sin(t*speed)/2.+.5)*(-2. - (-1.))-1., 0.);
    
    // minibrot section:
    // tails shrink:
    //center = c = locations[g].xy+i/n*.5*rotor(t/2.+i/n*2.)*locations[g].z;
    center = c = location.xy+.03*rotor(t/2.+i/n*2.)*location.z;
    
    offset = vec3(amplitude * lissajous(lissa, 2.*PI * i/n * arclen, t*lspeed*2.*PI),
                  -column_height * (i/n) + column_shift);
                  
    vec2 cr = rotor(cam_a);
    vec3 cam_pos = vec3(0., 0., cam_d); // cot(a)?
    cam_pos.yz = cmul(cr, cam_pos.yz);
    vec3 ray = vec3(xy, 1.);
    ray.yz = cmul(cr, ray.yz);
    ray = ray * (cam_pos.z - offset.z)/ray.z - cam_pos;
    vec2 uv = ray.xy - offset.xy;
    float z = 1.-length(ray);

    uv = cmul(uv, r) - center;
    //uv = mod(uv+1., 4.*vec2(2.,2.))-1.;

    if(ray.z <= 0.)
      continue;

    if(f(c, uv))    
      // inside
      if(i == 1.)
        return hsv(1., 0., 1.);
      else
        return cmix(vec3(1.), hsv(.6+mod(i, 1.)/10., 1., 1.), i/n)*z;
        
    // outside
    col += hsv(0.6, 0.5, pow(f_k/f_n, .125/1.));
  }
  return vec3(0.);
  return col/n;
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
const float offset=0.; // audio offset, somehow the track has a 1bpm delay at start
vec4 mainWrap(vec2 fragCoord,float t){
 
    vec4 result=vec4(0.); 


/// achtung hier die methode direkt zu returnen
// unten werden aber alle 4 auch aufgerufen, man sollte also 
// hier die params fuer unten festlegen

    if(t < 4.*16.) {
      const float ref1[8]=float[8](
        1.,1.,1.,0.,   0.,0.,0.,0.
      );
      if(t >= 4.*1. && mod(t,2.)<1.) 
        return mix(scene2Mandelbroetchen(fragCoord,t/.2),
                   vec4(xxxNew_scene0(fragCoord, t/4.), 1.),
                   easeInOutTap(t)*flashBang8(t*2.,ref1));

      return vec4(xxxNew_scene0(fragCoord, t/4.), 1.);
    }





    vec4 noise=vec4(easeInOutTap(flashBang8(t,beatTrack_4Achtel)));
    float env=env(fract(t));

    vec4 location=locations[int(t)%7];
//        vec4 scene_1= scene2Mandelbroetchen(fragCoord,t) ;
//     return scene_1;

/* develop */

 vec4 mandelRefurio=mandelMan(
  fragCoord*2.5+vec2(- .8,0.5),
  // eye seed
  vec2(sin(t*PI)   
  ,0)*0.01-vec2(0.35,0.),
  
  // mouth seed
  vec2(sin(t*PI*1.25),sin(t*PI*0.5))*0.3,
  // head pos
  vec2(0.,0.),
  // iterations
  100.,
  // triops/refurio control par
   1.,
   // time
   t,
   //teethopen
   0.05,
   // eyecolor
   vec3(1.,1.,1.),
   // eyesize
   0.002,
   0.35,
   0.,
   // eyepos offset
   vec2(0.01,0.01)
   ); 
vec4 mandelTriklops=mandelMan(
  //uv
  fragCoord*2.5+vec2(1.5,0.5), 
  // seed eyes
vec2( 0. ,-0.),
// seed mouth
vec2(0.,0.)*0.25,
// headpos
vec2(sin(t*4.)*0.1,0),
// iters
100.,
// trifox or refurio
0.,
// time
t,
// mouthopen
0.01,
// eyecolor
vec3(1.,1.,1.),
// eyesize
0.001,
// browpos
0.4
// browangle
,0,
   // eyepos offset
   vec2(0.)
);   



vec4 dieMiniBrote=scene2Mandelbroetchen(fragCoord,t/.2);


vec4 bobs=vec4(xxxNew_scene0(fragCoord,t/4.),1.);



















   return  dieMiniBrote+ max(mandelTriklops,mandelRefurio);
   


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


   
  if(t<0){
    return vec4(0.0);
  }else


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
        return vec4(easeInOutTap(t)*flashBang8(t*2.,ref1));

      return vec4(xxxNew_scene0(fragCoord, t/4.), 1.);
    }

    if(t<=4.*1.){
      // laenge 4
      // mini intro  ein takt   
      //result.xyzw=vec4(1.0-easeInOutTap(fract(t)  ));
        vec4 scene_0=  scene3Cardioid(fragCoord,0.  )*(t/4.);
        result=vec4(mix(scene_0.xxx,scene_0.xyz,easeInOutTap(flashBang8(t,beatTrack_4Achtel))),1.0);
    }
    else if(t<=4.*8){

        float smoothStepTime=smoothStepCounter(t,1.0,0.35);
          float stepTime=(smoothStepTime-4.)/16.;
      // laenge 32
      // Main Wums Scene nach halbem pattern

        vec4 scene_0=   scene3Cardioid(fragCoord,mix(0.,1.5,cubicInOut(fract(clamp(stepTime,0.,.999)) )  ) );
        result=scene_0;
if(t-4>=16.){
        vec4 scene_2= vec4(  xxxNew_scene0(fragCoord,t/6.),1.);//,125.,25., 10.,location,1.3,vec2(5.,-10.)),1.);

   
    result=mix(result,scene_2,flashBang(t,beatTrack_2));
  //  result+=scene_2;  
  
 
/// Scene 1 MandelRefurio schaurt sich cardioid effekt an
vec4 mandelRefurio=mandelMan(
  fragCoord*2.5+vec2(- .8,0.5),
  // eye seed
  vec2(sin(t*PI)   
  ,0)*0.01-vec2(0.35,0.),
  
  // mouth seed
  vec2(sin(t*PI*1.25),sin(t*PI*0.5))*0.3,
  // head pos
  vec2(0.,0.),
  // iterations
  100.,
  // triops/refurio control par
   1.,
   // time
   t,
   //teethopen
   0.05,
   // eyecolor
   vec3(1.,1.,1.),
   // eyesize
   0.001,
   0.31,
   0.,
   // eyepos offset
   vec2(0.015,0.)
   ); 
   result=max(result,mandelRefurio); 
}
    }else
    if(t<=4.*16){
// hier dann 2ter teil cardioid intro es wieder abrollen mit triklops avatar und refurio, am ende redet nochmal ltriklpos
              float smoothStepTime=smoothStepCounter(t,1.0,0.35);
          float stepTime=(smoothStepTime-32.)/16.;

        vec4 scene_0=   scene3Cardioid(fragCoord,mix(0.,1.5,1.0-cubicInOut(fract(clamp(stepTime,0.,.999)) )  ) );
        vec4 scene_1= scene2Mandelbroetchen(fragCoord,t) ;


/// Scene 1 MandelRefurio schaurt sich cardioid effekt an
vec4 mandelRefurio=mandelMan(
  fragCoord*3.5+vec2(- .8,1.),
  // eye seed
   vec2(-0.2,0.1),
  
  // mouth seed
  vec2(-0.75,0.),
  // head pos
  vec2(0.,0.),
  // iterations
  100.,
  // triops/refurio control par
   1.,
   // time
   t,
   //teethopen
   0.001,
   // eyecolor
   vec3(1.,1.,1.),0.001,0.36,0.,
   // eyepos offset
   vec2(0.001,0.03)); 

/// Scene 1 MandelRefurio schaurt sich cardioid effekt an
vec4 mandelTriklops=mandelMan(
  stepTime>1.? 
  fragCoord*2.5+vec2(1.5,0.5):
  fragCoord*3.5+vec2(1.5,1.)
  
  , 
  // eye seed
  vec2(sin(t*PI)   
  ,0)*0.01-vec2(0.35,0.),
  
  // mouth seed
  stepTime>1.?vec2(cos(t),sin(t*0.34))*0.5:vec2(-0.8,0.1),
  // head pos
  vec2(0.,0.),
  // iterations
  100.,
  // triops/refurio control par
   0.,
   // time
   t,
   //teethopen
  stepTime>1.? 0.05:0.001,
   // eyecolor
   vec3(1.,1.,1.),0.001,0.36,0.,
   // eyepos offset
    stepTime>1.?vec2(0.):vec2(0.001,-0.03)); 



      result=max(scene_0, max(mandelTriklops,mandelRefurio ));


if(stepTime>1.0){
    result=mix(result,scene_1,flashBang(t,beatTrack_1));
}

    }else
    if(t<4.*24.){       
// hier dann abschnitt mit minibroetchen

        vec4 scene_1= scene2Mandelbroetchen(fragCoord,t) ;

      result=scene_1;
    }else
    if(t<4.*39.){
// hier dann abschnitt mit minibroetchen und triklops er soll aber nur ein tak sichtbar sein und wackeln
// wird einfach zuviel gedoens, analog soll dann refurio bei seinem auch wackeln
// am ende wackeln beide und freuen sich

        vec4 scene_1= scene2Mandelbroetchen(fragCoord,t) ;

      result=scene_1;

float tnormalized=t-4*24.;
if(tnormalized>8*4&&tnormalized<12*4){
// debug mandell triklops fun
vec4 mandelTriklops=mandelMan(
  //uv
  fragCoord*2.5+vec2(1.5,0.5), 
  // seed eyes
vec2( 0. ,-0.),
// seed mouth
vec2(0.,0.)*0.25,
// headpos
vec2(sin(t*4.)*0.1,0),
// iters
100.,
// trifox or refurio
0.,
// time
t,
// mouthopen
0.03,
// eyecolor
vec3(1.,1.,1.),
// eyesize
0.001,
// browpos
0.4
// browangle
,0,
   // eyepos offset
   vec2(0.)
);   

result=max(result,mandelTriklops);

}
    }else
    if(t<4.*52.){        
    vec4 scene_2= vec4(  xxxNew_scene0(fragCoord,t/6.),1.);//,125.,25., 10.,location,1.3,vec2(5.,-10.)),1.);


      result=scene_2;
    }else if(t<4.*58.){        
    vec4 scene_2= vec4(  xxxNew_scene0(fragCoord,t/6.),1.);//,125.,25., 10.,location,1.3,vec2(5.,-10.)),1.);

      result=scene_2+noise; 

/// refurio schaut sich seine bobs an

vec4 mandelRefurio=mandelMan(
  //uv  
  fragCoord*2.5+vec2(- .8, .5),
  // seed eyes
vec2( 0. ,-0.),
// seed mouth
vec2(0.,0.)*0.25,
// headpos
vec2(sin(t*4.)*0.1,0),
// iters
100.,
// trifox or refurio
1.,
// time
t,
// mouthopen
0.03,
// eyecolor
vec3(1.,1.,1.),
// eyesize
0.001,
// browpos
0.4
// browangle
,0,
   // eyepos offset
   vec2(0.)
);   
result=max(result,mandelRefurio);

    }else
    if(t<4.*64.){

      /// Outro Area
      
/// Scene ? MandelRefurio schaurt sich cardioid effekt an
vec4 mandelRefurio=mandelMan(
  fragCoord*2.5+vec2(- .8,0.5),
  vec2(sin(t*PI)   
  ,0)*0.45-0.25,vec2(0,0.4),vec2(sin(t*PI)*0.1,0.),100.,1.,t,
// mouthopen
0.01,
// eyecolor
vec3(0.,1.,0.),
// eyesize
0.003,
// browpos
0.4
// browangle
,0.,
   // eyepos offset
   vec2(0.)); 
vec4 mandelTriklops=mandelMan(
  //uv
  fragCoord*2.5+vec2(1.5,0.5), 
  // seed eyes
vec2( 0. ,-0.),
// seed mouth
vec2(0.,0.)*0.25,
// headpos
vec2(sin(t*4.)*0.1,0),
// iters
100.,
// trifox or refurio
0.,
// time
t,
// mouthopen
0.01,
// eyecolor
vec3(1.,0.,0.),
// eyesize
0.001,
// browpos
0.4
// browangle
,0,
   // eyepos offset
   vec2(0.)
);   



      result=max(mandelTriklops,mandelRefurio); 
    }else if(t<4.*67.){
      //outro
        result=vec4(easeInOutTap(flashBang8(t,beatTrack_4Achtel)));
    }else{
      //outro totalo
 
result=vec4(0.);

 
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

