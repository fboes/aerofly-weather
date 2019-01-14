#!/bin/bash

# Change variables to fit your local settings
CHECKWX_APIKEY=
METAR_URL=
METAR_URL_END=
MCF_LOCATION="~\Documents\Aerofly FS 2"

# Change directory
pushd ${MCF_LOCATION}

# Backup
echo "Backup of main.mcf"
cp main.mcf main.bak

# https://stackoverflow.com/questions/9307512/create-a-batch-file-with-multiple-options
echo "Get Aerofly FS 2 weather data from..."
OPTIONS=("METAR input" "METAR URL" "CheckWX" "Start Aerofly FS 2" "Quit")
select OPT in "${OPTIONS[@]}"

do
  case $OPT in
    "METAR input")
      read -p 'Enter METAR string: ' METAR
      aerofly-metar "${METAR}" --verbose
      ;;

    "METAR URL")
      if [ -z "${METAR_URL}" ]; then
        echo "Please set METAR_URL in line 5 / 6"
        exit 1
      fi
      read -p 'Enter ICAO string: ' ICAO
      aerofly-metar-url ${METAR_URL}${ICAO}${METAR_URL_END} --verbose
      ;;

    "Check URL")
      if [ -z "${METAR_URL}" ]; then
        echo "Please set METAR_URL in line 5 / 6"
        exit 1
      fi
      start ${METAR_URL}
      ;;

    "CheckWX")
      if [ -z "${CHECKWX_APIKEY}" ]; then
        echo "Please set CHECKWX_APIKEY in line 4"
        exit 1
      fi
      read -p 'Enter ICAO string: ' ICAO
      aerofly-checkwx ${ICAO} ${CHECKWX_APIKEY} --verbose
      ;;

    "Start Aerofly FS 2")
      # This is pure guess work and is not tested on actual PCs
      start steam://rungameid/434030
      break;
      ;;

    *)
      break
      ;;
  esac
done

popd
