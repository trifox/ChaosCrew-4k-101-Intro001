
 #version 130 x
 uniform int v;xx
 const float f=3.1416,s=f*2;
 const vec2 i=vec2(1920,1080);
 const int y=256;
 const float x=154,c=60/x,t[16]=float[16](1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0),a[16]=float[16](0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0),l[16]=float[16](0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),m[32]=float[32](1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
 const vec4 e[17]=vec4[17](vec4(-1.76836,.0514224,5.35591e-05,.275635),vec4(-1.7665,.0417267,.000444022,.151789),vec4(-1.76926,.0569195,.000299518,.234233),vec4(-1.90728,0,.00117546,3.14159),vec4(-1.86078,0,.00776765,3.14159),vec4(-1.9408,0,.00983929,3.14159),vec4(-1.75488,0,.18202,3.14159),vec4(.38799,.611975,4.39665e-05,-2.3807),vec4(.389011,.608428,.000527473,2.68683),vec4(.381238,.599378,.00430039,.210651),vec4(.360402,.614907,.0116468,2.47319),vec4(.377149,.666879,.00103165,-1.51338),vec4(.376893,.678569,.00125744,.659992),vec4(.359893,.684762,.00555308,3.12128),vec4(.359259,.642514,.0471434,2.04479),vec4(-.15652,1.03225,.081887,2.47777),vec4(-1.75488,0,.18202,3.14159));
 float d=10;
 float n(vec2 v)
 {
   return dot(v,v);
 }
 float p(vec2 v)
 {
   return atan(v.y,v.x);
 }
 vec2 n(vec2 v,vec2 s)
 {
   return vec2(v.x*s.x-v.y*s.y,v.x*s.y+v.y*s.x);
 }
 vec2 p(vec2 v,vec2 f)
 {
   return vec2(dot(v,f),v.y*f.x-v.x*f.y)/n(f);
 }
 vec2 r(vec2 v)
 {
   return vec2(v.x,v.y)/n(v);
 }
 vec2 g(vec2 v)
 {
   float f=exp(v[0]);
   return vec2(f*cos(v[1]),f*sin(v[1]));
 }
 vec2 w(vec2 v)
 {
   return vec2(log(sqrt(n(v))),p(v));
 }
 vec2 g(vec2 v,vec2 f)
 {
   return g(n(f,w(v)));
 }
 vec2 o(vec2 v)
 {
   return g(v,vec2(.5,0));
 }
 float g(float v,float i,float s,float y)
 {
   float c=(i-v)/2;
   return sin(y*s*f*2)*c;
 }
 vec3 u(in vec3 v)
 {
   vec4 f=vec4(1,2/3,1/3,3);
   vec3 i=abs(fract(v.xxx+f.xyz)*6-f.www);
   return v.z*mix(f.xxx,clamp(i-f.xxx,0,1),v.y);
 }
 vec4 z(vec2 v)
 {
   return u(vec3(p(v)/f,1,1)).xyzz;
 }
 vec4 b(vec2 v)
 {
   float s=p(v)/f,i=mod(2*s+2,2)-1;
   i=abs(2*i)-1;
   i=asin(i)/f+.5;
   return vec4(i,i,i,1);
 }
 vec4 q(int v)
 {
   float f=float(v);
   return vec4(sin(f*100),sin(f*200),sin(f*300),0);
 }
 vec4 h=vec4(0,0,0,1),F=vec4(1,1,1,1);
 vec2 k=vec2(0,0);
 float C=1.5,Z=radians(float(0));
 vec2 Y(vec2 v)
 {
   vec2 f=i.xy/2;
   float y=min(f.x,f.y);
   vec2 s=(v-f)/y,x=C*vec2(cos(Z),sin(Z));
   return n(x,s)+k;
 }
 vec4 Y(vec2 v,float f)
 {
   v=Y(v);
   int i=y;
   const vec2 s=vec2(1,0);
   float c=1.5*(1+cos(f/3));
   v=r(o(s-4*v))-vec2(0,c);
   v=.25*(s-r(n(v,v)));
   vec2 x=v,w=vec2(0,0),e=x;
   for(int Q=0;Q<i;++Q)
     {
       w=2*n(x,w);
       x=n(x,x);
       x+=v;
       vec2 m=p(x,x-v);
       float d=pow(.5,float(Q));
       e=n(e,g(m,vec2(d,0)));
       if(n(x)>10000)
         return F*clamp(n(x)/pow(2,float(Q)/(1+c)),0,1);
     }
   return z(x);
 }
 float X(float v)
 {
   return v*v;
 }
 vec3 X(float v,float f,float y)
 {
   vec4 i=vec4(1,2/3,1/3,3);
   vec3 s=abs(fract(vec3(v,v,v)+i.xyz)*6-i.www);
   return y*mix(i.xxx,clamp(s-i.xxx,0,1),f);
 }
 vec4 Y(vec4 v,vec4 f,float i)
 {
   return sqrt(mix(v*v,f*f,i));
 }
 vec2 W;
 float V;
 vec2 U,T;
 void b(vec2 v,float f,float y)
 {
   W=i.xy/2,V=min(W.x,W.y),U=f*vec2(cos(y),sin(y)),T=v;
 }
 vec2 S(float v)
 {
   float s=1,f=cos(v)*s,i=sin(v)*s;
   return vec2(1-(X(f-1)-X(i)),-2*(f-1)*i)/4;
 }
 float R,Q;
 vec2 P;
 void O(int v)
 {
   R=float(v);
 }
 bool O(vec2 v,vec2 f)
 {
   vec2 i=f;
   P=i;
   for(Q=0;Q<R;++Q)
     {
       i=n(i,i)+v;
       if(n(i)>256)
         return false;
     }
   return true;
 }
 vec3 S(vec2 v,float i)
 {
   O(50);
   float s=i*2,x=100,c=.2,y=1,w=1,e=1.3;
   c/=e;
   float d=0;
   vec3 r=vec3(0);
   for(float m=0;m<x;++m)
     {
       vec2 n=S(s+m/x*sin(s/20))*1.1,T=c*vec2(cos(s-m/x*f*2*y*w),sin(-s+m/x*f*2*y));
       b(vec2(0,0),float(2),float(0));
       vec2 z=Y(v)/e-T;
       if(O(n,z))
         {
           if(m==0)
             return vec3(1);
           return X(s/4-m/x/3,.5,pow(1-m/x,2));
         }
       r+=X(.03,.5,pow(Q/R,1/8));
     }
   return r/R;
 }
 vec3 O(in float v,in vec3 f,in vec3 i,in vec3 x,in vec3 y)
 {
   return f+i*cos(6.28318*(x*v+y));
 }
 float O(float v,float f,float i)
 {
   return exp(mix(log(v),log(f),i));
 }
 vec2 X(vec2 v,float f)
 {
   float i=sin(f),s=cos(f);
   return vec2(s*v.x-i*v.y,i*v.x+s*v.y);
 }
 float N(float v)
 {
   return smoothstep(0,.1,v)*(1-smoothstep(.1,.2,v));
 }
 vec4 N(vec2 v,vec2 f)
 {
   float i=0;
   vec2 s=f;
   for(int r=0;r<y;r++)
     {
       s=vec2(s.x*s.x-s.y*s.y,2*s.x*s.y)+v;
       if(dot(s,s)>4)
         break;
       i+=1;
     }
   float x=log2(log2(dot(s,s)))-4;
   return vec4(s,i/float(y),x);
 }
 vec4 b(vec2 v,vec4 f)
 {
   return v=X(v,f.w)*f.z+f.xy,N(v,vec2(0));
 }
 vec4 o(vec2 v,vec4 f)
 {
   return v=X(v,f.w)*f.z+f.xy,N(f.xy,v);
 }
 vec4 M(float v)
 {
   int i=int(floor(v/(c*.5)))%17;
   return e[i];
 }
 float M(float v,float f,float i)
 {
   return exp(mix(log(v),log(f),i));
 }
 vec3 L(float v)
 {
   return O(v,vec3(.3,.3,.3),vec3(.6,.6,.6),vec3(2,1,0),vec3(.5,.2,.25));
 }
 vec3 K(vec4 v)
 {
   return L(v.z);
 }
 vec4 K(vec2 v,float y)
 {
   float x=y/c,w=fract(x);
   if(x<8)
     return vec4((.5*sin(y*s*c*3),1)*(1-x/8),(.5*sin(y*s*c*14),1)*(1-x/8),(.5*sin(y*s*c*225),1)*(1-x/8),1);
   else
     {
       vec2 e=v/i.xy,d=-1+2*e;
       float n=(atan(d.x,d.y)+f)/s;
       int r=int(floor(mod(x,16))),T=int(floor(mod(x,32)));
       vec4 Q=M(y),l=b(d,Q),z=o(d,vec4(Q.xyz,Q.w+N(fract(x/8))*(f/2))),W=vec4(l.zzz,1);
       W+=t[r]*vec4(K(l),1);
       W+=a[r]*vec4(K(z),1);
       if(l.z<1)
         {
           float C=N(fract(x));
           W.x+=C*m[T]*.2*sin(n*n*s+.23);
           W.y+=C*m[T]*.2*sin(n*n*s+.23);
           W.z+=C*m[T]*.2*sin(n*n*s+.23);
         }
       return W;
     }
 }
 vec4 L(vec2 v,float f)
 {
   float i=f/c;
   vec4 s=vec4(0),x=vec4(sin(i*10)*.5+.5),y=Y(v,f),e=K(v,f),w=vec4(S(v,f),1);
   if(i<2)
     s=x;
   else
      if(i<4)
       s=x,s.y=1-s.y;
     else
        if(i<4*9)
         s=y;
       else
          if(i<66)
           s=y+x;
         else
            if(i<96)
             s=e;
           else
              if(i<156)
               s=e+x;
             else
                if(i<220)
                 s=w;
               else
                  if(i<232)
                   s=w+x;
                 else
                    s=x;
   return s;
 }
 out vec4 J;
 void main()
 {
   float f=float(v)/44100;
   f-=.5;
   vec4 i=vec4(0);
   for(float s=0;s<4;s++)
     {
       vec2 x=floor(vec2(s/2,mod(s,2)));
       i+=L(gl_FragCoord.xy+x*.5,f);
     }
   i/=4;
   J=i; 
 } 