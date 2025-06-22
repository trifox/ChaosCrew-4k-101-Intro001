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
