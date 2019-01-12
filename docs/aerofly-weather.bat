@ECHO OFF

:: Change variables to fit your local settings
SET CHECKWX_APIKEY=
SET METAR_URL=
SET METAR_URL_END=
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
  ECHO 3. CheckWx      (ICAO code required)
  ECHO.
  ECHO 4. Start Aerofly FS 2
  ECHO 5. Quit
  ECHO.

  CHOICE /C 12345 /M "Select option "

  :: Note - list ERRORLEVELS in decreasing order
  IF ERRORLEVEL 5 GOTO End
  IF ERRORLEVEL 4 GOTO Aerofly
  IF ERRORLEVEL 3 GOTO MetarCheckWx
  IF ERRORLEVEL 2 GOTO MetarURL
  IF ERRORLEVEL 1 GOTO Metar

:Metar
  SET /p METAR=Enter METAR string      ?
  CALL aerofly-metar "%METAR%" --verbose
  ECHO -------------------------------------------------------
  GOTO Menu

:MetarURL
  IF "%METAR_URL%"=="" (
    ECHO Please set METAR_URL in line 5
    GOTO Menu
  )
  SET /p ICAO=Enter ICAO code          ?
  CALL aerofly-metar-url %METAR_URL%%ICAO%%METAR_URL_END% --verbose
  ECHO -------------------------------------------------------
  GOTO Menu

:MetarCheckWx
  IF "%CHECKWX_APIKEY%"=="" (
    ECHO Please set CHECKWX_APIKEY in line 4
    GOTO Menu
  )
  SET /p ICAO=Enter ICAO code          ?
  CALL aerofly-checkwx %ICAO% %CHECKWX_APIKEY% --verbose
  ECHO -------------------------------------------------------
  GOTO Menu

:Aerofly
  START steam://rungameid/434030
  GOTO End

:End
POPD
