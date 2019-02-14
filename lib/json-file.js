'use strict';

const fs = require('fs');

/**
 * @param   {String} filename    dito
 * @param   {Object} defaultJson dito
 * @returns {Object} with methods
 */
const jsonFile = function(filename, defaultJson = {}) {
  if (!filename) {
    throw Error('No filename supplied for jsonFile');
  }
  filename = filename.replace(/^(~|%userprofile%)/, require('os').homedir());


  const _public = {};
  const _private = {
    filename: filename,
    json: defaultJson
  };

  _public.load = function() {
    if (!fs.existsSync(_private.filename)) {
      return false;
    }
    _private.json = JSON.parse(fs.readFileSync(_private.filename, 'utf8'));
    return true;
  };

  _public.get = function() {
    return _private.json;
  };

  _public.set = function(json) {
    return _private.json = json;
  };

  _public.setByKey = function(key, value) {
    return _private.json[key] = value;
  };

  _public.save = function(callback = function(){}) {
    fs.writeFile(_private.filename, JSON.stringify(_private.json, undefined, 2), callback);
  };

  return _public;
};

module.exports = jsonFile;
