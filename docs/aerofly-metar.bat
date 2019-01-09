@echo off
cd "%userprofile%\Documents\Aerofly FS 2"
copy main.mcf main.bak
set /p METAR=Enter METAR:
call aerofly-metar %METAR% --verbose
pause
rem start steam://rungameid/434030
