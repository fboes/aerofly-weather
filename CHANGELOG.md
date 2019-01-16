Change log
==========

For detailed information check [Aerofly Weather's releases on Github](https://github.com/fboes/aerofly-weather/releases).

* 🎁 `VRB` in METAR now makes for a random wind direction
* 🎁 Substitute ICAO code `XXXX` / `YYYY` with departure / arrival codes found in currently active flightplan

0.5.0
-----

* 💣 Rename CLI commands from `aerofly-` to `aewx-`
* 🎁 Get ICAO code from Aerofly FS 2 flightplan destination
* 🎁 `--flightplan` deletes flightplan in Aerofly FS 2 if it does not match METAR
* 🎁 Add some humidity - but ignore it as of now
* 🎁 Shell commands now ask for missing parameters
* 💊 METAR parser now reads `KPH`
* 💊 Fix conversion for m/s to knots

0.4.1
-----

* 🎁 Consider weather conditions for Aerofly turbulences
* 💊 Fix broken batch files

0.4.0
-----

* 🎁 Support weather conditions in METAR code
* 💊 Improve installation, switching to desktop batch file as preferred method
* 💊 Support `CAVOK` in METAR code

0.3.0
-----

* 💣 Changed internal METAR object structure to match https://api.checkwx.com/#31-single
* 🎁 Add CLI parameters `--time=<X>` and `--date=<X>`
* 🎁 Add General Data Protection Regulation (GDPR) compliance statement
* 🎁 Add examples for desktop integration
* 🎁 Add `aerofly-make-batch` to add desktop shortcut for `aerofly-metar`
* 💊 Maximum possible values match Aerofly FS 2 settings
* :wrench: Improve internal documentation and structure

0.2.0
-----

* 🎁 Add `aerofly-checkwx` to directly get responses from https://api.checkwx.com
* 🎁 Add CLI parameters like `--hours`, `--verbose` and `--help`
* 💊 Add support for `VRB` wind direction

0.1.0
-----

* 🎁 Enable `aerofly-metar-url` to fetch from URLs
* 🎁 Update installation / update instructions

0.0.1
-----

* 🎁 Initial commit
