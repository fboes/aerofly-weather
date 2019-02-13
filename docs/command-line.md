![](./favicon-64x64.png) Usage of Command Line Tools
====================================================

The command line tools allow for automatization in fetching METAR data.

Installation
------------

1. This tool requires Windows, Mac OSX or Linux.
1. Install [Node.js](https://nodejs.org/) with at least version 10.
1. Open the Command Prompt / Terminal application already installed on your computer.
1. Type `npm install -g aerofly-weather` and hit `ENTER` to install Aerofly-Weather (AeroWX).
1. Optional: Type `aerowx-make-batch` and hit `ENTER` to create the main batch file on your desktop.

Usage of desktop batch file
---------------------------

![](aerofly-weather-desktop.png)

You will need a copy of IPACS' Aerofly FS 2 which has run at least once. This creates a file called `main.mcf`, which contains all settings and the weather data in Aerofly FS 2. This file will be modified by the tools supplied with this package.

Click on the desktop file called `aerowx-weather.bat` / `aerowx-weather.sh` and follow the on-screen instructions. Basically it offers you to:

* Set weather data from a [METAR weather string](metar.md).
* Fetch weather data by [ICAO airport code](https://en.wikipedia.org/wiki/ICAO_airport_code) via the [AVWX API](https://avwx.rest/) and set the weather accordingly.
* Fetch weather data by [ICAO airport code](https://en.wikipedia.org/wiki/ICAO_airport_code) via the [CheckWX API](https://www.checkwx.com/) and set the weather accordingly. This method requires a CheckWX API key.

Whenever you are asked for an ICAO code, you may supply `DEP` / `ARR` instead to get your last Aerofly FS 2 flightplan departure / arrival airport.

The desktop batch file also contains some settings for the tools. If you want to edit the desktop batch file, just right click on it and select "Edit". 

Update
------

1. To find out if your installation of Aerofly-Weather needs updating, run `npm outdated -g aerofly-weather`.
2. Run `npm update -g aerofly-weather` to update your local Aerofly-Weather installation to the latest stable release.
3. Optional: Use `aerowx-make-batch` to create a new batch file on your desktop.

CLI commands
------------

The command line tools allow for a number of ways to get METAR information into IPACS' Aerofly FS 2, depending on your [source of METAR information](./metar.md):

* [`aerowx-metar [METAR]`](../bin/aerowx-metar):  
  Insert the [METAR information](./metar.md) into your configuration file, with `[METAR]` being a valid METAR forecast string enclosed in quotes.
* [`aerowx-metar-url [URL]`](../bin/aerowx-metar-url):  
  Fetch [METAR information](./metar.md) from an `[URL]`. The URL method may be used with a METAR API which supplies _raw_ or _JSON_ METAR information.
* [`aerowx-metar-fetch [ICAO] [AEROWX_URL]`](../bin/aerowx-metar-fetch):  
  Works like `aerowx-metar-url`, but the `[ICAO]` code will be pasted into `[AEROWX_URL]` at the position where the URL contains `XXXX`. This may be useful if you are querying the same URL again and again, but with different ICAO codes.
* [`aerowx-checkwx [ICAO-CODE] [CHECKWX_APIKEY]`](../bin/aerowx-checkwx):  
  Fetch [METAR information](./metar.md) supplied by https://api.checkwx.com/. You will need a valid `[CHECKWX_APIKEY]` from https://api.checkwx.com/, and supply the `[ICAO-CODE]` of your selected airport.

Whenever you are asked for an ICAO code, you may supply `DEP` / `ARR` instead to get your last Aerofly FS 2 flightplan departure / arrival airport.

There is an extend documentation for each command line tool by appending `--help`. There are extra options which lets you manipulate time, day and flightplan settings.

Examples for command line tool integrations
-------------------------------------------

### Microsoft Windows

* [`aerowx-weather.bat`](scripts/aerowx-weather.bat): Interactive menu, will be used for desktop batch file.
* [`aerowx-metar.bat`](scripts/aerowx-metar.bat): Ask user every time for METAR string.
* [`aerowx-checkwx.bat`](scripts/aerowx-checkwx.bat): Ask user every time for ICAO code to fetch METAR information from CheckWX.
* [`aerowx-metar-url.bat`](scripts/aerowx-metar-url.bat): Ask user every time for ICAO code to fetch METAR information from pre-defined URL.

### Linux / Mac OS X

* [`aerowx-weather.sh`](scripts/aerowx-weather.sh): Interactive menu, will be used for desktop batch file.
* [`aerowx-metar.sh`](scripts/aerowx-metar.sh): Ask user every time for METAR string.
* [`aerowx-checkwx.sh`](scripts/aerowx-checkwx.sh): Ask user every time for ICAO code to fetch METAR information from CheckWX.
* [`aerowx-metar-url.sh`](scripts/aerowx-metar-url.sh): Ask user every time for ICAO code to fetch METAR information from pre-defined URL.

Environment variables
---------------------

`aerowx-checkwx` requires you to enter your API key every time the command is executed. For convenience you may store your API key in a local environment variable called `CHECKWX_APIKEY`. 

`aerowx-metar-fetch` requires you to enter your base URL every time the command is executed. For convenience you may store your base URL in a local environment variable called `AEROWX_URL`. 

To set the environment variable use the following examples:

### Microsoft Windows

```batch
:: Replace '12345abcd' with your actual key
set  CHECKWX_APIKEY=12345abcd
setx CHECKWX_APIKEY %CHECKWX_APIKEY%

:: Replace 'https://example.com/metar/XXXX' with your actual URL
set  AEROWX_URL=https://example.com/metar/XXXX
setx AEROWX_URL %AEROWX_URL%
```

### Linux / Mac OS X

```bash
# Replace '12345abcd' with your actual key
CHECKWX_APIKEY=12345abcd
echo "export CHECKWX_APIKEY=${CHECKWX_APIKEY}" >> ~/.profile
echo "export CHECKWX_APIKEY=${CHECKWX_APIKEY}" >> ~/.bash_profile

# Replace 'https://example.com/metar/XXXX' with your actual URL
AEROWX_URL=https://example.com/metar/XXXX
echo "export AEROWX_URL=${AEROWX_URL}" >> ~/.profile
echo "export AEROWX_URL=${AEROWX_URL}" >> ~/.bash_profile
```

Add data from `STDIN`
---------------------

For Linux / Mac OS X: `aerowx-weather` tools do not accept input from `STDIN`. To remedy this shortcoming pipe `STDIN` into a variable:

```bash
METAR=$(cat METAR.txt)
aerowx-metar $METAR

```

---

Return to [table of contents](README.md).
