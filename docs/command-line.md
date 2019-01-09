Command line magic
==================

Create a new desktop batch file
-------------------------------

A batch file on your desktop called `aerofly-weather.bat` will make your every-day start-up more accessible. METAR information will be copied to Aerofly FS 2 by just double-clicking this batch file.

The easiest way to create a batch file is to trigger `aerofly-make-batch` from a command line prompt. 

Batch file examples
-------------------

### Microsoft Windows

* [`aerofly-metar.bat`](aerofly-metar.bat): Ask user every time for METAR string.
* [`aerofly-checkwx.bat`](aerofly-checkwx.bat): Ask user every time for ICAO code to fetch METAR information from CheckWx.

### Linux / Mac OS X

* [`aerofly-metar.sh`](aerofly-metar.sh): Ask user every time for METAR string.
* [`aerofly-checkwx.sh`](aerofly-checkwx.sh): Ask user every time for ICAO code to fetch METAR information from CheckWx.

Create batch files manually
---------------------------

Below you will find detailed instructions on how to build desktop batch files manually:

### Microsoft Windows

To manually create a batch file on your desktop follow these steps:

1. Right click on your desktop > "New" > "Text Document".
2. Name the new document `aerofly-weather.txt`.
3. Open the text document and paste [`aerofly-metar.bat`](aerofly-metar.bat) or [`aerofly-checkwx.bat`](aerofly-checkwx.bat) in there.
4. Right click on `aerofly-weather.txt` > "Rename" > `aerofly-weather.bat`.

After you have created `aerofly-weather`, double-clicking this file starts the METAR copy process.

### Mac OSX

> Please note: This is untested. If this is working / not working for you, please supply [feedback](https://github.com/fboes/aerofly-weather/issues).

1. Open Automator
1. Click "Actions" in the top-left corner of the Automator window, then select "Utilities" in the Library.
2. Drag the "Ask for Text" action into your workflow. (Checked: Ignore this action's input; Checked: Require an answer)
2. Drag the "Set Value of Variable" action into your workflow. (Checked: Ignore this action's input; Checked: Require an answer)
2. Drag the "Run Shell Script" action into your workflow. Paste the code example from [`aerofly-metar.sh`](aerofly-metar.sh) or [`aerofly-checkwx.sh`](aerofly-checkwx.sh) into the Script Editor (Shell: /bin/bash; Pass input: as arguments)
4. After finishing, compile your command.

General CLI parameters
----------------------

These parameters will work with `aerofly-metar`, `aerofly-metar-url` and `aerofly-checkwx`:

* `[FILE]`: Every command accepts a last parameter to specify the file location. By default this will be `main.mcf` in the current directory. You may want to supply `"%userprofile%\Documents\Aerofly FS 2\main.mcf"` to change your `main.mcf` regardless of your current directory.
* `--hours=X`: Change time copied from METAR information to Aerofly FS 2 by `X` hours.
* `--time=<X>`: Set time to HH:MM+ZZ:ZZ in Aerofly FS 2, e.g. `12:30-08:00`. Remember to include the time zone, else the time will be interpreted as UTC time.
* `--date=<X>`: Set date to YYYY-MM-DD in Aerofly FS 2, e.g. `2018-12-31`.
* `--verbose`: Output extra information about found and parsed data.
* `--help`: Show help information about tool.

Environment variables
---------------------

`aerofly-checkwx` requires you to enter your API key every time the command is executed. For convenience you may store your API key in a local environment variable called `CHECKWX_APIKEY`. To set the environment variable use the following examples, replacing `12345abcd` with your actual key:

### Microsoft Windows

```batch
set  CHECKWX_APIKEY=12345abcd
setx CHECKWX_APIKEY %CHECKWX_APIKEY%
```

### Linux / Mac OS X

```bash
CHECKWX_APIKEY=12345abcd
echo "export CHECKWX_APIKEY=$CHECKWX_APIKEY" >> ~/.profile
echo "export CHECKWX_APIKEY=$CHECKWX_APIKEY" >> ~/.bash_profile
```
