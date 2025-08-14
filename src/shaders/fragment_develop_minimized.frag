#version 130
 uniform int v;
 const float f=radians(180.),r=f*2.,s=f/2.;
 const vec2 i=vec2(1920,1080);
 const float e=60./154.;
 const vec2 m=vec2(1,0);
 const float t[16]=float[16](1.,0.,.5,1.,0.,1.,0.,.5,.1,0.,1.,0.,0.,0.,0.,1.),y[16]=float[16](0.,1.,0.,0.,1.,0.,1.,1.,0.,1.,0.,0.,1.,0.,1.,1.),c[8]=float[8](0.,0.,0.,1.,0.,1.,1.,1.),a[16]=float[16](0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.),p[32]=float[32](1.,0.,1.,0.,1.,0.,1.,0.,0.,0.,0.,1.,0.,0.,1.,0.,0.,0.,0.,1.,1.,0.,0.,0.,0.,1.,1.,1.,0.,0.,0.,0.);
 const vec4 l[7]=vec4[7](vec4(-1.870003880829,0,.0002674561862707,acos(-1.)),vec4(-.525971082531,-.696943648552,.0012521592421613,-1.41271959145301),vec4(-.5283268509101,-.7040732663739,.0001073184081916,-2.03753212349584),vec4(-.7241362058945,.3615746809763,.0006762353967641,-.353566199543676),vec4(-.690942897652,.465349538581,.0083206456973706,2.7187197572715),vec4(-.71129999537417,.47361824034266,.0000614022690665,-3.07729752834382),vec4(-.7064983534592,.4721945038287,.0006342193550945,2.93861155794138));
 float n(float v)
 {
   return smoothstep(0.,.2,v)*(1.-smoothstep(.2,.5,v));
 }
 float n(vec2 v)
 {
   return dot(v,v);
 }
 vec2 n(vec2 v,vec2 f)
 {
   return vec2(v.x*f.x-v.y*f.y,v.x*f.y+v.y*f.x);
 }
 vec4 n(vec2 v,vec2 f,float y)
 {
   float r;
   for(r=0.;r<y;r++)
     {
       f=n(f,f)+v;
       if(n(f)>256)
         break;
     }
   float i=log2(log2(dot(f,f)))-4.;
   return vec4(f.xy,r/y,i);
 }
 float x(vec2 v)
 {
   return n(v,vec2(0),150).z;
 }
 vec2 n(vec2 v,float f)
 {
   float r=sin(f);
   f=cos(f);
   return vec2(f*v.x-r*v.y,r*v.x+f*v.y);
 }
 vec4 n(vec2 v,vec2 f,vec2 m,float y)
 {
   return vec4(n(n(m+v*y,radians(180.)),f,float(1e2)).zzz,1);
 }
 vec4 x(vec2 v,vec2 f,vec2 m,float y)
 {
   return vec4(n(f,n(m+v*16.,radians(y)),float(1e2)).zzz,1);
 }
 float x(vec2 v,float f)
 {
   return length(v)-f;
 }
 float x(vec2 v,vec2 f)
 {
   vec2 m=abs(v)-f;
   return length(max(m,0.))+min(max(m.x,m.y),0.);
 }
 vec4 n(vec2 v,vec2 f,vec2 r,vec2 i,float m,float y,float z,vec3 s,float c,float d,float k,vec2 w)
 {
   vec4 l=vec4(0);
   v=n(v,radians(90.));
   vec2 a=vec2(.5,0);
   l=n(v,f*.25,a+vec2(-1.3,0),.8)*.75;
   v+=i;
   i=a+vec2(3.15,2.4);
   y=smoothstep(.02,0.,x(v+vec2(.27,.15)+w,c));
   if(y>0)
     l.xyz+=s*(1.-y)*.95;
   y=smoothstep(.02,0.,x(v+vec2(.27,-.15)+w,c));
   if(y>0)
     l.xyz+=(1.-y)*.95;
   l=l+n(v,vec2(0),a,2.)-x(v,f,a+i,-90.)-x(vec2(v.x,-v.y),f,a+i,-90.);
   y=x(v+vec2(.02,0),vec2(.06,5e-4));
   l-=smoothstep(.01,0.,y)*.25;
   y=x(n(v,radians(k))+vec2(d,.15),vec2(.005,.06));
   c=x(n(v,radians(-k))+vec2(d,-.15),vec2(.005,.06));
   vec4 e=x(v,r,a+vec2(-5,0),90.);
   l-=e.x==1.&&(v.x<.28-z||v.x>.28+z)?
     1.-step(fract(v.y/(1./28)),.75):
     e.x;
   v=n(v,radians(-90.));
   return(m<.5?
     max(max(max(l,x((n(v,radians(90.))+vec2(.4,-.15))*7.)),x((n(v,radians(90.))+vec2(.4,0))*8.)),x((n(v,radians(90.))+vec2(.4,.15))*7.)):
     l+x((n(v,radians(90.))+vec2(.4,0))*8.)+x((n(v,radians(-90.))+vec2(.385,0))*8.))-smoothstep(.01,0.,y)*.75-smoothstep(.01,0.,c)*.75;
 }
 float n(float v,float f)
 {
   float i=floor(v);
   v=fract(v);
   return v<f?
     i+smoothstep(0.,f,v):
     i+1.;
 }
 vec3 n(float v,vec3 f,vec3 i,vec3 m,vec3 y)
 {
   return f+i*cos(6.28318*(m*v+y));
 }
 float d(vec2 v)
 {
   return atan(v.y,v.x);
 }
 vec2 d(vec2 v,vec2 f)
 {
   return vec2(dot(v,f),v.y*f.x-v.x*f.y)/n(f);
 }
 vec2 h(vec2 v)
 {
   return vec2(v)/n(v);
 }
 vec2 w(vec2 v)
 {
   float f=exp(v[0]);
   return vec2(f*cos(v[1]),f*sin(v[1]));
 }
 vec2 h(vec2 v,vec2 f)
 {
   return w(n(f,vec2(log(sqrt(n(v))),d(v))));
 }
 vec4 d(vec2 v,float f)
 {
   v=h(h(m-4.*v,vec2(.5,0)))-vec2(0,f);
   v=.25*(m-h(n(v,v)));
   vec2 y=v,r=vec2(0),i=y;
   for(int m=0;m<150;++m)
     {
       r=2.*n(y,r);
       y=n(y,y)+v;
       vec2 s=d(y,y-v);
       float z=pow(.5,float(m));
       i=n(i,h(s,vec2(z,0)));
       if(n(y)>1e4)
         return vec4(.6)*clamp(n(y)/pow(2.,float(m)/(1.+f)),0.,1.);
     }
   return vec4(n(d(y),vec3(0,.1,.2),vec3(.5,1,1),vec3(5,10,5),vec3(.5,0,.75)),1);
 }
 vec4 h(vec2 v,float f)
 {
   return d((v-vec2(.5,0))*2.,f);
 }
 float d(float v)
 {
   return v*v;
 }
 vec4 d(vec2 v,vec4 f)
 {
   v=n(v,f.w)*f.z+f.xy;
   return n(v,vec2(0),150);
 }
 vec4 h(vec2 v,vec4 f)
 {
   v=n(v,f.w)*f.z+f.xy;
   return n(f.xy,v,150);
 }
 vec3 d(vec4 v)
 {
   return n(v.z,vec3(.5),vec3(.5),vec3(1,1,.5),vec3(.25,.9,0));
 }
 vec4 w(vec2 v,float m)
 {
   float i=(atan(v.x,v.y)+f)/r;
   int z=int(floor(mod(m,16.))),a=int(floor(mod(m,32.)));
   vec4 c=l[int(m)%7],s=d(v,c);
   c=vec4(s.zzz,1)+t[z]*vec4(d(s),1)+y[z]*vec4(d(h(v,vec4(c.xy,c.z*n(4.-mod(m,4.),.2),c.w+n(fract(m/8.))*(f/2.)))),1);
   if(s.z<1.)
     {
       float v=n(fract(m));
       c.x+=v*p[a]*.6*sin(i*i*r+.23);
       c.y+=v*p[a]*.6*sin(i*i*r+.23);
       c.z+=v*p[a]*.6*sin(i*i*r+.23);
     }
   return c;
 }
 float h(float v)
 {
   return v<.5?
     4.*v*v*v:
     .5*pow(2.*v-2.,3.)+1.;
 }
 float d(float v,float[16] f)
 {
   return n(fract(v))*f[int(v)%16];
 }
 float w(float v)
 {
   return n(fract(v))*c[int(v)%8];
 }
 vec3 h(float v,float f)
 {
   vec4 m=vec4(1,2./3.,1./3.,3);
   return mix(m.xxx,clamp(abs(fract(vec3(v)+m.xyz)*6.-m.www)-m.xxx,0.,1.),f);
 }
 vec3 d(vec3 v,float f)
 {
   vec3 m=vec3(1);
   return sqrt(mix(m*m,v*v,f));
 }
 vec2 x(float v)
 {
   return vec2(cos(v),sin(v));
 }
 vec2 g(float v)
 {
   vec2 m=x(2.*f*v);
   m.x-=1.;
   return vec2(1.-d(m.x-m.y),-2.*m.x*m.y)/4.;
 }
 float z,b;
 void d()
 {
   z=float(15);
 }
 vec2 k;
 bool g(vec2 v,vec2 f)
 {
   k=f;
   for(b=0.;b<z;++b)
     {
       k=n(k,k)+v;
       if(n(k)>4.)
         return false;
     }
   return true;
 }
 vec2 g(float v,float f)
 {
   return vec2(cos(f-v),sin(f-v));
 }
 vec3 g(vec2 v,float m)
 {
   d();
   float y=sin(m)*f/2.,r=m/10.;
   vec2 i=vec2(0),c=2.*x(0.),s;
   vec3 l;
   for(float z=0.;z<1e2;++z)
     {
       s=g(m*1.25+z/1e2*2.)*r;
       l=vec3(.25*g(2.*f*z/1e2,m*2.*f),-2.*(z/1e2)+-.1);
       vec2 a=x(y);
       vec3 e=vec3(0,0,1);
       e.yz=n(a,e.yz);
       vec3 k=vec3(v,1);
       k.yz=n(a,k.yz);
       k=k*(e.z-l.z)/k.z-e;
       a=k.xy-l.xy;
       float p=1.-length(k);
       a=n(a,c)-i;
       if(k.z<=0.)
         continue;
       if(g(s,a))
         if(z==1.)
           return h(1.,0.);
         else
            return d(h(.6+mod(z,1.)/10.,1.),z/1e2)*p;
     }
   return vec3(0)/1e2;
 }
 vec4 g(vec2 m)
 {
   float i=float(v)/441e2/e;
   vec4 r=vec4(0);
   if(i<0)
     return vec4(0);
   if(i<=4.)
     {
       vec4 v=h(m,0.)*(i/4.);
       r=vec4(mix(v.xxx,v.xyz,n(w(i))),1);
     }
   else if(i<=4.*8)
     {
       r=h(m,mix(0.,1.5,h(fract(clamp((n(i,.35)-4.)/16.,0.,.999)))));
       if(i-4>=16.)
         {
           vec4 v=vec4(g(m,i/6.),1);
           r=max(mix(r,v,d(i,y)),n(m*2.5+vec2(-.8,.5),vec2(sin(i*f),0)*.01-vec2(.35,0),vec2(sin(i*f*1.25),sin(i*f*.5))*.3,vec2(0),1.,i,.05,vec3(1),.001,.31,0.,vec2(.015,0)));
         }
     }
   else if(i<=4.*16)
     {
       float v=(n(i,.35)-32.)/16.;
       r=max(h(m,mix(0.,1.5,1.-h(fract(clamp(v,0.,.999))))),max(n(v>1.?
         m*2.5+vec2(1.5,.5):
         m*3.5+vec2(1.5,1),vec2(sin(i*f),0)*.01-vec2(.35,0),v>1.?
         vec2(cos(i),sin(i*.34))*.5:
         vec2(-.8,.1),vec2(0),0.,i,v>1.?
         .05:
         .001,vec3(1),.001,.36,0.,v>1.?
         vec2(0):
         vec2(.001,-.03)),n(m*3.5+vec2(-.8,1),vec2(-.2,.1),vec2(-.75,0),vec2(0),1.,i,.001,vec3(1),.001,.36,0.,vec2(.001,.03))));
       if(v>1.)
         r=mix(r,w(m,i),d(i,t));
     }
   else if(i<96.)
     r=w(m,i);
   else if(i<156.)
     {
       r=w(m,i);
       float v=i-4*24.;
       if(v>32&&v<48)
         r=max(r,n(m*2.5+vec2(1.5,.5),vec2(0),vec2(0)*.25,vec2(sin(i*4.)*.1,0),0.,i,.03,vec3(1),.001,.4,0,vec2(0)));
     }
   else if(i<208.)
     {
       vec4 v=vec4(g(m,i/6.),1);
       r=v;
     }
   else if(i<232.)
     {
       vec4 v=vec4(g(m,i/6.),1);
       r=max(v+vec4(n(w(i))),n(m*2.5+vec2(-.8,.5),vec2(0),vec2(0)*.25,vec2(sin(i*4.)*.1,0),1.,i,.03,vec3(1),.001,.4,0,vec2(0)));
     }
   else
      r=i<256.?
       max(n(m*2.5+vec2(1.5,.5),vec2(0),vec2(0)*.25,vec2(sin(i*4.)*.1,0),0.,i,.01,vec3(1,0,0),.001,.4,0,vec2(0)),n(m*2.5+vec2(-.8,.5),vec2(sin(i*f),0)*.45-.25,vec2(0,.4),vec2(sin(i*f)*.1,0),1.,i,.01,vec3(0,1,0),.003,.4,0.,vec2(0))):
       i<268.?
         vec4(n(w(i))):
         vec4(0);
   return r;
 }
 out vec4 C;
 void main()
 {
   vec4 v=g(gl_FragCoord.xy/i*2.-1.);
   C=v;
   return;
 };
 