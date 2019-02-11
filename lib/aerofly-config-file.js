'use strict';

const path      = require('path');
const fs        = require('fs');

/**
 * Modify Aerofly config file
 * @param   {String}  filename       absolute path to Aerofly config file
 * @returns {Object}  with methods
 */
const aeroflyConfigFile = function(filename) {
  filename = filename.replace(/^(~|%userprofile%)/, require('os').homedir());
  if (!path.isAbsolute(filename)) {
    filename = path.join(process.cwd(), filename);
  }
  if (!fs.existsSync(filename)) {
    throw new Error('File does not exist: ' + filename);
  }
  let configFileContent = fs.readFileSync(filename, 'utf8');
  if (!configFileContent) {
    throw new Error('File is empty: ' + filename);
  }

  // ---------------------------------------------------------------------------

  const _private = {};
  const _public  = {};

  /**
   * @param   {String} subject string to modify
   * @param   {String} key     configuration key
   * @param   {String} value   to insert at `key` in `subject`
   * @returns {String} altered subject
   */
  _private.setValue = function(subject, key, value) {
    return (value === undefined)
      ? subject
      : subject.replace(new RegExp('(\\]\\[' + key + '\\]\\[)[^\\]]*(\\])'), '$1' + value + '$2')
    ;
  };

  /**
   * @param   {String}   subject   string to modify
   * @param   {String}   group     to replace in `group` in `subject`
   * @param   {Number}   indent    indentation level ;)
   * @param   {Function} callback  with first parameter containing group content, return having new group content
   * @returns {String} altered subject
   */
  _private.setGroup = function(subject, group, indent, callback) {
    const indentString = _private.getIndentString(indent);
    return subject.replace(new RegExp('(\\n' + indentString + '<\\[' + group + '\\]\\S*)([\\s\\S]+?)(\\n' + indentString + '>)'), callback);
  };

  /**
   * @param   {String} subject string to modify
   * @param   {String} key     configuration key
   * @returns {String} value string
   */
  _private.getValue = function(subject, key) {
    const match = subject.match(new RegExp('(?:\\]\\[' + key + '\\]\\[)([^\\]]*)(?:\\])'));
    return match ? match[1] : undefined;
  };

  /**
   * @param   {String} subject string to modify
   * @param   {String} group   to insert at `key` in `subject`
   * @param   {Number} indent    indentation level ;)
   * @returns {String} group string
   */
  _private.getGroup = function(subject, group, indent) {
    const indentString = _private.getIndentString(indent);
    const match = subject.match(new RegExp('\\n' + indentString + '<\\[' + group + '\\][\\s\\S]+?\\n' + indentString + '>'));
    return match ? match[0] : undefined;
  };

  /**
   * @param {Number} indent     indentation level ;)
   * @returns {String} which allows to find indentation in MCF
   */
  _private.getIndentString = function(indent) {
    return indent ? '    '.repeat(indent) : '\\s+';
  };

  /**
   * Set start date / time in UTC
   * @param {Integer} year  UTC year
   * @param {Integer} month UTC month (1..12)
   * @param {Integer} day   UTC day (1..31)
   * @param {Float}   hours UTC time, with minutes as fractions (0.0..23.99)
   * @returns {Object} this
   */
  _public.setDate = function(year, month, day, hours) {
    // restrict this to `tm_time_utc`
    configFileContent = configFileContent.replace(/<\[tm_time_utc\][\s\S]+?\s>/, (all) => {
      all = _private.setValue(all, 'time_year', year);
      all = _private.setValue(all, 'time_month', month);
      all = _private.setValue(all, 'time_day', day);
      all = _private.setValue(all, 'time_hours', hours);
      return all;
    });
    return this;
  };

  /**
   * Set start date / time from Date object
   * @param {Date} date dito
   * @returns {Object} this
   */
  _public.setDateObject = function(date) {
    return _public.setDate(
      date.observed.getUTCFullYear(),
      (date.observed.getUTCMonth() + 1),
      date.observed.getUTCDate(),
      date.observed.getUTCHours() + (date.observed.getUTCMinutes() / 60)
    );
  };

  /**
   * Set configuration data from Aerofly object
   * @param {Object} aeroflyValues structured values, as produces by metarToAerofly
   * @returns {Object} this
   */
  _public.setFromAeroflyObject = function(aeroflyValues) {
    if (!aeroflyValues) {
      throw new Error('No AeroflyValues information found');
    }

    _public.setDate(
      aeroflyValues.time.year,
      aeroflyValues.time.month,
      aeroflyValues.time.day,
      aeroflyValues.time.hours
    );

    configFileContent = _private.setValue(configFileContent, 'visibility', aeroflyValues.visibility);

    // restrict this to `tmsettings_wind`
    configFileContent = _private.setGroup(configFileContent, 'tmsettings_wind', 2, (all) => {
      all = _private.setValue(all, 'strength', aeroflyValues.wind.strength);
      all = _private.setValue(all, 'direction_in_degree', aeroflyValues.wind.direction_in_degree);
      all = _private.setValue(all, 'turbulence', aeroflyValues.wind.turbulence);
      all = _private.setValue(all, 'thermal_activity', aeroflyValues.thermal_activity);
      return all;
    });

    // restrict this to `tmsettings_clouds`
    configFileContent = _private.setGroup(configFileContent, 'tmsettings_clouds', 2, (all) => {
      const cloudTypes = ['cirrus', 'cumulus', 'cumulus_mediocris'];
      // Reset clouds
      cloudTypes.forEach((cloud) => {
        all = _private.setValue(all, cloud + '_height', 0);
        all = _private.setValue(all, cloud + '_density', 0);
      });
      if (aeroflyValues.clouds) {
        // Clouds from top to bottom
        aeroflyValues.clouds.reverse().forEach((cloud, index) => {
          all = _private.setValue(all, cloudTypes[index] + '_height', cloud.height);
          all = _private.setValue(all, cloudTypes[index] + '_density', cloud.density);
        });
      }
      return all;
    });
    return this;
  };

  /**
   * @returns {Object} with origin, destination
   */
  _public.getFlightplan = function() {
    let flighplan = {
      origin: {},
      destination: {}
    };
    ['Origin', 'Destination'].forEach((wpType) => {
      const groupMatch = _private.getGroup(configFileContent, 'tmnav_route_airport\\S\\S' + wpType, 4);
      if (groupMatch) {
        const valueMatch = _private.getValue(groupMatch, 'Identifier');
        flighplan[wpType.toLowerCase()] = {
          icao: valueMatch || undefined
        };
      }
    });
    return flighplan;
  };

  /**
   * @param   {String} originIcao      dito
   * @param   {String} destinationIcao dito
   * @returns {Object} this
   */
  _public.setFlightplan = function(originIcao = '', destinationIcao = '') {
    destinationIcao = destinationIcao || originIcao;
    if (originIcao || destinationIcao) {
      throw new Error('Setting of flightplan not yet implemented, flightplan deleted instead');
    }
    // delete flightplan
    ['Origin', 'Destination'].forEach((wpType) => {
      configFileContent = _private.setGroup(configFileContent, 'tmnav_route_airport\\S\\S' + wpType, 4, (all) => {
        all = _private.setValue(all, 'Identifier', '');
        all = _private.setValue(all, 'Uid', 0);
        return all;
      });
    });
    configFileContent = _private.setGroup(configFileContent, 'pointer_list_tmnav_route_way', 4, (all, before, inside, after) => {
      return before + after;
    });
    return this;
  };

  /**
   * @returns {String} current state of file
   */
  _public.output = function() {
    return configFileContent;
  };

  /**
   * Save current state of file content back to file
   * @returns {Object} this
   */
  _public.save = function() {
    try {
      fs.writeFileSync(filename, configFileContent);
    } catch (error) {
      throw new Error('File is not writable: ' +  filename);
    }
    return this;
  };

  return _public;
};

module.exports = aeroflyConfigFile;
