# Acknowledgments

- mnandelbrot roots feature database from this thread https://fractalforums.org/collaborations-and-jobs/6/mandelbrot-roots-challenge/4865/msg35192#new

# How to build

the idea is to only be able to build project without visualstudio installation

current build though is made upon locally installed visual studio some packages are
installed, the build follows original build dependencies https://github.com/armak/Leviathan-2.0

the build.bat file is used to calling the msbuild directly creating the so much desired
executables, build tools 2017 should be sufficent

# How To Make Sound

when music changes the following needs to be done

sointu-compile -o . -arch=386 sointu/song_000.yml
nasm -f win32 sointu/song_000.asm

## For christians path it would be like

compile sointu yaml to asm

    C:\Users\ck\Downloads\sointu-Windows\sointu-compile.exe -arch=386 .\song_000.yml

compile asm to obj

    C:\Users\ck\AppData\Local\bin\NASM\nasm.exe -f win32 .\src\sointu\song_000.asm

When you change the name or path of the song, all vcxproj and include pathes need to be adjusted as well

Working sheet for timings in intro with musik>

1 Beat = 4/4
1/2 Beat = 8/8
Takt= 4 Beat
Pattern = 4 Takt

// Intro
2 Beats Wubeel Sound
4 beats geht main drum los ( alle 4 beats)
8ter Takt geht erste 9er Sequenc Los
14ter Takt geht 2te 9er sequenc los
20er takt geht 3te 9er sequenc los
20 bis 32 kommt lange sequence also 2 zusammen
32 bis 50 lange sequence
50 bis 52 dann outtro


## minimize tips

- use float without dot notation, casting works in glsl mode we use here

   1.  = 1 or one
   1.0 = 1 or one
   0.0 = 0 or zero
   .0  = 0 or zero
   0.  = 0 or zero


