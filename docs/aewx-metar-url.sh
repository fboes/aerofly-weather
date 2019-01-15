#!/bin/bash

cd ~/Documents/Aerofly FS 2 # Replace with actual save data directory
cp main.mcf main.bak

METAR_URL=https://3960.org/metar/
METAR_URL_END=.txt
read -p 'Enter ICAO string: ' ICAO
aerofly-metar-url ${METAR_URL}${ICAO}${METAR_URL_END} --verbose
