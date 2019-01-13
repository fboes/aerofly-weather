Change log
==========

For detailed information check [Aerofly Weather's releases on Github](https://github.com/fboes/aerofly-weather/releases).

* :pill: METAR parser now reads `KPH`
* :pill: Fix conversion for m/s to knots
* :pill: Get ICAO code from Aerofly FS 2 flight plan destination

0.4.1
-----

* :gift: Consider weather conditions for Aerofly turbulences
* :pill: Fix broken batch files

0.4.0
-----

* :gift: Support weather conditions in METAR code
* :pill: Improve installation, switching to desktop batch file as preferred method
* :pill: Support `CAVOK` in METAR code

0.3.0
-----

* :gift: Add CLI parameters `--time=<X>` and `--date=<X>`
* :gift: Add General Data Protection Regulation (GDPR) compliance statement
* :gift: Add examples for desktop integration
* :gift: Add `aerofly-make-batch` to add desktop shortcut for `aerofly-metar`
* :pill: Maximum possible values match Aerofly FS 2 settings
* :wrench: Improve internal documentation and structure
* :bomb: Changed internal METAR object structure to match https://api.checkwx.com/#31-single

0.2.0
-----

* :gift: Add `aerofly-checkwx` to directly get responses from https://api.checkwx.com
* :gift: Add CLI parameters like `--hours`, `--verbose` and `--help`
* :pill: Add support for `VRB` wind direction

0.1.0
-----

* :gift: Enable `aerofly-metar-url` to fetch from URLs
* :gift: Update installation / update instructions

0.0.1
-----

* :gift: Initial commit
