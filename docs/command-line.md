Usage of Command Line Tools
==================

The command line tools allow for a number of ways to get METAR information into IPACS' Aerofly FS 2, depending on your [source of METAR information](./metar.md):

* `aewx-metar [METAR]`:  
  Insert the [METAR information](./metar.md) into your configuration file, with `[METAR]` being a valid METAR forecast string enclosed in quotes.
* `aewx-metar-url [URL]`:  
  Fetch [METAR information](./metar.md) from an `[URL]`. The URL method may be used with a METAR API which supplies _raw_ METAR information.
* `aewx-metar-fetch [ICAO] [AEWX_URL]`:  
  Works like `aewx-metar-url`, but `[ICAO]` code will pasted into `[AEWX_URL]` at the point where the URL contains `XXXX`. This may be useful if you are querying the same URL again and again, but with different ICAO codes.
* `aewx-checkwx [ICAO-CODE] [CHECKWX_APIKEY]`:  
  Fetch [METAR information](./metar.md) supplied by https://api.checkwx.com/. You will need a valid `[CHECKWX_APIKEY]` from https://api.checkwx.com/, and supply the `[ICAO-CODE]` from your selected airport.

These parameters will work with `aewx-metar`, `aewx-metar-url` and `aewx-checkwx`:

* `[FILE]`: Every command accepts a last parameter to specify the file location. By default this will be `main.mcf` in the current directory. You may want to supply `"%userprofile%\Documents\Aerofly FS 2\main.mcf"` (Microsoft Windows) to change your `main.mcf` regardless of your current directory.
* `--hours=<ZZ>`: Change time copied from METAR information to Aerofly FS 2 by `ZZ` hours. Add `-` for negative values.
* `--time=<HH:MM+ZZ:ZZ>`: Set time to HH:MM+ZZ:ZZ in Aerofly FS 2, e.g. `12:30-08:00`. Remember to include the time zone, else the time will be interpreted as UTC time.
* `--date=<YYYY-MM-DD>`: Set date to YYYY-MM-DD in Aerofly FS 2, e.g. `2018-12-31`.
* `--flightplan`: Delete currently active flightplan if departure or arrival does not match METAR ICAO code.
* `--verbose`: Output extra information about found and parsed data.
* `--help`: Show help information about tool.

There is an extend documentation for each command line tool by appending `--help`.

Examples for command line tool integrations
-------------------------------------------

### Microsoft Windows

* [`aewx-weather.bat`](aewx-weather.bat): Interactive menu, will be used for desktop batch file.
* [`aewx-metar.bat`](aewx-metar.bat): Ask user every time for METAR string.
* [`aewx-checkwx.bat`](aewx-checkwx.bat): Ask user every time for ICAO code to fetch METAR information from CheckWX.
* [`aewx-metar-url.bat`](aewx-metar-url.bat): Ask user every time for ICAO code to fetch METAR information from pre-defined URL.

### Linux / Mac OS X

* [`aewx-weather.sh`](aewx-weather.sh): Interactive menu, will be used for desktop batch file.
* [`aewx-metar.sh`](aewx-metar.sh): Ask user every time for METAR string.
* [`aewx-checkwx.sh`](aewx-checkwx.sh): Ask user every time for ICAO code to fetch METAR information from CheckWX.
* [`aewx-metar-url.sh`](aewx-metar-url.sh): Ask user every time for ICAO code to fetch METAR information from pre-defined URL.

Environment variables
---------------------

`aewx-checkwx` requires you to enter your API key every time the command is executed. For convenience you may store your API key in a local environment variable called `CHECKWX_APIKEY`. 

`aewx-metar-fetch` requires you to enter your base URL every time the command is executed. For convenience you may store your base URL in a local environment variable called `AEWX_URL`. 

To set the environment variable use the following examples:

### Microsoft Windows

```batch
:: Replace '12345abcd' with your actual key
set  CHECKWX_APIKEY=12345abcd
setx CHECKWX_APIKEY %CHECKWX_APIKEY%

:: Replace 'https://example.com/metar/XXXX' with your actual URL
set  AEWX_URL=https://example.com/metar/XXXX
setx AEWX_URL %AEWX_URL%
```

### Linux / Mac OS X

```bash
# Replace '12345abcd' with your actual key
CHECKWX_APIKEY=12345abcd
echo "export CHECKWX_APIKEY=${CHECKWX_APIKEY}" >> ~/.profile
echo "export CHECKWX_APIKEY=${CHECKWX_APIKEY}" >> ~/.bash_profile

# Replace 'https://example.com/metar/XXXX' with your actual URL
AEWX_URL=https://example.com/metar/XXXX
echo "export AEWX_URL=${AEWX_URL}" >> ~/.profile
echo "export AEWX_URL=${AEWX_URL}" >> ~/.bash_profile
```

Add data from `STDIN`
---------------------

For Linux / Mac OS X: All `aewx-weather` tools do not accept input from `STDIN`. To remedy this shortcoming pipe `STDIN` into a variable:

```bash
METAR=$(cat METAR.txt)
aewx-metar $METAR

```
