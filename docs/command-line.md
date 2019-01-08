Command line magic
==================

Desktop shortcuts
-----------------

Desktop shortcuts make your every-day start-up more accessible. METAR information will be copied to Aerofly FS 2 by just clicking on a small file on your desktop.

### Microsoft Windows

To enable a desktop shortcut, you will have to create it:

1. Right click on your desktop > "New" > "Text Document".
2. Name the new document `metar.txt`.
3. Open the text document and paste the code example below in there.
4. Right click on `metar.txt` > "Rename" > `metar.bat`.

Batch code example for `aerofly-metar`:

```batch
cd "%userprofile%\Documents\Aerofly FS 2"
copy main.mcf main.bak
set /p METAR=Enter METAR: 
aerofly-metar %METAR% --verbose
pause
```

Batch code example for `aerofly-checkwx`, replacing `12345abcd` with your actual API key:

```batch
cd "%userprofile%\Documents\Aerofly FS 2"
copy main.mcf main.bak
set /p ICAO=Enter ICAO code: 
aerofly-checkwx %ICAO% 12345abcd --verbose
pause
```

After you have created `metar.bat`, double-clicking this file starts the METAR copy process.

Environment variables
---------------------

`aerofly-checkwx` requires you to enter your API key every time the command is executed. For convenience you may store your API key in a local environment variable called `CHECKWX_APIKEY`. To set the environment variable use the following examples, replacing `12345abcd` with your actual key:

### Microsoft Windows

```bash
SET  CHECKWX_APIKEY=12345abcd
SETX CHECKWX_APIKEY 12345abcd
```

### Linux / Mac OS X

```bash
echo "export CHECKWX_APIKEY=12345abcd" >> ~/.profile
echo "export CHECKWX_APIKEY=12345abcd" >> ~/.bash_profile
```
