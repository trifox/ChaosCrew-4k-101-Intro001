@echo off
setlocal

REM === Konfigurationen ===
set BUILD_CONFIG=Release
set BUILD_PLATFORM=win32
set SLN_FILE=pbr-leviathan-2.0.sln

REM === MSVC Umgebung setzen (VS2017) ===
call "%ProgramFiles(x86)%\Microsoft Visual Studio\2017\Community\VC\Auxiliary\Build\vcvars64.bat"
if errorlevel 1 (
    echo [ERROR] vcvars64.bat konnte nicht geladen werden.
    exit /b 1
)

REM === msbuild prüfen ===
where msbuild >nul 2>&1
if errorlevel 1 (
    echo [WARNUNG] msbuild nicht gefunden. Versuche cl.exe...
    goto :CL_BUILD
)

REM === Solution existiert? ===
if exist "%SLN_FILE%" (
    echo [INFO] Baue %SLN_FILE% mit msbuild...
    msbuild "%SLN_FILE%" /p:Configuration=%BUILD_CONFIG% /p:Platform=%BUILD_PLATFORM% /p:AdditionalDependencies="ucrt.lib;legacy_stdio_definitions.lib;%(AdditionalDependencies)"  
    goto :EOF
)

:CL_BUILD
REM === Fallback: Gibt es main.cpp? ===
if exist main.cpp (
    echo [INFO] Fallback: Baue main.cpp mit cl.exe...

    cl /std:c++17 /EHsc main.cpp /Fe:leviathan.exe
    if errorlevel 1 (
        echo [FEHLER] Build mit cl.exe fehlgeschlagen.
        exit /b 1
    )
    echo [FERTIG] leviathan.exe wurde erstellt.
    goto :EOF
)

echo [FEHLER] Keine passende Solution oder main.cpp gefunden.
exit /b 1
dir out