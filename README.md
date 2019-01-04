✈️ METAR weather importer for Aerofly FS2
==========================================

Copy METAR information into IPCAS' Aerofly FS2. This will copy the following METAR information to configuration file:

* Time and day (will set the year and month to current year and month because they are not present in METAR information)
* Wind
* Clouds
* Thermal activity

Installation
------------

1. Make sure you have [Node.js](https://nodejs.org/) with at least version 6 installed. Call `node -v` to see your current version.
1. Download this repository.
1. Run `npm install` to install all required dependencies.
1. Run `npm link` to have this package available globally.
1. ~~Run `npm install -g aerofly-weather` to install Aerofly-Weather.~~

Usage
-----

1. Go to your Aerofly FS2 save data directory in `~\Documents\Aerofly FS 2`.
1. Make a backup of your `main.mcf`.
1. Call `aerofly-metar [METAR]` to insert the METAR information into your configuration file.
1. Start Aerofly FS2 like normal.

Update
------

1. ~~To find out if your Aerofly-Weather needs updating, run `npm outdated -g aerofly-weather`.~~
2. ~~Run `npm update -g aerofly-weather` to update your local Aerofly-Weather installation to the latest stable release.~~

Legal stuff
-----------

Author: [Frank Boës](http://3960.org)

Copyright & license: See [LICENSE.txt](LICENSE.txt)

These instructions are NOT affiliated with, endorsed, or sponsored by IPACS.
