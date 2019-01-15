@ECHO OFF

:: Change variables to fit your local settings
SET CHECKWX_APIKEY=
SET MCF_LOCATION="%userprofile%\Documents\Aerofly FS 2"

:: Change directory
PUSHD %MCF_LOCATION%

:: Backup
ECHO Backup of main.mcf
COPY /Y main.mcf main.bak

:: https://stackoverflow.com/questions/9307512/create-a-batch-file-with-multiple-options
:Menu
  ECHO.
  ECHO Get Aerofly FS 2 weather data from...
  ECHO 1. METAR input  (METAR string required)
  ECHO 2. METAR URL    (ICAO code required)
  ECHO 3. CheckWX      (ICAO code required)
  ECHO.
  ECHO 4. Start Aerofly FS 2
  ECHO 5. Quit
  ECHO.

  CHOICE /C 12345 /M "Select option "

  :: Note - list ERRORLEVELS in decreasing order
  IF ERRORLEVEL 5 GOTO End
  IF ERRORLEVEL 4 GOTO Aerofly
  IF ERRORLEVEL 3 GOTO MetarCheckWX
  IF ERRORLEVEL 2 GOTO MetarURL
  IF ERRORLEVEL 1 GOTO Metar

:Metar
  CALL aewx-metar --verbose
  ECHO -------------------------------------------------------
  GOTO Menu

:MetarURL
  CALL aewx-metar-url --verbose
  ECHO -------------------------------------------------------
  GOTO Menu

:MetarCheckWX
  CALL aewx-checkwx --verbose
  ECHO -------------------------------------------------------
  GOTO Menu

:Aerofly
  START steam://rungameid/434030
  GOTO End

:End
POPD
