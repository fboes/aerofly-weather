'use strict';

/**
 * Convert METAR object into Aerofly values.
 *
 * Allowed `options`:
 *
 * * maxCloudsHeight:  40000, // ft = 100% Aerofly
 * * maxCloudsDensity: 8,     // integer = 100% Aerofly
 * * maxWind:          40,    // kt = 100% Aerofly
 * * maxVisibility:    10000, // m  = 100% Aerofly
 * * maxTurbulence:    20,    // kt = 100% Aerofly
 * * maxTemperature:   30,    // °C = 100% Aerofly
 * * noRandom:         false, // Deactivate randomization of values
 * * hourOffset:       0      // Change time by X hours
 *
 * @param   {Object} metarObject from metarParser
 * @param   {Object} options   see above
 * @returns {Object} with Aerofly information
 */
const metarToAerofly = function(metarObject, options = {}) {
  options.maxCloudsHeight   = Number(options.maxCloudsHeight)  || 40000; // ft
  options.maxCloudsDensity  = Number(options.maxCloudsDensity) || 8;
  options.maxWind           = Number(options.maxWind)          || 40; // kt
  options.maxVisibility     = Number(options.maxVisibility)    || 10000; // m
  options.maxTurbulence     = Number(options.maxTurbulence)    || 20; // kt
  options.maxTemperature    = Number(options.maxTemperature)   || 30; // °C
  options.noRandom          = options.noRandom                 || false;
  options.hourOffset        = Number(options.hourOffset)       || 0;

  // ---------------------------------------------------------------------------

  const _private = {};
  const _public  = {};

  /**
   * @param {Number}   min dito
   * @param {Number}   max dito
   * @returns {Number} random floating number betwenn `min` and `max`
   */
  _private.randBetween = function(min, max) {
    const random = options.noRandom ? 0.5 : Math.random();
    return random * (max - min) + min;
  };

  /**
   * @param {Number} hours floating time
   * @returns {Number} with `hours` being between 0 and 23.9999
   */
  _private.limitHours = function(hours) {
    while (hours >= 24) {
      hours -= 24;
    }
    while (hours < 0) {
      hours += 24;
    }
    return hours;
  };

  /**
   * @param {String} code for cloud like 'FEW'
   * @returns {Object} with min: INT, max: INT
   */
  _private.getCloudDensity = function(code) {
    switch (code) {
      case 'FEW': return { min: 1, max: 2};
      case 'SCT': return { min: 3, max: 4};
      case 'BKN': return { min: 5, max: 7};
      case 'OVC': return { min: 8, max: 8};
      default: return { min: 0, max: 0.5};
    }
  };

  /**
   * @param {Number} wind_speed_kts in kts
   * @param {Array} conditions of strings
   * @returns {Number} gust speed in kts
   */
  _private.makeGust = function(wind_speed_kts, conditions) {
    let gust_kts = wind_speed_kts;
    // Get gusts from weather
    if(conditions) {
      if (conditions.indexOf('WS') >= 0) {
        // Wind Shear
        gust_kts = Math.max(wind_speed_kts + 10, 45);
      } else if (conditions.indexOf('SS') >= 0 || conditions.indexOf('DS') >= 0) {
        // Storm
        gust_kts = Math.max(wind_speed_kts + 5, 40);
      } else if (conditions.indexOf('FC') >= 0) {
        // Funnel cloud(s) (tornado or waterspout)
        gust_kts = Math.max(wind_speed_kts + 20, 90);
      } else if (conditions.indexOf('SQ') >= 0) {
        // Squalls
        gust_kts = wind_speed_kts += 10;
      }
    }
    // Make some extra turbulence
    gust_kts += Math.sqrt(gust_kts);
    return gust_kts;
  };

  /**
   * @param {Object} metarObject like object from metarParser
   * @returns {Object} with converted values for Aerofly
   */
  _public.convert = function(metarObject) {
    let aeroflyValues = {};
    if (metarObject.observed !== undefined) {
      aeroflyValues.time_year  = metarObject.observed.getUTCFullYear();
      aeroflyValues.time_month = (metarObject.observed.getUTCMonth() + 1);
      aeroflyValues.time_day   = metarObject.observed.getUTCDate();
      aeroflyValues.time_hours = _private.limitHours(
        metarObject.observed.getUTCHours()
        + (metarObject.observed.getUTCMinutes() / 60)
        + options.hourOffset
      );

    }
    if (metarObject.wind !== undefined) {
      aeroflyValues.wind_direction_in_degree  = metarObject.wind.degrees || 0;
      if (!metarObject.wind.speed_kts) {
        metarObject.wind.speed_kts = 0;
      }
      if (!metarObject.wind.gust_kts) {
        metarObject.wind.gust_kts = metarObject.wind.speed_kts;
      }
      // f(x) = 20 * (x + x^2)
      // f(y) = sqrt(0.05 * y + 0.25) - 0.5
      let combinedWindForce = (metarObject.wind.speed_kts + metarObject.wind.gust_kts) / 2;
      combinedWindForce = (combinedWindForce / options.maxWind) * 40;
      aeroflyValues.wind_strength = Math.sqrt(0.05 * combinedWindForce + 0.25) - 0.5;
      if (metarObject.wind.gust_kts === metarObject.wind.speed_kts) {
        metarObject.wind.gust_kts = _private.makeGust(metarObject.wind.speed_kts, metarObject.conditions);
      }
      aeroflyValues.wind_turbulence = Math.min(
        1,
        (metarObject.wind.gust_kts - metarObject.wind.speed_kts) / options.maxTurbulence
      );
    }
    if (metarObject.visibility !== undefined && metarObject.visibility.meters !== undefined) {
      aeroflyValues.visibility = Math.min(1, Number(metarObject.visibility.meters) / options.maxVisibility);
    }
    if (metarObject.clouds) {
      aeroflyValues.clouds = metarObject.clouds.map((cloud) => {
        let cloudDensity = _private.getCloudDensity(cloud.code);
        return {
          height: cloud.base_feet_agl / options.maxCloudsHeight,
          density: _private.randBetween(cloudDensity.min, cloudDensity.max) / options.maxCloudsDensity
        };
      });
    }
    if (metarObject.temperature !== undefined && metarObject.temperature.celsius !== undefined) {
      aeroflyValues.wind_thermal_activity = Math.min(1, Math.max(0,
        metarObject.temperature.celsius / options.maxTemperature
      ));
    }
    return aeroflyValues;
  };

  return _public.convert(metarObject);
};

module.exports = metarToAerofly;
