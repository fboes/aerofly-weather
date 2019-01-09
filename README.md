✈️ METAR weather importer for Aerofly FS 2
===========================================

Copy [METAR information](docs/metar.md) into IPCAS' Aerofly FS 2.

These command line tools will copy the following METAR information to your configuration file while Aerofly FS 2 is not running:

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
1. After having installed `aerofly-weather`, there are new command line tools available on your local PC (see below).
1. Optional: Use `aerofly-make-batch` to create a batch file on your desktop for automating the import of METAR data. There is a small [guide on how to modify this batch file](docs/command-line.md).

Usage of Command Line Tools
---------------------------

The command line tools allow for a number of ways to get METAR information into IPACS' Aerofly FS 2, depending on your [source of METAR information](docs/metar.md):

| CLI Command | Description |
| ----------- | ----------- |
| `aerofly-metar [METAR]` | Insert the [METAR information](docs/metar.md) into your configuration file, with `[METAR]` being a valid METAR forecast string enclosed in quotes. |
| `aerofly-metar-url [URL]` | Fetch [METAR information](docs/metar.md) from an `[URL]`. The URL method may be used with a METAR API which supplies _raw_ METAR information. |
| `aerofly-checkwx [ICAO-CODE] [API-KEY]` | Fetch [METAR information](docs/metar.md) supplied by https://api.checkwx.com/. You will need a valid `[API-KEY]` from https://api.checkwx.com/, and supply the `[ICAO-CODE]` from your selected airport. |

After choosing a method, do these steps to actually get METAR information into Aerofly FS 2:

1. Open a Command Prompt (e.g. by typing "Command Prompt" into your Windows Search).
1. Go to your Aerofly FS 2 save data directory where your main configuration file `main.mcf` is located. Usually for Windows this file is located in `Documents\Aerofly FS 2`.
1. Make a backup of your `main.mcf`.
1. Execute `aerofly-metar [METAR]`, `aerofly-metar-url [URL]` or `aerofly-checkwx [APIKEY] [ICAO-CODE]`.
1. Start Aerofly FS 2.

There is also a small [guide on how to work best with the command line tools as well as an explanation for additional parameters](docs/command-line.md).

Update
------

1. To find out if your installation of Aerofly-Weather needs updating, run `npm outdated -g aerofly-weather`.
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
