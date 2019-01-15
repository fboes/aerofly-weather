@ECHO OFF
CD "%userprofile%\Documents\Aerofly FS 2"
COPY main.mcf main.bak

SET METAR_URL=https://3960.org/metar/
SET METAR_URL_END=.txt
SET /p ICAO=Enter ICAO code ?
CALL aewx-metar-url %METAR_URL%%ICAO%%METAR_URL_END% --verbose

PAUSE
START steam://rungameid/434030
