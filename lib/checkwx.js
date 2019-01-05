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

  const url = 'https://api.checkwx.com/metar/' + icao;
  const client = url.match(/^https:/) ? https : http;
  const config = {
    headers: {
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
      let data = JSON.parse(rawData);
      if (data.data[0]) {
        callback(data.data[0]);
      } else {
        throw new Error('Invalid JSON response from ' + url);
      }
    });
  }).on('error', (e) => {
    throw new Error('Error reading URL ' + url + ': ' + e.message);
  });
};

module.exports = metarFromCheckwx;
