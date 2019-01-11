#!/bin/bash

# Change variables to fit your local settings
CHECKWX_APIKEY=
METAR_URL=
MCF_LOCATION="~\Documents\Aerofly FS 2"

# Change directory
pushd $MCF_LOCATION

# Backup
echo "Backup of main.mcf"
cp main.mcf main.bak

# https://stackoverflow.com/questions/9307512/create-a-batch-file-with-multiple-options
echo "Get Aerofly FS 2 weather data from..."
OPTIONS=("METAR input" "METAR URL" "CheckWx" "Start Aerofly FS 2" "Quit")
select OPT in "${OPTIONS[@]}"

do
  case $OPT in
    "METAR input")
      read -p 'Enter METAR string: ' METAR
      aerofly-metar "$METAR" $MCF_LOCATION --verbose
      ;;

    "METAR URL")
      if [ -z "$METAR_URL" ]; then
        echo "Please set METAR_URL in line 5"
        exit 1
      fi
      read -p 'Enter ICAO string: ' ICAO
      aerofly-metar-url $METAR_URL$ICAO $MCF_LOCATION --verbose
      ;;

    "CheckWx")
      if [ -z "$CHECKWX_APIKEY" ]; then
        echo "Please set CHECKWX_APIKEY in line 4"
        exit 1
      fi
      read -p 'Enter ICAO string: ' ICAO
      aerofly-checkwx $ICAO $CHECKWX_APIKEY $MCF_LOCATION --verbose
      ;;

    "Start Aerofly FS 2")
      # This is pure guess work and is not tested on actual PC
      open steam://rungameid/434030
      break;
      ;;

    *)
      break
      ;;
  esac
done

popd
