'use strict';

/**
 * Convert METAR string into structured object
 * @param   {String}  metarString raw
 * @returns {Object} with structured information
 */
const metarParser = function(metarString) {
  let metarArray = metarString.trim().split(' ');
  if (metarArray.length < 3) {
    throw new Error('Not enough METAR information found');
  }

  let metarObject = {
    raw_text: metarString,
    raw_parts: metarArray
    //humidity_percent: null
  };

  let mode = 0;
  metarArray.forEach((metarPart) => {
    let match;
    if (mode === 4 && metarPart.match(/\d+\/M?\d+/)) {
      mode ++;
    }
    switch (mode) {
      case 0:
        // ICAO Code
        metarObject.icao = metarPart;
        mode ++;
        break;
      case 1:
        // Observed Date
        metarObject.observed = new Date();
        match = metarPart.match(/^(\d\d)(\d\d)(\d\d)Z$/);
        if (match) {
          metarObject.observed.setUTCDate(match[1]);
          metarObject.observed.setUTCHours(match[2]);
          metarObject.observed.setUTCMinutes(match[3]);
        }
        mode ++;
        break;
      case 2:
        // Wind
        match = metarPart.match(/^(\d\d\d)(\d+)(?:G(\d+))?KT/);
        if (match) {
          metarObject.wind = {
            degrees: Number(match[1]),
            speed_kt: Number(match[2]), //kt
            gust_kt: Number(match[3] ? match[3] : match[2]) //kt
          };
        }
        mode ++;
        break;
      case 3:
        // Visibility
        match = metarPart.match(/^(\d+)([A-Z]+)?$/);
        if (match) {
          metarObject.visibility_m = Number(match[1]); // m
          if (match[2] === 'SM') {
            metarObject.visibility_m *= 1852;
          }
        }
        mode ++;
        break;
      case 4:
        // Clouds
        if (!metarObject.clouds) {
          metarObject.clouds = [];
        }
        match = metarPart.match(/^([A-Z]+)(\d+)/);
        if (match) {
          let cloud = {
            baseAgl_ft: Number(match[2]) * 1000 // ft
          };
          switch (match[1]) {
            case 'FEW': cloud.minDensity = 1; cloud.maxDensity = 2; break;
            case 'SCT': cloud.minDensity = 3; cloud.maxDensity = 4; break;
            case 'BKN': cloud.minDensity = 5; cloud.maxDensity = 7; break;
            case 'OVC': cloud.minDensity = 8; cloud.maxDensity = 8; break;
            default:    cloud.minDensity = 0; cloud.maxDensity = 0.5; break;
          }
          metarObject.clouds.push(cloud);
        }
        break;
      case 5:
        // Temperature
        match = metarPart.match(/^(M)?(\d+)\//);
        if (match) {
          if (match[1] === 'M') {
            match[2] = '-' + match[2];
          }
          metarObject.temperature_c = Number(match[2]); // °C
        }
        mode ++;
        break;
      case 6:
        // Pressure
        match = metarPart.match(/^(Q|A)(\d+)/);
        if (match) {
          metarObject.barometer_hpa = Number(match[2]); // hPa
          if (match[1] === 'A') {
            metarObject.barometer_hpa /= 2.9529988; // inHg to hPa
          }
        }
        mode ++;
        break;
    }
  });

  return metarObject;
};

module.exports = metarParser;
