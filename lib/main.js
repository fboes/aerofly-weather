'use strict';

const metarParser    = require('./metar-parser');
const metarToAerofly = require('./metar-to-aerofly');
const aeroflyWriter  = require('./aerofly-writer');
const checkWx        = require('./checkwx');
const http           = require('http');
const https          = require('https');

const main = function(verbose = false) {
  const external = {
    fromString: function(metarCode, destinationFile, hourOffset = 0) {
      try {
        const metarObject   = metarParser(metarCode);
        if (verbose) {
          console.log("METAR information\n-----------------\n", metarObject, "\n");
        }
        const aeroflyObject = metarToAerofly(
          metarObject,
          {
            hourOffset: hourOffset
          }
        );
        if (verbose) {
          console.log("Aerofly data information\n------------------------\n", aeroflyObject, "\n");
        }
        const a = aeroflyWriter(destinationFile, aeroflyObject);
        if (verbose) {
          //console.log(a.output());
        }
        a.save();
        console.log('Weather data has been copied to ' +  destinationFile);
      } catch(error) {
        console.error(error.message || error);
        process.exit(1);
      }
    },
    fromUrl: function(url, destinationFile, hourOffset = 0) {
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
          return external.fromString(rawData, destinationFile, hourOffset);
        });
      }).on('error', (e) => {
        throw new Error('Error reading URL ' + url + ': ' + e.message);
      });
    },
    fromCheckwx(apikey, icao, destinationFile, hourOffset = 0) {
      checkWx(apikey, icao, (rawData) => {
        return external.fromString(rawData, destinationFile, hourOffset);
      });
    }
  };

  return external;
};

module.exports = main;
