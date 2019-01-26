#!/bin/bash

cd ~/Library/Containers/com.aerofly.aerofly-fs-2 # Replace with actual save data directory
cp main.mcf main.bak

# Replace https://3960.org/metar/XXXX.txt with actual API key
AEWX_URL=https://3960.org/metar/XXXX.txt
read -p 'Enter ICAO string: ' ICAO
aerofly-metar-fetch ${ICAO} ${AEWX_URL} --verbose
