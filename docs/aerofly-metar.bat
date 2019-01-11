@ECHO OFF
CD "%userprofile%\Documents\Aerofly FS 2"
COPY main.mcf main.bak

SET /p METAR=Enter METAR:
CALL aerofly-metar %METAR% --verbose

PAUSE
START steam://rungameid/434030
