✈️ METAR weather importer for Aerofly FS 2
===========================================

Copy [METAR information](docs/metar.md) into IPCAS' Aerofly FS 2.

This tool will copy the following METAR information to your configuration file while Aerofly FS 2 is not running:

* Time and day (will set the year and month to current year and month because they are not present in METAR information)
* Wind & turbulences
* Thermal activity
* Clouds (height & density)

The [METAR information](docs/metar.md) can be supplied manually, or can be fetched from an URL.

This tool is capable of settings weather values which are not accessible in Aerofly FS 2. This is done deliberately. Please supply [feedback](https://github.com/fboes/aerofly-weather/issues) in case of any strange effects you encounter.


Installation
------------

1. This tool requires Windows, Mac OSX or Linux.
1. Make sure you have [Node.js](https://nodejs.org/) with at least version 10 installed. Call `node -v` to see your current version.
1. Run `npm install -g aerofly-weather` to install Aerofly-Weather. 
1. After having installed `aerofly-weather`, there are new command line (CLI) commands available on your local PC.
1. Optional: Use `aerofly-make-batch` to create a batch file on your desktop for importing METAR data into Aerofly FS 2. There is a small [guide on how to modify this batch file](docs/command-line.md).

Usage
-----

There are a number of ways to get METAR information into IPACS' Aerofly FS 2:

| CLI Command | Description |
| ----------- | ----------- |
| `aerofly-metar [METAR]` | Insert the [METAR information](docs/metar.md) into your configuration file, with `[METAR]` being a valid METAR forecast string enclosed in quotes. |
| `aerofly-metar-url [URL]` | Fetch [METAR information](docs/metar.md) from an `[URL]`. The URL method may be used with a METAR API which supplies _raw_ METAR information. |
| `aerofly-checkwx [API-KEY] [ICAO-CODE]` | Fetch [METAR information](docs/metar.md) supplied by https://api.checkwx.com/. You will need a valid `[API-KEY]` from https://api.checkwx.com/, and supply the `[ICAO-CODE]` from your selected airport. |

After choosing a method, do these steps to actually get METAR information into Aerofly FS 2:

1. Go to your Aerofly FS 2 save data directory where your main configuration file `main.mcf` is located.
1. Make a backup of your `main.mcf`.
1. Execute `aerofly-metar [METAR]`, `aerofly-metar-url [URL]` or `aerofly-checkwx [APIKEY] [ICAO-CODE]`.
1. Start Aerofly FS 2.

In Windows this can be done by using the Command prompt `cmd`:

```bash
cd "%userprofile%\Documents\Aerofly FS 2"
copy main.mcf main.bak
aerofly-metar "KEYW 050653Z AUTO 19006KT FEW024 BKN039 26/23 A3000 RMK AO2 LTG DSNT W SLP159 T02610228"
# aerofly-metar-url https://3960.org/metar/KEYW.txt
# aerofly-checkwx xxxxxx KEYW
start steam://rungameid/434030
```
In case your configuration got corrupted, copy your `main.bak` back to `main.mcf`. 

There is also a small [guide on how to create a desktop shortcut for `aerofly-metar` and other commands](docs/command-line.md).

### General CLI parameters

These parameters will work with each CLI command:

* `[FILE]`: Every command accepts a last parameter for the file to change. By default this will be `main.mcf` in the current directory. You may want to supply `"%userprofile%\Documents\Aerofly FS 2\main.mcf"` to change your `main.mcf` regardless of your current directory.
* `--hours=X`: Change time copied from METAR information to Aerofly FS 2 by `X` hours.
* `--time=<X>`: Set time to HH:MM+ZZ:ZZ in Aerofly FS 2, e.g. `12:30-08:00`. Remember to include the time zone, else the time will be interpreted as UTC time.
* `--date=<X>`: Set date to YYYY-MM-DD in Aerofly FS 2, e.g. `2018-12-31`.
* `--verbose`: Output extra information about found and parsed data.
* `--help`: Show help information about tool.

There is also a small [guide on how to create a desktop shortcut for `aerofly-metar` and other commands](docs/command-line.md).

### Where and how to get METAR information

There is a [small guide on how to get METAR information](docs/metar.md).

Update
------

1. To find out if your Aerofly-Weather needs updating, run `npm outdated -g aerofly-weather`.
2. Run `npm update -g aerofly-weather` to update your local Aerofly-Weather installation to the latest stable release.

Status
-------

[![npm version](https://badge.fury.io/js/aerofly-weather.svg)](https://badge.fury.io/js/aerofly-weather)
[![Build Status](https://travis-ci.org/fboes/aerofly-weather.svg?branch=master)](https://travis-ci.org/fboes/aerofly-weather)
[![devDependency Status](https://david-dm.org/fboes/aerofly-weather/dev-status.svg)](https://david-dm.org/fboes/aerofly-weather?type=dev)

Legal stuff
-----------

Author: [Frank Boës](http://3960.org)

Copyright & license: See [LICENSE.txt](LICENSE.txt)

This tool is NOT affiliated with, endorsed, or sponsored by IPACS. As stated in the [LICENSE.txt](LICENSE.txt), this tool comes with no warranty and might damage your files.

This software complies with the General Data Protection Regulation (GDPR) as it does not collect nor transmits any personal data but for data your submit by using the CLI commands using URLs. For GDPR compliance of these services refer to the legal statements of these services.
