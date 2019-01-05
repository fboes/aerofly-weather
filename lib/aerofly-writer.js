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

  // ---------------------------------------------------------------------------

  // restrict this to `tm_time_utc`
  configFileContent = configFileContent.replace(/<\[tm_time_utc\][\s\S]+?\s>/, (all) => {
    all = valueReplace(all, 'time_year', aeroflyValues.time_year);
    all = valueReplace(all, 'time_month', aeroflyValues.time_month);
    all = valueReplace(all, 'time_day', aeroflyValues.time_day);
    all = valueReplace(all, 'time_hours', aeroflyValues.time_hours);
    return all;
  });

  configFileContent = valueReplace(configFileContent, 'visibility', aeroflyValues.visibility);

  // restrict this to `tmsettings_wind`
  configFileContent = configFileContent.replace(/<\[tmsettings_wind\][\s\S]+?\s>/, (all) => {
    all = valueReplace(all, 'strength', aeroflyValues.wind_strength);
    all = valueReplace(all, 'direction_in_degree', aeroflyValues.wind_direction_in_degree);
    all = valueReplace(all, 'turbulence', aeroflyValues.wind_turbulence);
    all = valueReplace(all, 'thermal_activity', aeroflyValues.wind_thermal_activity);
    return all;
  });

  // restrict this to `tmsettings_clouds`
  configFileContent = configFileContent.replace(/<\[tmsettings_clouds\][\s\S]+?\s>/, (all) => {
    const cloudTypes = ['cirrus', 'cumulus', 'cumulus_mediocris'];
    // Reset clouds
    cloudTypes.forEach((cloud) => {
      all = valueReplace(all, cloud + '_height', 0);
      all = valueReplace(all, cloud + '_density', 0);
    });
    if (aeroflyValues.clouds) {
      // Clouds from top to bottom
      aeroflyValues.clouds.reverse().forEach((cloud, index) => {
        all = valueReplace(all, cloudTypes[index] + '_height', cloud.height);
        all = valueReplace(all, cloudTypes[index] + '_density', cloud.density);
      });
    }
    return all;
  });

  return {
    output: function() {
      return configFileContent;
    },
    save: function() {
      try {
        fs.writeFileSync(filename, configFileContent);
      } catch (error) {
        throw new Error('File is not writable: ' +  filename);
      }
    }
  };
};

module.exports = aeroflyWriter;
