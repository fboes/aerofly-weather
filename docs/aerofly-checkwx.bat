@echo off
cd "%userprofile%\Documents\Aerofly FS 2"
copy main.mcf main.bak

rem Replace 12345abcd with actual API key
set CHECKWX_APIKEY=12345abcd
set /p ICAO=Enter ICAO code:

call aerofly-checkwx %ICAO% %CHECKWX_APIKEY% --verbose
pause

rem start steam://rungameid/434030
