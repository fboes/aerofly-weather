@ECHO OFF
CD "%userprofile%\Documents\Aerofly FS 2"
COPY main.mcf main.bak

:: Replace https://3960.org/metar/XXXX.txt with actual API key
SET AEROWX_URL=https://3960.org/metar/XXXX.txt
SET /p ICAO=Enter ICAO code ?
CALL aerowx-metar-fetch %ICAO% %AEROWX_URL% --verbose

PAUSE
START steam://rungameid/434030
