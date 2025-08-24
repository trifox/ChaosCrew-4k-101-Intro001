// Mipmap fake glossy thing!
#version 130
 
const vec2 iResolution=vec2(1920,1080);  

uniform int m; // Time in sample player 
uniform sampler2D o;
out vec4 i;
 void mainAlt(){

		vec2 uv = gl_FragCoord.xy/vec2(1920,1080);
i=texture(o,uv)*0.75;
}

// lol ki generiert im prinzip soll es rythmen darstellen also 4&4tel takt und man kann mit array marker setzen


// BPM Raster Visualizer mit Pattern-Farben
// Seltsamer Attraktor 🪩

const float bpm = 154.0;   // Beats per Minute
const int seq  = 4;        // Schritte pro Pattern
const int pat  = 4;        // Patterns pro Reihe
const int numpatterns =17; // Zeilen (Pattern Sets)

const int NUM_MARKER=13;
const int marker[NUM_MARKER]=int[NUM_MARKER](
2*4,// start beat buumm,
4*4, // buuhmm,
6*4,// buuhmm,
8*4, // buuhmm,
10*4, // buuhmm,
12*4, // buuhmm,
14*4, // buuhmm,
16*4, // buuhmm,
17*4  ,
32*4 ,
40*4 ,
48*4 ,
65*4 
); 
void main()
{
 float iTime = float(m) / 44100 ; 
    vec2 uv = (gl_FragCoord.xy / iResolution.xy);

// restore image
i=texture(o,uv);


    uv.y=1.-uv.y;

    // Grid Setup
    float cols = float(seq * pat);    // Gesamtspalten
    float rows = float(numpatterns);  // Gesamtzeilen
    vec2 grid = uv * vec2(cols, rows);

    // Aktueller Beat
    float bps = bpm / 60.0;
    float beat = iTime * bps;
    float stepIndex = mod(floor(beat), cols);        // Spalte (aktueller Step)
    float rowIndex  = mod(floor(beat / cols), rows); // Zeile (aktuelles Pattern)
    
    // Doppelt So Schnell achtel?
    



    // Zellkoordinaten
    vec2 cell = fract(grid);

    // Gitterlinien
    float gridLine = (cell.x < 0.05 || (cell.x>0.49&&cell.x<0.51) || cell.y < 0.05) ? 1.0 : 0.0;
     

    // Farbindex berechnen → welches Pattern-Element?
    int cellX = int(floor(grid.x));
    int cellY = int(floor(grid.y));

    // Pattern-Farbzuordnung
    vec3 baseColor = vec3(.4,0.4,0.4);//(cellX % seq, cellY % pat);
     baseColor.x=cellX%seq==0?.5:0.;

    // Hintergrundfarbe = gemischte Zellenfarbe
    vec3 col = mix(baseColor * 0.3, baseColor, 1.0 - gridLine);

    // Aktiver Step fett highlighten
    if (cellX == int(stepIndex) && cellY == int(rowIndex)) {
if(fract(beat)<0.5){
        col = cell.x<0.5?vec3(.7,.7,.1):baseColor; 
        }else{
        col = cell.x<0.5?baseColor:vec3(.7,.7,.1); 
        }
    }
    
    int pos=cellX+(pat*seq)*cellY;
    for(int k =0;k<NUM_MARKER;k++){
    if(marker[k]==pos){  
    col = vec3( .2, 1.0, 0.2); // Knallgruen
    
    }
    }
    if(pos>numpatterns*seq*pat){
        col=vec3(0);
    }

    i =mix(i, vec4(col, 1.0),0.7);



}
