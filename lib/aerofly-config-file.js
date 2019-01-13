'use strict';

const path      = require('path');
const fs        = require('fs');

/**
 * Modify Aerofly config file
 * @param   {String}  filename       absolute path to Aerofly config file
 * @returns {Object}  with methods
 */
const aeroflyConfigFile = function(filename) {
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
   * @param {String} subject string to modify
   * @param {String} key     configuration key
   * @param {String} value   to insert at `key` in `subject`
   * @returns {String} altered subject
   */
  _private.valueReplace = function(subject, key, value) {
    if (value === undefined || value === '') {
      return subject;
    }
    return subject.replace(new RegExp('(\\]\\[' + key + '\\]\\[)[^\\]]*(\\])'), '$1' + value + '$2');
  };

  _private.replaceInGroup = function(subject, group, callback) {
    return subject.replace(new RegExp('<\\[' + group + '\\][\\s\\S]+?\\s>'), callback);
  };

  _private.getValue = function(subject, key) {
    return subject.match(new RegExp('(?:\\]\\[' + key + '\\]\\[)([^\\]]*)(?:\\])'));
  };

  _private.getGroup = function(subject, group) {
    return subject.match(new RegExp('<\\[' + group + '\\][\\s\\S]+?\\s>'));
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
      all = _private.valueReplace(all, 'time_year', year);
      all = _private.valueReplace(all, 'time_month', month);
      all = _private.valueReplace(all, 'time_day', day);
      all = _private.valueReplace(all, 'time_hours', hours);
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
      aeroflyValues.time_year,
      aeroflyValues.time_month,
      aeroflyValues.time_day,
      aeroflyValues.time_hours
    );

    configFileContent = _private.valueReplace(configFileContent, 'visibility', aeroflyValues.visibility);

    // restrict this to `tmsettings_wind`
    configFileContent = _private.replaceInGroup(configFileContent, 'tmsettings_wind', (all) => {
      all = _private.valueReplace(all, 'strength', aeroflyValues.wind_strength);
      all = _private.valueReplace(all, 'direction_in_degree', aeroflyValues.wind_direction_in_degree);
      all = _private.valueReplace(all, 'turbulence', aeroflyValues.wind_turbulence);
      all = _private.valueReplace(all, 'thermal_activity', aeroflyValues.wind_thermal_activity);
      return all;
    });

    // restrict this to `tmsettings_clouds`
    configFileContent = _private.replaceInGroup(configFileContent, 'tmsettings_clouds', (all) => {
      const cloudTypes = ['cirrus', 'cumulus', 'cumulus_mediocris'];
      // Reset clouds
      cloudTypes.forEach((cloud) => {
        all = _private.valueReplace(all, cloud + '_height', 0);
        all = _private.valueReplace(all, cloud + '_density', 0);
      });
      if (aeroflyValues.clouds) {
        // Clouds from top to bottom
        aeroflyValues.clouds.reverse().forEach((cloud, index) => {
          all = _private.valueReplace(all, cloudTypes[index] + '_height', cloud.height);
          all = _private.valueReplace(all, cloudTypes[index] + '_density', cloud.density);
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
      const groupMatch = _private.getGroup(configFileContent, 'tmnav_route_airport\\S\\S' + wpType);
      if (groupMatch) {
        const valueMatch = _private.getValue(groupMatch[0], 'Identifier');
        flighplan[wpType.toLowerCase()] = {
          icao: valueMatch ? valueMatch[1] : undefined
        };
      }
    });
    return flighplan;
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
