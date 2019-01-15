@ECHO OFF
CD "%userprofile%\Documents\Aerofly FS 2"
COPY main.mcf main.bak

: Replace 12345abcd with actual API key
SET CHECKWX_APIKEY=12345abcd
SET /p ICAO=Enter ICAO code:
CALL aewx-checkwx %ICAO% %CHECKWX_APIKEY% --verbose

PAUSE
START steam://rungameid/434030
