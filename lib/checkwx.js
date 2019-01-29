'use strict';

const http           = require('http');
const https          = require('https');


const metarFromCheckwx = function(apiKey, icao, callback) {
  if (!icao) {
    throw new Error('No ICAO code supplied');
  }
  if (!apiKey) {
    throw new Error('No API key submitted, see https://api.checkwx.com/metar/');
  }
  if (!callback) {
    throw new Error('Callback function needed');
  }

  const url = 'https://api.checkwx.com/metar/' + encodeURIComponent(icao) + '/decoded';
  const client = url.match(/^https:/) ? https : http;
  const config = {
    headers: {
      'User-Agent': 'AeroWX',
      'Accept': 'application/json',
      'X-API-Key': apiKey
    }
  };

  client.get(url, config, (response) => {
    if (response.statusCode >= 400) {
      throw new Error('Error reading URL ' + url + ', got response code ' + response.statusCode);
    }

    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', (chunk) => {
      rawData += chunk;
    });
    response.on('end', () => {
      let jsonReply = JSON.parse(rawData);
      if (jsonReply.data[0]) {
        let metarObject = jsonReply.data[0];
        if (metarObject.observed) {
          // convert observed
          metarObject.observed = new Date(
            metarObject.observed.replace(/^(\d+)-(\d+)-(\d\d\d\d)\D+(\d+):(\d+)Z/, '$3-$2-$1T$4:$5Z')
          );
        }
        if (metarObject.visibility.meters) {
          // convert visibility
          metarObject.visibility.meters = metarObject.visibility.meters_float || Number(
            String(metarObject.visibility.meters).replace(/,/g, '')
          );
        }
        if (metarObject.ceiling) {
          metarObject.ceiling.base_feet_agl = metarObject.ceiling.feet_agl || 0;
          metarObject.ceiling.base_meters_agl = metarObject.ceiling.meters_agl || 0;
        }
        if (metarObject.conditions) {
          metarObject.conditions = metarObject.conditions.map((item) => {
            return item.code;
          });
        }
        callback(metarObject);
      } else {
        throw new Error('Invalid JSON response from ' + url);
      }
    });
  }).on('error', (e) => {
    throw new Error('Error reading URL ' + url + ': ' + e.message);
  });
};

module.exports = metarFromCheckwx;
