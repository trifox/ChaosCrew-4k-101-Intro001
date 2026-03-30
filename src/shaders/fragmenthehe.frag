 
 #version 430
 const vec2 v=vec2(1920,1080);
 uniform int f;
 out vec4 i;
 float c=2.5;
 const float y=acos(-1.),s=y*2,u=y/2;
 vec2 e=vec2(.5),l=vec2(1);
 float x;
 bool m=true;
 const float t[16]=float[16](1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0),C[8]=float[8](0,0,0,1,0,1,1,1),F[16]=float[16](0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0),M[16]=float[16](0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0);
 vec2 p(vec2 v,vec2 d)
 {
   return vec2(v.x*d.x-v.y*d.y,v.x*d.y+v.y*d.x);
 }
 const vec4 a[1]=vec4[1](vec4(-.525971082531,-.696943648552,.0012521592421613,-1.41271959145301)),J[4]=vec4[4](vec4(.412916,.614806,.00115,0),vec4(-1.028193,-.361376,.009799,0),vec4(.3786,.09855,.009888,0),vec4(-1.2527,.3424,.012762,0));
 vec4 d=a[0];
 const int[109] r=int[109](30,30,18,9,2,22,0,7,23,1,13,10,8,19,0,2,30,20,1,0,0,10,3,2,20,4,11,30,2,5,9,2,8,0,30,1,0,23,0,7,4,30,21,1,9,8,10,9,7,12,21,6,1,5,18,4,12,8,19,9,10,4,30,1,0,16,3,4,3,6,2,30,8,6,22,0,11,30,10,1,3,21,6,15,12,1,0,21,5,1,3,6,30,18,5,4,3,8,11,30,8,19,7,5,18,17,3,0,30);
 const vec3[3] G=vec3[3](vec3(0,1,16),vec3(0,1,40),vec3(0,1,100));
 const int E[9]=int[](7302904,11452290,4014076,16744264,14530492,13843784,16744300,8047066,16480872),D[9]=int[](29353443,20320095,24114551,16720887,32437791,14623348,33469431,30502393,31237095);
 uint p(vec2 v,uint a)
 {
   return uint(D[int(v.y*3.)*3+int(v.x*3.)])>>a&1u;
 }
 vec2 p(int v)
 {
   int i=-1;
   for(int f=0;f<109;f++)
     if(r[f]==30)
       {
         i++;
         if(i==v)
           {
             int v=f+1;
             for(;r[v]!=30;v++)
               ;
             return vec2(f+1,v-f-1);
           }
       }
   return vec2(0);
 }
 vec2 p(float v)
 {
   return vec2(cos(v),sin(v));
 }
 float z;
 vec2 w;
 bool n(vec2 v,vec2 a)
 {
   w=a;
   for(z=0.;z<170;++z)
     {
       w=p(w,w)+v;
       if(dot(w,w)>256)
         return false;
     }
   return true;
 }
 vec3 g(vec2 v,vec2 a)
 {
   n(v,a);
   return vec3(w.xy,z/170);
 }
 vec2 g(vec2 v,vec2 f,float a,float x)
 {
   return p(f+v*a,p(radians(x)));
 }
 float g(vec2 v,vec2 a,vec2 f,float x)
 {
   return g(g(v,f,x,180),a).z;
 }
 float n(vec2 v,vec2 f,vec2 a,float x)
 {
   return g(f,g(v,a,16.,x)).z;
 }
 vec3 g(vec2 v,vec4 d)
 {
   return g(d.xy,p(v,p(d.w))*d.z+d.xy);
 }
 vec2 A=vec2(0),B=vec2(0),b=vec2(0),o=vec2(0),H=vec2(-.15,.15);
 float I=1,K=0,L=0.;
 float g(vec2 v)
 {
   float f;
   vec2 a=vec2(.5,0),d=a+vec2(3.15,2.4);
   v=(p(v,p(radians(90.)))-H)*I+H;
   f=step(1,g(v,B*.25,a+vec2(-1.3,0),.8))*.75;
   v+=o;
   f+=step(1,g(v,vec2(0),a,2.));
   return f-n(v,A-vec2(K*L,0),a+d,-90)-n(vec2(v),A-vec2(K,0),a+vec2(d.x,d.y*-1),-90)-n(v,b,a+vec2(-5,0),90);
 }
 vec3 g(float v)
 {
   return vec3(.2549,.8824,.4118)*v;
 }
 vec3 n(float v)
 {
   return.8*mix(vec3(1),clamp(abs(6.*fract(.7+vec3(3,2,1)/3.)-3.)-1.,0.,1.),.7)+vec3(.25,.35,.45)*cos(s*(vec3(1,2,3)*v+vec3(x*2*0,x/4*0,x*8*0)));
 }
 vec2 N=vec2(1,0);
 vec4 n(vec2 v)
 {
   vec3 f=g(p(v,p(d.w))*d.z+d.xy,vec2(0)),a=g(v,vec4(d.xy,d.z*2,d.w));
   return N.x*vec4(n(f.z),1)+N.y*vec4(n(a.z),1);
 }
 float O=.5;
 vec2 P=vec2(0),Q,R,S,T,U,V;
 vec3 W,X,Y,Z;
 const float _[8]=float[8](1,0,1,0,0,0,0,0);
 float h,j;
 vec2 k=vec2(-1.8,.75);
 vec4 q=vec4(0);
 float at;
 float g(float v)
 {
   return 1.-(1.-v)*(1.-v);
 }
 float n(float v)
 {
   v-=.5;
   return exp(-1e2*v*v);
 }
 float ac,ae;
 vec2 ab;
 int ag;
 vec2 ad=vec2(0),ax;
 float aa[45]={0,0,0,0,200,0,1,0,0,200,0.,.5,10,0,200,1,1,25,0,200,0.,.5,10,0,200,1,1,50,1,200,0,.5,0,0,200,1,1,50,1,200,0,0,0,0,200};
 const int al[9]=int[9](0,20,40,48,76,120,160,184,200);
 vec4 n(vec2 v)
 {
   A=vec2(-.35,0);
   b=vec2(-1,0);
   o=vec2(-.1,0);
   O=sin(x)*.2+1.1;
   float f=x,i=x*2,w=i*2,p=0;
   if(mod(w,16)<8)
     d=a[int(w/16)%1],d.z*=1+mod(x,8)/8,N=vec2(1,0),m=true;
   else if(mod(w,16)<12)
     d=a[int(w/16)%1],N=vec2(0,1),m=false,d.z*=1;
   else
      d=a[int(w/16)%1],d.z*=.66,N=vec2(0,1),m=false;
   c=2.5;
   if(f>=0)
     k=vec2(mix(4.,0.,g(smoothstep(0,1,f/4))),1-(1-smoothstep(0.,1.,f/4))*abs(sin(w)*.5)-.8);
   if(f>4&&f<=8)
     {
       K=0.;
       L=1;
       float v[4]=float[4](-.1,0,.05,0);
       o.y+=v[int(f-4)];
       K=v[int(f-4)]==0?
         0.:
         .8;
       b=vec2(v[int(f-4)]==0?
         -1:
         -1.25,.05);
     }
   if(f>8&&f<=12||f>202&&f<206)
     o.x+=clamp(sin((i-16)*y),0,1)*.2,k.x-=abs(sin((w-32)*y/4))*.1,b+=vec2(sin(x*y*2.5),cos(x*y))*vec2(.5,.25);
   if(f>12&&f<14||f>206&&f<210)
     L=.9,c=2.5,K+=n(fract(f/2)),L=0;
   if(f>16&&f<=20)
     I=exp(mix(log(1.),log(.01),fract((f-16)/4))),p=smoothstep(15,20,f);
   if(f>20&&f<200)
     c=0,p=1;
   return p*n(v);
 }
 int ar[12]={40,48,1,1,76,116,2,6,160,192,7,5};
 int n()
 {
   for(int v=0;v<3;v++)
     if(x>=ar[v*4]&&x<ar[v*4+1])
       return ar[v*4+2]+int((x-ar[v*4])/8)%ar[v*4+3];
   return 0;
 }
 void main()
 {
   x=float(f)/44100/(60/127.);
   ax=(2.*gl_FragCoord.xy-v.xy)/max(v.x,v.y);
   vec2 d=gl_FragCoord.xy/v.xy;
   vec4 a=n(ax),y=vec4(g(g(ax*c+k)),1);
   i=a;
   i=max(i,step(1,c)*y);
   d=gl_FragCoord.xy/v.xy;
   vec2 N=d;
   d.y=1-d.y;
   d.x*=2;
   d*=12;
   int w=n();
   vec2 m=p(w);
   if(w!=0&&N.y<.54&&N.y>.42)
     {
       i*=.5;
       if(fract(d.x)<.5&&fract(d.y)<.5)
         {
           int f=int(m.x)+int(d.x)%109-int((26-m.y)/2);
           i+=vec4(p(fract(d*(1/.5)),uint(r[f>=m.x&&f<=m.x+m.y?
             f:
             0])));
         }
     }
 } 