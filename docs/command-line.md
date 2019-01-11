
Usage of Command Line Tools
==================

The command line tools allow for a number of ways to get METAR information into IPACS' Aerofly FS 2, depending on your [source of METAR information](./metar.md):

* `aerofly-metar [METAR]`:  
  Insert the [METAR information](./metar.md) into your configuration file, with `[METAR]` being a valid METAR forecast string enclosed in quotes.
* `aerofly-metar-url [URL]`:  
  Fetch [METAR information](./metar.md) from an `[URL]`. The URL method may be used with a METAR API which supplies _raw_ METAR information.
* `aerofly-checkwx [ICAO-CODE] [API-KEY]`:  
  Fetch [METAR information](./metar.md) supplied by https://api.checkwx.com/. You will need a valid `[API-KEY]` from https://api.checkwx.com/, and supply the `[ICAO-CODE]` from your selected airport.

These parameters will work with `aerofly-metar`, `aerofly-metar-url` and `aerofly-checkwx`:

* `[FILE]`: Every command accepts a last parameter to specify the file location. By default this will be `main.mcf` in the current directory. You may want to supply `"%userprofile%\Documents\Aerofly FS 2\main.mcf"` (Microsoft Windows) to change your `main.mcf` regardless of your current directory.
* `--hours=X`: Change time copied from METAR information to Aerofly FS 2 by `X` hours.
* `--time=<X>`: Set time to HH:MM+ZZ:ZZ in Aerofly FS 2, e.g. `12:30-08:00`. Remember to include the time zone, else the time will be interpreted as UTC time.
* `--date=<X>`: Set date to YYYY-MM-DD in Aerofly FS 2, e.g. `2018-12-31`.
* `--verbose`: Output extra information about found and parsed data.
* `--help`: Show help information about tool.

Examples for command line tool integrations
-------------------------------------------

### Microsoft Windows

* [`aerofly-weather.bat`](aerofly-weather.bat): Interactive menu, will be used for desktop batch file.
* [`aerofly-metar.bat`](aerofly-metar.bat): Ask user every time for METAR string.
* [`aerofly-checkwx.bat`](aerofly-checkwx.bat): Ask user every time for ICAO code to fetch METAR information from CheckWx.

### Linux / Mac OS X

* [`aerofly-weather.sh`](aerofly-weather.sh): Interactive menu, will be used for desktop batch file.
* [`aerofly-metar.sh`](aerofly-metar.sh): Ask user every time for METAR string.
* [`aerofly-checkwx.sh`](aerofly-checkwx.sh): Ask user every time for ICAO code to fetch METAR information from CheckWx.

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
