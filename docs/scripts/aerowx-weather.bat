@ECHO OFF

:: Change variables to fit your local settings
SET CHECKWX_APIKEY=
SET MCF_LOCATION="%userprofile%\Documents\Aerofly FS 2"
SET AVWX_URL="http://avwx.rest/api/metar/XXXX?options=&format=json&onfail=cache"
SET AEROWX_OPTIONS=

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
  ECHO 2. AVWX         (ICAO code required)
  ECHO 3. CheckWX      (ICAO code required)
  ECHO 4. Help
  ECHO.
  ECHO 5. Start Aerofly FS 2 (Steam)
  ECHO 6. Quit
  ECHO.

  CHOICE /C 123456 /M "Select option "

  :: Note - list ERRORLEVELS in decreasing order
  IF ERRORLEVEL 6 GOTO End
  IF ERRORLEVEL 5 GOTO Aerofly
  IF ERRORLEVEL 4 GOTO Help
  IF ERRORLEVEL 3 GOTO MetarCheckWX
  IF ERRORLEVEL 2 GOTO MetarAVWX
  IF ERRORLEVEL 1 GOTO Metar

:Metar
  CALL aerowx-metar %AEROWX_OPTIONS%
  ECHO -------------------------------------------------------
  GOTO Menu

:MetarAVWX
  CALL aerowx-metar-fetch "" %AVWX_URL% --response=json %AEROWX_OPTIONS%
  ECHO -------------------------------------------------------
  GOTO Menu

:MetarCheckWX
  CALL aerowx-checkwx %AEROWX_OPTIONS%
  ECHO -------------------------------------------------------
  GOTO Menu

:Help
  START https://www.npmjs.com/package/aerofly-weather
  GOTO Menu

:Aerofly
  START steam://rungameid/434030
  GOTO End

:End
POPD
