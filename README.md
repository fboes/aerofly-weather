✈️ METAR weather importer for Aerofly FS 2
===========================================

Copy METAR information into IPCAS' Aerofly FS 2. This will copy the following METAR information to your configuration file:

* Time and day (will set the year and month to current year and month because they are not present in METAR information)
* Wind & turbulences
* Thermal activity
* Clouds (height & density)

The METAR information can be supplied manually, or can be fetched from an URL.

Installation
------------

1. Make sure you have [Node.js](https://nodejs.org/) with at least version 6 installed. Call `node -v` to see your current version.
1. Run `npm install -g aerofly-weather` to install Aerofly-Weather.

Usage
-----

1. Go to your Aerofly FS 2 save data directory where your main configuration file `main.mcf` is located.
1. Make a backup of your `main.mcf`.
1. Call `aerofly-metar [METAR]` to insert the METAR information into your configuration file, with `[METAR]` being a valid METAR forecast string enclosed in quotes _OR_ call `aerofly-metar-url [URL]` to insert METAR information supplied from an URL. 
1. Start Aerofly FS 2.

In Windows this can be done by using the Command prompt `cmd`:

```bash
cd "%userprofile%\Documents\Aerofly FS 2"
copy main.mcf main.bak
aerofly-metar "KEYW 050653Z AUTO 19006KT FEW024 BKN039 26/23 A3000 RMK AO2 LTG DSNT W SLP159 T02610228"
start steam://rungameid/434030
```

or…

```bash
cd "%userprofile%\Documents\Aerofly FS 2"
copy main.mcf main.bak
aerofly-metar-url https://3960.org/metar/KEYW.txt
start steam://rungameid/434030
```

The URL method may be used with a METAR API which supplies _raw_ METAR information. This is a service which supplies the current METAR information for a given location without you having to change the URL. This allows for automatically pulling the latest weather data into Aerofly FS 2. Please note that as of now `aerofly-metar-url` is limited to _raw_ METAR responses.

In case your configuration got corrupted, copy your `main.bak` back to `main.mcf`.

### Common CLI parameters

* `--hours=X`: Change time copied from METAR information to Aerofly FS 2 by `X` hours. This may be helpful if you want to set a specific time right away.
* `--verbose`: Output extra information about found and parsed data.
* `--help`: Show help information about tool.

### Sources for METAR information

* https://en.allmetsat.com/metar-taf/
* https://aviationweather.gov/metar
* https://metars.com/

### Some METAR examples

Some clouds over San Francisco (USA):

```
KSFO 050756Z 11007KT 10SM SCT035 BKN200 10/06 A2983 RMK AO2 SLP099 T01000061 401720039
```

Rainy in New York (USA) with limited visibility:

```
KLGA 050808Z 04007KT 1SM R04/P6000FT -RA BR BKN006 OVC014 06/04 A2967 RMK AO2 P0001 T00560044
```

A fine night night in Miami (USA):

```
KMIA 050753Z 18007KT 5SM BR FEW005 23/23 A2997 RMK AO2 SLP149 T02280228 
```

No wind in Geneva (Switzerland):

```
LSGG 050820Z VRB01KT 9999 FEW070 BKN110 M03/M04 Q1033 NOSIG
```

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
