'use strict';

const metarParser    = require('./metar-parser');
const metarToAerofly = require('./metar-to-aerofly');
const aeroflyWriter  = require('./aerofly-writer');
const checkWx        = require('./checkwx');
const http           = require('http');
const https          = require('https');

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
   * @param   {Object}  metarObject dito
   * @param   {String}  destinationFile absolute
   * @param   {Integer} hourOffset change timestamp from metarCode by X hours
   * @param   {String}  time set date / time
   * @param   {String}  date set date / time
   * @returns {Boolean} true
   */
  _private.processMetarObject = function(metarObject, destinationFile, hourOffset = 0, time = null, date = null) {
    try {
      if (verbose) {
        console.log("METAR information\n-----------------\n", metarObject, "\n");
      }
      if (time || date) {
        metarObject.observed = _private.modifyDateObject(metarObject.observed, time, date);
      }
      const aeroflyObject = metarToAerofly(metarObject, { hourOffset: hourOffset });
      if (verbose) {
        console.log("Aerofly data information\n------------------------\n", aeroflyObject, "\n");
      }
      const a = aeroflyWriter(destinationFile);
      a.setFromAeroflyObject(aeroflyObject);
      if (verbose) {
        //console.log(a.output());
      }
      a.save();
      console.log('Weather data has been copied to ' +  destinationFile);
    } catch(error) {
      console.error(error.message || error);
      process.exit(1);
    }
    return true;
  };

  /**
   * @param   {String}  metarCode dito
   * @param   {String}  destinationFile absolute
   * @param   {Integer} hourOffset change timestamp from metarCode by X hours
   * @param   {String}  time set date / time
   * @param   {String}  date set date / time
   * @returns {Boolean} true
   */
  _public.fromString = function(metarCode, destinationFile, hourOffset = 0, time = null, date = null) {
    const metarObject   = metarParser(metarCode);
    return _private.processMetarObject(metarObject, destinationFile, hourOffset, time, date);
  };

  /**
   * @param   {String}  url dito
   * @param   {String}  destinationFile absolute
   * @param   {Integer} hourOffset change timestamp from metarCode by X hours
   * @param   {String}  time set date / time
   * @param   {String}  date set date / time
   * @returns {Boolean} true
   */
  _public.fromUrl = function(url, destinationFile, hourOffset = 0, time = null, date = null) {
    url = url.trim();
    const client = url.match(/^https:/) ? https : http;
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
        return _public.fromString(rawData, destinationFile, hourOffset, time, date);
      });
    }).on('error', (e) => {
      throw new Error('Error reading URL ' + url + ': ' + e.message);
    });
    return true;
  };

  /**
   * @param   {String}  apikey    for CheckWx API Call
   * @param   {String}  icao      ICAO code of airport
   * @param   {String}  destinationFile absolute
   * @param   {Integer} hourOffset change timestamp from metarCode by X hours
   * @param   {String}  time set date / time
   * @param   {String}  date set date / time
   * @returns {Void} none
   */
  _public.fromCheckwx = function(apikey, icao, destinationFile, hourOffset = 0, time = null, date = null) {
    checkWx(apikey, icao, (metarObject) => {
      return _private.processMetarObject(metarObject, destinationFile, hourOffset, time, date);
    });
  };

  return _public;
};

module.exports = main;
