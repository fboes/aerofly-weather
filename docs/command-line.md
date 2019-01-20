Usage of Command Line Tools
==================

The command line tools allow for a number of ways to get METAR information into IPACS' Aerofly FS 2, depending on your [source of METAR information](./metar.md):

* [`aewx-metar [METAR]`](../bin/aewx-metar):  
  Insert the [METAR information](./metar.md) into your configuration file, with `[METAR]` being a valid METAR forecast string enclosed in quotes.
* [`aewx-metar-url [URL]`](../bin/aewx-metar-url):  
  Fetch [METAR information](./metar.md) from an `[URL]`. The URL method may be used with a METAR API which supplies _raw_ METAR information.
* [`aewx-metar-fetch [ICAO] [AEWX_URL]`](../bin/aewx-metar-fetch):  
  Works like `aewx-metar-url`, but `[ICAO]` code will pasted into `[AEWX_URL]` at the point where the URL contains `XXXX`. This may be useful if you are querying the same URL again and again, but with different ICAO codes.
* [`aewx-checkwx [ICAO-CODE] [CHECKWX_APIKEY]`](../bin/aewx-checkwx):  
  Fetch [METAR information](./metar.md) supplied by https://api.checkwx.com/. You will need a valid `[CHECKWX_APIKEY]` from https://api.checkwx.com/, and supply the `[ICAO-CODE]` from your selected airport.

There is an extend documentation for each command line tool by appending `--help`.

Examples for command line tool integrations
-------------------------------------------

### Microsoft Windows

* [`aewx-weather.bat`](scripts/aewx-weather.bat): Interactive menu, will be used for desktop batch file.
* [`aewx-metar.bat`](scripts/aewx-metar.bat): Ask user every time for METAR string.
* [`aewx-checkwx.bat`](scripts/aewx-checkwx.bat): Ask user every time for ICAO code to fetch METAR information from CheckWX.
* [`aewx-metar-url.bat`](scripts/aewx-metar-url.bat): Ask user every time for ICAO code to fetch METAR information from pre-defined URL.

### Linux / Mac OS X

* [`aewx-weather.sh`](scripts/aewx-weather.sh): Interactive menu, will be used for desktop batch file.
* [`aewx-metar.sh`](scripts/aewx-metar.sh): Ask user every time for METAR string.
* [`aewx-checkwx.sh`](scripts/aewx-checkwx.sh): Ask user every time for ICAO code to fetch METAR information from CheckWX.
* [`aewx-metar-url.sh`](scripts/aewx-metar-url.sh): Ask user every time for ICAO code to fetch METAR information from pre-defined URL.

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

---

Return to [table of contents](README.md).
