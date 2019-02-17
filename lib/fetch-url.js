'use strict';

const http              = require('http');
const https             = require('https');

/**
 *
 * @param {String}   url dito
 * @param {Object}   options with 'apikey', 'response'
 * @param {Function} callback with `response` as parameter
 * @returns {null}   dito
 */
const fetchUrl = function(url, options, callback) {
  const _private = {};

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
        || jsonReply.data[0]
        || ''
      ;
    }
    return '';
  };

  // ---------------------------------------------------------------------------

  let headers = {
    'User-Agent': 'AeroWX'
  };
  if (options.response && options.response === 'json') {
    headers['Accept'] = 'application/json';
  }
  if (options.apikey) {
    headers['X-API-Key'] = options.apikey;
  }

  const client = url.match(/^https:/) ? https : http;
  client.get(url, {headers: headers}, (response) => {
    if (response.statusCode >= 400) {
      throw new Error('Error reading URL ' + url + ', got response code ' + response.statusCode);
    }

    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', (chunk) => {
      rawData += chunk;
    });
    response.on('end', () => {
      if (options.response && options.response === 'json') {
        rawData = _private.getRawMetarFromJsonObject(rawData);
      }
      callback(rawData);
    });
  }).on('error', (e) => {
    throw new Error('Error reading URL ' + url + ': ' + e.message);
  });
};

module.exports = fetchUrl;
