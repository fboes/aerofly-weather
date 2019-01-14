#!/bin/bash

cd ~/Documents/Aerofly FS 2 # Replace with actual save data directory
cp main.mcf main.bak

read -p 'Enter METAR string: ' METAR
aerofly-metar ${METAR} --verbose
