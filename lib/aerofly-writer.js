'use strict';

const path      = require('path');
const fs        = require('fs');

/**
 * Modify Aerofly config file
 * @param   {String}  filename       absolute path to Aerofly config file
 * @param   {Object}  aeroflyValues  values to replace in Aerofly config file
 * @returns {Object}  with methods
 */
const aeroflyWriter = function(filename, aeroflyValues) {
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
  if (!aeroflyValues) {
    throw new Error('No AeroflyValues information found');
  }

  const valueReplace = function(input, key, value) {
    if (value === undefined || value === '') {
      return input;
    }
    return input.replace(new RegExp('(\\]\\[' + key + '\\]\\[)[^\\]]*(\\])'), '$1' + value + '$2');
  };

  configFileContent = valueReplace(configFileContent, 'time_year', aeroflyValues.time_year);
  configFileContent = valueReplace(configFileContent, 'time_month', aeroflyValues.time_month);
  configFileContent = valueReplace(configFileContent, 'time_day', aeroflyValues.time_day);
  configFileContent = valueReplace(configFileContent, 'time_hours', aeroflyValues.time_hours);
  configFileContent = valueReplace(configFileContent, 'visibility', aeroflyValues.visibility);

  // restrict this to `tmsettings_wind`
  configFileContent = valueReplace(configFileContent, 'strength', aeroflyValues.wind_strength);
  configFileContent = valueReplace(configFileContent, 'direction_in_degree', aeroflyValues.wind_direction_in_degree);
  configFileContent = valueReplace(configFileContent, 'turbulence', aeroflyValues.wind_turbulence);
  configFileContent = valueReplace(configFileContent, 'thermal_activity', aeroflyValues.wind_thermal_activity);

  if (aeroflyValues.clouds) {
    const cloudTypes = ['cumulus', 'cirrus', 'cumulus_mediocris'];
    aeroflyValues.clouds.forEach((cloud, index) => {
      configFileContent = valueReplace(configFileContent, cloudTypes[index] + '_height', cloud.height);
      configFileContent = valueReplace(configFileContent, cloudTypes[index] + '_density', cloud.density);
    });
  }



  return {
    output: function() {
      return configFileContent;
    },
    save: function() {
      try {
        //fs.writeFileSync(filename, configFileContent)
      } catch (error) {
        throw new Error('File is not writable: ' +  filename);
      }
    }
  };
};

module.exports = aeroflyWriter;
