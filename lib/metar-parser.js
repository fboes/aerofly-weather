'use strict';

/**
 * Convert METAR string into structured object
 * @param   {String}  metarString raw
 * @returns {Object} with structured information
 */
const metarParser = function(metarString) {
  let metarArray = metarString.trim().replace(/^METAR\S*?\s/, '').split(' ');
  if (metarArray.length < 3) {
    throw new Error('Not enough METAR information found');
  }

  let metarObject = {
    raw_text: metarString,
    raw_parts: metarArray,
    visibility_m: 9999
    //humidity_percent: null
  };

  let mode = 0;
  metarArray.forEach((metarPart) => {
    let match;
    if (mode === 3 && metarPart.match(/^(FEW|SCT|BKN|OVC)(\d+)?/)) {
      mode = 4; // no visibility reported
    }
    if (mode === 4 && metarPart.match(/\d+\/M?\d+/)) {
      mode = 5; // end of clouds
    }
    switch (mode) {
      case 0:
        // ICAO Code
        metarObject.icao = metarPart;
        mode = 1;
        break;
      case 1:
        // Observed Date
        match = metarPart.match(/^(\d\d)(\d\d)(\d\d)Z$/);
        if (match) {
          metarObject.observed = new Date();
          metarObject.observed.setUTCDate(match[1]);
          metarObject.observed.setUTCHours(match[2]);
          metarObject.observed.setUTCMinutes(match[3]);
          mode = 2;
        }
        break;
      case 2:
        // Wind
        match = metarPart.match(/^(\d\d\d)(\d+)(?:G(\d+))?(KT|MPS)/);
        if (match) {
          metarObject.wind = {
            degrees: Number(match[1]),
            speed_kt: Number(match[2]), //kt
            gust_kt: Number(match[3] ? match[3] : match[2]) //kt
          };
          if (match[4] === 'MPS') {
            metarObject.wind.speed_kt /= 1.9438445;
            metarObject.wind.gust_kt  /= 1.9438445;
          }
          mode = 3;
        }
        break;
      case 3:
        // Visibility
        match = metarPart.match(/^(\d+)(?:\/(\d+))?(SM)?$/);
        if (match) {
          metarObject.visibility_m = Number(match[1]); // m
          if (match[2]) {
            metarObject.visibility_m /= Number(match[2]); // fraction
          }
          if (match[3] && match[3] === 'SM') {
            metarObject.visibility_m *= 1609;
          }
          mode = 4;
        }
        break;
      case 4:
        // Clouds
        if (!metarObject.clouds) {
          metarObject.clouds = [];
        }
        match = metarPart.match(/^(FEW|SCT|BKN|OVC)(\d+)?/);
        if (match) {
          let cloud = {
            baseAgl_ft: Number(match[2] || 0) * 100 // ft
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
          mode = 6;
        }
        break;
      case 6:
        // Pressure
        match = metarPart.match(/^(Q|A)(\d+)/);
        if (match) {
          metarObject.barometer_hpa = Number(match[2]); // hPa
          if (match[1] === 'A') {
            metarObject.barometer_hpa /= 2.9529988; // inHg to hPa
          }
          mode = 7;
        }
        break;
    }
  });

  return metarObject;
};

module.exports = metarParser;
