#!/bin/bash

cd ~/Library/Containers/com.aerofly.aerofly-fs-2 # Replace with actual save data directory
cp main.mcf main.bak

read -p 'Enter METAR string: ' METAR
aewx-metar ${METAR} --verbose
