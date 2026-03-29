// custom build and feature flags
#ifdef DEBUG
	#define OPENGL_DEBUG        1
	#define FULLSCREEN          0
	#define DESPERATE           0
	#define BREAK_COMPATIBILITY 0
#else
	#define OPENGL_DEBUG        0
	#define FULLSCREEN          1
	#define DESPERATE           0
	#define BREAK_COMPATIBILITY 0
#endif

#define POST_PASS    0
#define USE_MIPMAPS  0
#define USE_VSYNC    0 /* vsync dangerous, make sure you never exceeed 60fps when using */
#define USE_CLEAN_BLACK_START    0 /* ensures windows and gl buffers are properly cleared at start to avoid flicker */
#define USE_AUDIO    1
#define NO_UNIFORMS  0
#define DELAY_SOUND  0 // damit steuern wir ob eine kuenstliche pause vor songstart kommt, das intro laeuft dann schon! achtung geht garnicht
#define DELAY 12.*(60./BPM)

#include "definitions.h"
#if OPENGL_DEBUG
	#include "debug.h"
#endif

#include "glext.h"
#include "shaders/fragment.inl"
#if POST_PASS
	#include "shaders/post.inl"
#endif

#pragma data_seg(".pids")
// static allocation saves a few bytes
static int pidMain;
static int pidPost;
// static HDC hDC;

#ifndef EDITOR_CONTROLS
#pragma code_seg(".main")
void entrypoint(void)
#else
#include "editor.h"
#include "song.h"
int __cdecl main(int argc, char* argv[])
#endif
{
	#ifdef EDITOR_CONTROLS
	char *endptr;
    double wert = strtod(argv[1], &endptr);

    if (*endptr != '\0') {
        printf("Fehler: '%s' ist keine gültige Kommazahl.\n", argv[1]);
        return 1;
    }

    printf("Bpm: %f Secs Per Beat %f\n",BPM,60./BPM);
    printf("Eingegebener Beat: %f\n", wert);
    printf("Editor Controls Hint: \n");
    printf("WINDOWS KEY = MENU \n");
    printf("MENU + UP/DOWN: Play/Pause\n");
    printf("MENU + LEFT/RIGHT: time +/- 0.1sec \n");
    printf("MENU + SHIFT LEFT/RIGHT: time +/- 1sec \n"); 

	SONG_START=wert*(60./BPM);
	
	#endif
	// initialize window
	#if FULLSCREEN
	
		// ... in WinMain oder main:
		ChangeDisplaySettings(&screenSettings, CDS_FULLSCREEN);
		ShowCursor(0);
		const HWND hwnd = CreateWindow((LPCSTR)0xC018, 0, WS_POPUP  | WS_MAXIMIZE, 0, 0, 0, 0, 0, 0, 0, 0);
		const HDC hDC = GetDC(hwnd);
		#ifdef USE_CLEAN_BLACK_START
		// byte size: 
				RECT rect;
				GetClientRect(hwnd, &rect);
				HBRUSH blackBrush = (HBRUSH)GetStockObject(WHITE_BRUSH);
				FillRect(hDC, &rect, blackBrush);
						
				// 1. Setze Clear Color auf Schwarz
				glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
				// 2. Lösche den Farb-Puffer (Backbuffer)
				glClear(GL_COLOR_BUFFER_BIT);
				// 3. Präsentiere den Frame (flippt Backbuffer in den Frontbuffer)
				SwapBuffers(hDC);
				
				// 5. Fenster sichtbar machen
				ShowWindow(hwnd, SW_SHOW);
				UpdateWindow(hwnd);
		#endif
		#else
		#ifdef EDITOR_CONTROLS
			HWND window = CreateWindow("static", 0, WS_POPUP | WS_VISIBLE, 0, 0, XRES, YRES, 0, 0, 0, 0);
			HDC hDC = GetDC(window);
		#else
			// you can create a pseudo fullscreen window by similarly enabling the WS_MAXIMIZE flag as above
			// in which case you can replace the resolution parameters with 0s and save a couple bytes
			// this only works if the resolution is set to the display device's native resolution
			HDC hDC = GetDC(CreateWindow((LPCSTR)0xC018, 0, WS_POPUP | WS_VISIBLE, 0, 0, XRES, YRES, 0, 0, 0, 0));
		#endif
	#endif

	// initalize opengl context
	SetPixelFormat(hDC, ChoosePixelFormat(hDC, &pfd), &pfd);
	wglMakeCurrent(hDC, wglCreateContext(hDC));

	#if USE_VSYNC
    // Hier VSync aktivieren / achtung gefaehrlich darf nie unter 60fps sinken sonst shite
    EnableVSync(TRUE);

 	#endif
	// create and compile shader programs
	pidMain = ((PFNGLCREATESHADERPROGRAMVPROC)wglGetProcAddress("glCreateShaderProgramv"))(GL_FRAGMENT_SHADER, 1, &fragment_frag);
	#if POST_PASS
		pidPost = ((PFNGLCREATESHADERPROGRAMVPROC)wglGetProcAddress("glCreateShaderProgramv"))(GL_FRAGMENT_SHADER, 1, &post_frag);
	#endif

	
	// initialize sound
	#ifndef EDITOR_CONTROLS
		#if USE_AUDIO
			CreateThread(0, 0, (LPTHREAD_START_ROUTINE)_4klang_render, lpSoundBuffer, 0, 0);
			// sleep a bit to let music render

			Sleep(768);
			#if not DELAY_SOUND
				waveOutOpen(&hWaveOut, WAVE_MAPPER, &WaveFMT, NULL, 0, CALLBACK_NULL);
				waveOutPrepareHeader(hWaveOut, &WaveHDR, sizeof(WaveHDR));
				waveOutWrite(hWaveOut, &WaveHDR, sizeof(WaveHDR));
			#endif
		#endif
	#else
		Leviathan::Editor editor = Leviathan::Editor();
		editor.updateShaders(&pidMain, &pidPost, true);
		// sleep a bit to simulate productive code
		Sleep(768);

		// absolute path always works here
		// relative path works only when not ran from visual studio directly
		Leviathan::Song track(L"audio.wav");
		
		#if DELAY_SOUND
			track.pause();
		#else
			track.play();
		#endif
		double position = 0.0;
	#endif

	#if DELAY_SOUND
		DWORD start = GetTickCount();   // ms zum start fuer zeitmessung
	#endif
	bool playingxxx=false;
	// main loop
	do
	{
		#ifndef EDITOR_CONTROLS
			#if USE_AUDIO
				#if DELAY_SOUND
				DWORD elapsed = GetTickCount() - start;
				// fixed delay here, 12 beats 3 takte 
				if(!playingxxx && (elapsed)/1000.>DELAY)
				{
					playingxxx=true;
					waveOutOpen(&hWaveOut, WAVE_MAPPER, &WaveFMT, NULL, 0, CALLBACK_NULL);
					waveOutPrepareHeader(hWaveOut, &WaveHDR, sizeof(WaveHDR));
					waveOutWrite(hWaveOut, &WaveHDR, sizeof(WaveHDR));
				}
				#endif
		#endif


		#else
		
			#if DELAY_SOUND
				DWORD elapsed = GetTickCount() - start;
				// fixed delay here, 12 beats 3 takte 
				if(!playingxxx && (elapsed)/1000.>DELAY)
				{
					playingxxx=true;
					
				  track.play();
				}
			#endif

		#endif


		#ifdef EDITOR_CONTROLS
			editor.beginFrame(timeGetTime());
		#endif

		#if !(DESPERATE)
			// do minimal message handling so windows doesn't kill your application
			// not always strictly necessary but increases compatibility and reliability a lot
			// normally you'd pass an msg struct as the first argument but it's just an
			// output parameter and the implementation presumably does a NULL check
			PeekMessage(0, 0, 0, 0, PM_REMOVE);
		#endif

		// render with the primary shader
		((PFNGLUSEPROGRAMPROC)wglGetProcAddress("glUseProgram"))(pidMain);
		#ifndef EDITOR_CONTROLS
			// if you don't have an audio system figure some other way to pass time to your shader
			#if USE_AUDIO
				waveOutGetPosition(hWaveOut, &MMTime, sizeof(MMTIME));
				// it is possible to upload your vars as vertex color attribute (gl_Color) to save one function import
				#if NO_UNIFORMS
					glColor3ui(MMTime.u.sample, 0, 0);
				#else
					// remember to divide your shader time variable with the SAMPLE_RATE (44100 with 4klang)
					((PFNGLUNIFORM1IPROC)wglGetProcAddress("glUniform1i"))(0, MMTime.u.sample);
				#endif
			#endif
		#else
			#if DELAY_SOUND 
			printf("%i Elapsed is %i %f ",start,elapsed,elapsed/1000.);
				position=(elapsed)/1000. ;
			//	printf("position is %f ",position);
			#else
				position = track.getTime();
			#endif
			((PFNGLUNIFORM1IPROC)wglGetProcAddress("glUniform1i"))(0, (static_cast<int>(position*44100.0)));
		#endif
		glRects(-1, -1, 1, 1);

		// render "post process" using the opengl backbuffer
		#if POST_PASS
			glBindTexture(GL_TEXTURE_2D, 1);
			#if USE_MIPMAPS
				glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
				glCopyTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA8, 0, 0, XRES, YRES, 0);
				((PFNGLGENERATEMIPMAPPROC)wglGetProcAddress("glGenerateMipmap"))(GL_TEXTURE_2D);
			#else
				glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
				glCopyTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA8, 0, 0, XRES, YRES, 0);
			#endif
			((PFNGLACTIVETEXTUREPROC)wglGetProcAddress("glActiveTexture"))(GL_TEXTURE0);
			((PFNGLUSEPROGRAMPROC)wglGetProcAddress("glUseProgram"))(pidPost);


			#ifdef EDITOR_CONTROLS
				// for editing position of time is provided in post pass

				#if DELAY_SOUND 
				printf("%i Elapsed is %i %f ",start,elapsed,elapsed/1000.);
				if(!playingxxx){
					position=(elapsed)/1000. ;
				}else{
					position = track.getTime()+DELAY;

				}
				//	printf("position is %f ",position);
				#else
					position = track.getTime();
				#endif
				((PFNGLUNIFORM1IPROC)wglGetProcAddress("glUniform1i"))(0, (static_cast<int>(position*44100.0)));
			#else
				// warning post process is expensive, setting time as well
				//waveOutGetPosition(hWaveOut, &MMTime, sizeof(MMTIME)); 
				((PFNGLUNIFORM1IPROC)wglGetProcAddress("glUniform1i"))(0, MMTime.u.sample);
			#endif
			glRects(-1, -1, 1, 1);
		#endif

		SwapBuffers(hDC);

		// handle functionality of the editor
		#ifdef EDITOR_CONTROLS
			editor.endFrame(timeGetTime());
			position = editor.handleEvents(&track, position);
			editor.printFrameStatistics();
			editor.updateShaders(&pidMain, &pidPost);
		#endif

	} while(!GetAsyncKeyState(VK_ESCAPE)
		#if USE_AUDIO
			&& MMTime.u.sample < MAX_SAMPLES
		#endif
	);

	ExitProcess(0);
}
