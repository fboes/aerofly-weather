#!/bin/bash

# Change variables to fit your local settings
CHECKWX_APIKEY=
MCF_LOCATION="~/Library/Containers/com.aerofly.aerofly-fs-2"
AVWX_URL="http://avwx.rest/api/metar/XXXX?options=&format=json&onfail=cache"
AEROWX_OPTIONS=

# Change directory
pushd ${MCF_LOCATION}

# Backup
echo "Backup of main.mcf"
cp main.mcf main.bak

# https://stackoverflow.com/questions/9307512/create-a-batch-file-with-multiple-options
echo "Get Aerofly FS 2 weather data from..."
OPTIONS=("METAR input" "AVWX" "CheckWX" "Help" "Start Aerofly FS 2" "Quit")
select OPT in "${OPTIONS[@]}"

do
  case $OPT in
    "METAR input")
      aerowx-metar ${AEROWX_OPTIONS}
      ;;

    "AVWX")
      aerowx-metar-fetch "" ${AVWX_URL} --response=json ${AEROWX_OPTIONS}
      ;;

    "CheckWX")
      aerowx-checkwx ${AEROWX_OPTIONS}
      ;;

    "Help")
      start https://www.npmjs.com/package/aerofly-weather
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
