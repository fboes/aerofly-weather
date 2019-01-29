'use strict';

const http              = require('http');
const https             = require('https');
const metarParser       = require('aewx-metar-parser');
const metarToAerofly    = require('./metar-to-aerofly');
const aeroflyConfigFile = require('./aerofly-config-file');
const checkWx           = require('./checkwx');
const progress          = require('./progress');

/**
 *
 * @param   {Boolean} verbose Enable logging
 * @returns {Object}  with methods
 */
const main = function(verbose = false) {
  const _private = {};
  const _public = {};

  /**
   * @param {Date} dateObject to modify
   * @param {String} time like `00:00+00:00`
   * @param {String} date like `2018-12-31`
   * @returns {Date} modified
   */
  _private.modifyDateObject = function(dateObject, time, date) {
    if (time) {
      const timeMatch = time.match(/^(\d?\d)\D?(\d\d)(?:(\+|-)(\d?\d)(?:\D?(\d\d))?)?/);
      if (timeMatch) {
        timeMatch[1] = Number(timeMatch[1]);
        timeMatch[2] = Number(timeMatch[2]);
        if (timeMatch[3] && timeMatch[4]) {
          let modifier = (timeMatch[3] === '+') ? 1 : -1;
          timeMatch[1] += modifier * Number(timeMatch[4]);
          if (timeMatch[5]) {
            timeMatch[2] += modifier * Number(timeMatch[5]);
          }
        }

        dateObject.setUTCHours(timeMatch[1]);
        dateObject.setUTCMinutes(timeMatch[2]);
      }
    }
    if (date) {
      const dateMatch = date.match(/^(\d\d\d\d)\D?(\d?\d)\D?(\d?\d)$/);
      if (dateMatch) {
        dateObject.setUTCFullYear(Number(dateMatch[1]));
        dateObject.setUTCMonth(Number(dateMatch[2]) - 1);
        dateObject.setUTCDate(Number(dateMatch[3]));
      }
    }
    return dateObject;
  };

  /**
   * @param   {String}  destinationFile absolute
   * @param   {Boolean} getDeparture    if set to true do return departure airport instead of arrival.
   * @returns {String}  ICAO code of arrival airport in current flightplan
   */
  _private.getIcaoFromFlightplan = function(destinationFile, getDeparture = false) {
    const flightplan = aeroflyConfigFile(destinationFile).getFlightplan();
    const icao = getDeparture ? flightplan.origin.icao : flightplan.destination.icao;
    if (!icao) {
      throw new Error('No flightplan found or no destination airport code found');
    }
    return icao;
  };

  /**
   * Search in JSON response for object keys like 'raw', 'raw_text', or 'Raw-Report' and return their value.
   * @param   {String} rawData which will be parsed as JSON
   * @returns {String} Raw METAR string if found
   */
  _private.getRawMetarFromJsonObject = function(rawData) {
    let jsonReply = JSON.parse(rawData);
    if (jsonReply) {
      return jsonReply.raw
        || jsonReply.raw_text
        || jsonReply['Raw-Report']
        || ''
      ;
    }
    return '';
  };

  /**
   * @param   {Object}  aeroflyObject dito
   * @returns {Boolean} true
   */
  _private.outputAeroflyObject = function(aeroflyObject) {
    console.log(
      "\nTime\n",
      aeroflyObject.time.year + '-' + aeroflyObject.time.month + '-' + aeroflyObject.time.day + "\n",
      progress(aeroflyObject.time.hours / 24, 'Hours UTC', 24, 'h')
    );
    console.log(
      "Wind\n",
      progress(aeroflyObject.wind.direction_in_degree / 360, 'Direction', 360, '°') + "\n",
      progress(aeroflyObject.wind.strength, 'Strength') + "\n",
      progress(aeroflyObject.wind.turbulence, 'Turbulence') + "\n",
      progress(aeroflyObject.thermal_activity, 'Thermal activity') + "\n",
      progress(aeroflyObject.visibility, 'Visibility')
    );
    if (aeroflyObject.clouds) {
      aeroflyObject.clouds.forEach((cloud, index) => {
        console.log(
          "Cloud layer " + (index + 1) + "\n",
          progress(cloud.height, 'Height') + "\n",
          progress(cloud.density, 'Density')
        );
      });
    }
    console.log("\n");
    return true;
  };

  /**
   * @param   {Object}  metarObject dito
   * @param   {String}  destinationFile absolute
   * @param   {Object}  options   with 'hourOffset', time', 'date', 'flightplan', 'dry-run', 'quiet'
   * @param   {String}  time set date / time
   * @param   {String}  date set date / time
   * @param   {String}  flightplan set origin of flightplan
   * @returns {Boolean} true
   */
  _private.processMetarObject = function(metarObject, destinationFile, options) {
    try {
      if (verbose) {
        console.log("METAR information\n-----------------\n", metarObject, "\n");
      } else if (!options.quiet && metarObject.raw_text) {
        console.log('Found METAR data "' + metarObject.raw_text + '"');
      }
      if (options.time || options.date) {
        metarObject.observed = _private.modifyDateObject(metarObject.observed, options.time, options.date);
      }
      const aeroflyObject = metarToAerofly(metarObject, { hourOffset: options.hourOffset || 0 });
      if (verbose) {
        console.log("Aerofly data information\n------------------------\n", aeroflyObject, "\n");
      } else if (!options.quiet) {
        _private.outputAeroflyObject(aeroflyObject);
      }
      const acf = aeroflyConfigFile(destinationFile);
      acf.setFromAeroflyObject(aeroflyObject);
      if (options.flightplan) {
        // delete flightplan if ICAO code of METAR does not match
        const curFlightplan = acf.getFlightplan();
        if (verbose) {
          console.log("Aerofly flightplan found\n------------------------\n", curFlightplan, "\n");
        }
        const flightplanDoesMatch = (
          metarObject.icao === curFlightplan.origin.icao
          || metarObject.icao === curFlightplan.destination.icao
        );
        if (flightplanDoesMatch) {
          if (!options.quiet) {
            console.log("Flightplan does match requested METAR\n");
          }
        } else {
          // a.setFlightplan(flightplan, metarObject.icao); TODO: Set flightplan
          acf.setFlightplan(null, null);
          if (!options.quiet) {
            console.log("Flightplan does NOT match requested METAR, has been deleted\n");
          }
        }
      }
      if (!options['dry-run']) {
        acf.save();
        if (!options.quiet) {
          console.log('Weather data has been copied to ' +  destinationFile);
        }
      } else if(!options.quiet) {
        console.log('Dry-run for ' +  destinationFile);
      }
    } catch(error) {
      console.error(error.message || error);
      process.exit(1);
    }
    return true;
  };

  /**
   * @param   {String}  metarCode dito
   * @param   {String}  destinationFile absolute
   * @param   {Object}  options   see `processMetarObject`
   * @returns {Boolean} true
   */
  _public.fromString = function(metarCode, destinationFile, options) {
    const metarObject = metarParser(metarCode);
    return _private.processMetarObject(metarObject, destinationFile, options);
  };

  /**
   * @param   {String}  url dito
   * @param   {String}  destinationFile absolute
   * @param   {Object}  options   see `fromString`
   * @returns {Boolean} true
   */
  _public.fromUrl = function(url, destinationFile, options) {
    url = url.trim().replace(/(DEP|ARR)/, (icao) => {
      return _private.getIcaoFromFlightplan(destinationFile, icao === 'DEP');
    });

    const client = url.match(/^https:/) ? https : http;
    try {
      client.get(url, (response) => {
        if (response.statusCode >= 400) {
          throw new Error('Error reading URL ' + url + ', got response code ' + response.statusCode);
        }

        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', (chunk) => {
          rawData += chunk;
        });
        response.on('end', () => {
          if (verbose) {
            console.log('Got response from URL ' + url + "\n", rawData.trim(), "\n");
          }
          if (options.response && options.response === 'json') {
            rawData = _private.getRawMetarFromJsonObject(rawData);
          }
          return _public.fromString(rawData, destinationFile, options);
        });
      }).on('error', (e) => {
        throw new Error('Error reading URL ' + url + ': ' + e.message);
      });
    } catch(error) {
      console.error(error.message || error);
      process.exit(1);
    }
    return true;
  };

  /**
   * @param   {String}  apikey    for CheckWX API Call
   * @param   {String}  icao      ICAO code of airport
   * @param   {String}  destinationFile absolute
   * @param   {Object}  options   see `processMetarObject`
   * @returns {Void} none
   */
  _public.fromCheckwx = function(apikey, icao, destinationFile, options) {
    if (icao === 'DEP' || icao === 'ARR') {
      icao = _private.getIcaoFromFlightplan(destinationFile, icao === 'DEP');
    }
    try {
      checkWx(apikey, icao, (metarObject) => {
        return _private.processMetarObject(metarObject, destinationFile, options);
      });
    } catch(error) {
      console.error(error.message || error);
      process.exit(1);
    }
  };

  return _public;
};

module.exports = main;
