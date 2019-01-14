#!/bin/bash

cd ~/Documents/Aerofly FS 2 # Replace with actual save data directory
cp main.mcf main.bak

#  Replace 12345abcd with actual API key
CHECKWX_APIKEY=12345abcd
read -p 'Enter ICAO string: ' ICAO
aerofly-checkwx ${ICAO} ${CHECKWX_APIKEY} --verbose
