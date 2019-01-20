@ECHO OFF
CD "%userprofile%\Documents\Aerofly FS 2"
COPY main.mcf main.bak

:: Replace https://3960.org/metar/XXXX.txt with actual API key
SET AEWX_URL=https://3960.org/metar/XXXX.txt
SET /p ICAO=Enter ICAO code ?
CALL aewx-metar-fetch %ICAO% %AEWX_URL% --verbose

PAUSE
START steam://rungameid/434030
