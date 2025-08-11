#version 130

uniform int m; // Time in sample player

const float PI = 3.1416;
const float PI2= PI*2;

const int MAX_ITER = 256; 
const float bpm = 154.0;
const float secsPerBeat = 60.0 / bpm;
const float beatTrack_1[16]=float[16](
    
    0.,0.,0.,0.,
    0.,0.,0.,0., 
    1.,0.,0.,0.,
    0.,0.,0.,0.
    ); 
const float beatTrack_2[16]=float[16](
    1.,0.,1.,1.,
    1.,0.,1.,1., 
    1.,0.,1.,1.,
    1.,0.,1.,1.
    ); 

// cowbell
const float beatTrack_3[16]=float[16](
    0.,0.,0.,0.,
    0.,0.,0.,0., 
    0.,1.,0.,1.,
    0.,1.,0.,1.
    ); 

// achtelnoten
const float beatTrack_4_8chtel[32]=float[32](

    0.,0.,1.,1.,0.0,1.,1.,0.,
    0.,0.,1.,1.,0.0,1.,1.,0.,
    0.,0.,1.,1.,0.0,1.,1.,0.,
    0.,0.,1.,1.,0.0,1.,1.,0. 

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

// Exponentielle Interpolation zwischen a und b mit Parameter t in [0,1]
// t=0 -> a, t=1 -> b
// Exponentielle Interpolation für positive Werte a,b > 0
float expInterp(float a, float b, float t) {
    // t=0 => a, t=1 => b
    // Interpoliert so, dass die Werte sich *multiplikativ* ändern
    // (logarithmische lineare Interpolation)
    return exp(mix(log(a), log(b), t));
}

vec2 rotate(vec2 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(
        c * p.x - s * p.y,
        s * p.x + c * p.y
    );
}

vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp( abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0 );
    rgb = rgb*rgb*(3.0 - 2.0*rgb); // smoothstep
    return c.z * mix(vec3(1.0), rgb, c.y);
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

    int currentTimeInterval = int(floor(t / (secsPerBeat*16.) )) % 17;
    return locations[currentTimeInterval];
} 
float explerp(float v0, float v1, float t) {
    return exp(mix(log(v0), log(v1), t));
}


vec3 makePal1(float i){
    return pal( i, vec3(0.3,0.3,0.3),vec3(0.6,0.6,0.6),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25) );
}

vec3 colorMandelResultIteration(vec4 result){

    return makePal1(result.z);

}

 
vec4 mainWrap(vec2 fragCoord)
{
float t = float(m) / 44100.0;



    float currentTimeInterval = t / secsPerBeat;
    float interval = fract(currentTimeInterval);

// beat bangs 





if(currentTimeInterval<8.){

// intro flicker
     return vec4(
        (0.5*sin(t*PI2*secsPerBeat*3.), 1.0)*(1.0-currentTimeInterval/8.0),
        (0.5*sin(t*PI2*secsPerBeat*14.), 1.0)*(1.0-currentTimeInterval/8.0),
        (0.5*sin(t*PI2*secsPerBeat*225.), 1.0)*(1.0-currentTimeInterval/8.0),
       1.
    );
     
     }else{


    vec2 res = vec2(1920, 1080);
    vec2 q =fragCoord / res.xy; // Normalize
    vec2 v = -1.0 + 2.0 * q; // to -1 +1 real,imag
    // arg allgemeiner winkel, normalisiert dann auf 0..1 also der winkel 0..360
    float arg=(atan( v.x,v.y)+PI)/PI2;

int index=int(floor(mod(currentTimeInterval,16.)));
int indexAchtel=int(floor(mod(currentTimeInterval,32.)));
vec4 keyframe=getKeyFrame(t-secsPerBeat*0);

    vec4 l = mandelbrotRender(v,keyframe  );

    vec4 ljulia = mandelbrotRenderJulia(v,vec4(keyframe.xyz,keyframe.w+easeInOutTap(fract(currentTimeInterval/8.))*(PI/2)));
 vec4 result=vec4(l.zzz,1.);
   result+=beatTrack_1[index]*vec4(colorMandelResultIteration(l),1.);
   result+=beatTrack_2[index]*vec4(colorMandelResultIteration(ljulia),1.) ;


 
//    result.x+=beatTrack_1[index]*(1.0-interval);
//    result.y+=beatTrack_2[index]*(1.0-interval);
//    result.z+=beatTrack_4_8chtel[indexAchtel]*(1.0-interval);
 
 if(l.z<1.0){
// circular shading :) optimize please
// also hier noch irgendwie nen slope mit reinmachen ey
float tap=easeInOutTap(fract(currentTimeInterval));
result.x+=tap*beatTrack_4_8chtel[indexAchtel]*0.2*sin(arg*arg*PI2 +.23);
result.y+=tap*beatTrack_4_8chtel[indexAchtel]*0.2*sin(arg*arg*PI2 +.23);
result.z+=tap*beatTrack_4_8chtel[indexAchtel]*0.2*sin(arg*arg*PI2 +.23);
 }
return result;
}
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


    vec4 rz = vec4(0.);
    // antialias, take current pixel man
	rz += mainWrap(gl_FragCoord.xy);
    // antialias take surrounding then shall produce -1,1 for both axis rendering the surrounding
    for (float i=0.; i<4.; i++) 
    {
        vec2  of = floor(vec2(i/2.,mod(i,2.)))-1*2 ;
		rz += mainWrap(gl_FragCoord.xy+ of);
	}
    
    // cheap averagin then 
    rz /= 5.;
  o= rz;
}

