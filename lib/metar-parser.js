'use strict';

/**
 * Convert METAR string into structured object.
 * @see     https://api.checkwx.com/#31-single
 * @param   {String}  metarString raw
 * @returns {Object} with structured information. The object resembles the API
 *                   reponse of the data property of https://api.checkwx.com/#31-single
 */
const metarParser = function(metarString) {
  let metarArray = metarString
    .trim()
    .replace(/^METAR\S*?\s/, '')
    .replace(/(\s)(\d)\s(\d)\/(\d)(SM)/, function(all, a, b, c, d, e) {
      // convert visbility range like `1 1/2 SM`
      return a + (Number(b) * Number(d) +  Number(c)) + '/' + d + e;
    })
    .split(' ')
  ;
  if (metarArray.length < 3) {
    throw new Error('Not enough METAR information found');
  }

  let metarObject = {
    raw_text: metarString,
    raw_parts: metarArray,
    visibility: {
      meters: 9999
    }
    //humidity_percent: null
  };

  let mode = 0;
  metarArray.forEach((metarPart) => {
    let match;
    if (mode < 4 && metarPart.match(/^(FEW|SCT|BKN|OVC)(\d+)?/)) {
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
          metarObject.observed.setUTCDate(Number(match[1]));
          metarObject.observed.setUTCHours(Number(match[2]));
          metarObject.observed.setUTCMinutes(Number(match[3]));
          mode = 2;
        }
        break;
      case 2:
        // Wind
        match = metarPart.match(/^(\d\d\d|VRB)(\d+)(?:G(\d+))?(KT|MPS)/);
        if (match) {
          if (match[1] === 'VRB') {
            match[1] = 0;
          }
          metarObject.wind = {
            degrees: Number(match[1]),
            speed_kts: Number(match[2]), //kt
            gust_kts: Number(match[3] ? match[3] : match[2]) //kt
          };
          if (match[4] === 'MPS') {
            metarObject.wind.speed_kts /= 1.9438445;
            metarObject.wind.gust_kts  /= 1.9438445;
          }
          mode = 3;
        }
        break;
      case 3:
        // Visibility
        match = metarPart.match(/^(\d+)(?:\/(\d+))?(SM)?$/);
        if (match) {
          metarObject.visibility.meters = Number(match[1]); // m
          if (match[2]) {
            metarObject.visibility.meters /= Number(match[2]); // fraction
          }
          if (match[3] && match[3] === 'SM') {
            metarObject.visibility.meters *= 1609;
          }
          mode = 4;
        } else if (metarObject.wind) {
          // Variable wind direction
          match = metarPart.match(/^(\d+)V(\d+)$/);
          if (match) {
            metarObject.wind.degrees_from = Number(match[1]);
            metarObject.wind.degrees_to = Number(match[2]);
          }
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
            code: match[1],
            base_feet_agl: Number(match[2] || 0) * 100 // ft
          };
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
          metarObject.temperature = {
            celsius: Number(match[2])
          };
          mode = 6;
        }
        break;
      case 6:
        // Pressure
        match = metarPart.match(/^(Q|A)(\d+)/);
        if (match) {
          metarObject.barometer = {
            kpa: Number(match[2]) / 10
          };
          if (match[1] === 'A') {
            metarObject.barometer.kpa /= 2.9529988; // inHg to kpa
          }
          mode = 7;
        }
        break;
    }
  });

  return metarObject;
};

module.exports = metarParser;
