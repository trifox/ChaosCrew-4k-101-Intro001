#version 130  

uniform int m;
out vec4 o;
float PI = 3.1416;
float t = m/float(44100);
int timeIntSeconds=int(t);
   

float mandelbrot( in vec2 c )
{
 


    const float B = 256.0;
    float l = 0.0;
    vec2 z  = vec2(0.0);

	vec2 sins=vec2(t);
	  
    for( int i=0; i<512; i++ )
    {

        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
         
		if( dot(z,z)>4 ) break;
		l += 1.0;
    }
 
    
     
    return l/512.0;
}

 
float explerp(float v0, float v1,float t) {
  return exp(mix(log(v0), log(v1), t));
}
   
void main()
{ 

	float currentTimeInterval=t/10;
	float interval=fract(currentTimeInterval);

	vec2 res = vec2(1280,720);
	 

	vec2 q = gl_FragCoord.xy/res.xy;
	vec2 v = -1.0+2.0*q; 
	     float l = mandelbrot(v);
		  
	o = vec4(0,0,0,1);
        o += 0.5 + 0.5*cos( 3.0 + l*0.15 + vec4(0.0,0.6,1.0,0));
  

}