'use strict';

const metarParser    = require('./metar-parser');
const metarToAerofly = require('./metar-to-aerofly');
const aeroflyWriter  = require('./aerofly-writer');
const http           = require('http');
const https          = require('https');

const main = function(verbose = false) {
  const external = {
    fromString: function(metarCode, destinationFile) {
      const metarObject   = metarParser(metarCode);
      if (verbose) {
        console.log("METAR information\n-----------------\n", metarObject, "\n");
      }
      const aeroflyObject = metarToAerofly(metarObject);
      if (verbose) {
        console.log("Aerofly data information\n------------------------\n", aeroflyObject, "\n");
      }
      const a = aeroflyWriter(destinationFile, aeroflyObject);
      if (verbose) {
        //console.log(a.output());
      }
      a.save();
      console.log('Weather data has been copied to ' +  destinationFile);
    },
    fromUrl: function(url, destinationFile) {
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
          return external.fromString(rawData, destinationFile);
        });
      }).on('error', (e) => {
        throw new Error('Error reading URL ' + url + ': ' + e.message);
      });
    }
  };

  return external;
};

module.exports = main;
