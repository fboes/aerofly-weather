'use strict';

/**
 * Convert METAR object into Aerofly values.
 *
 * Allowed `options`:
 *
 * * maxCloudsHeight:  30000, // ft
 * * maxCloudsDensity: 8,     // integer
 * * maxWind:          30,    // kt
 * * maxVisibility:    10000, // m
 * * maxTurbulence:    15,    // kt
 * * maxTemperature:   30,    // °C
 * * noRandom:         false, // Deactivate randomization of values
 * * hourOffset:       0      // Change time by X hours
 *
 * @param   {Object} metarObject from metarParser
 * @param   {Object} options   see above
 * @returns {Object} with Aerofly information
 */
const metarToAerofly = function(metarObject, options = {}) {
  options.maxCloudsHeight   = Number(options.maxCloudsHeight)  || 30000; // ft
  options.maxCloudsDensity  = Number(options.maxCloudsDensity) || 8;
  options.maxWind           = Number(options.maxWind)          || 60; // kt
  options.maxVisibility     = Number(options.maxVisibility)    || 10000; // m
  options.maxTurbulence     = Number(options.maxTurbulence)    || 15; // kt
  options.maxTemperature    = Number(options.maxTemperature)   || 40; // °C
  options.noRandom          = options.noRandom                 || false;
  options.hourOffset        = Number(options.hourOffset)       || 0;

  const randBetween = function(min, max) {
    const random = options.noRandom ? 0.5 : Math.random();
    return random * (max - min) + min;
  };

  const limitHours = function(hours) {
    while (hours >= 24) {
      hours -= 24;
    }
    while (hours < 0) {
      hours += 24;
    }
    return hours;
  };

  // ---------------------------------------------------------------------------

  let aeroflyValues = {};
  if (metarObject.observed !== undefined) {
    aeroflyValues.time_year  = metarObject.observed.getUTCFullYear();
    aeroflyValues.time_month = (metarObject.observed.getUTCMonth() + 1);
    aeroflyValues.time_day   = metarObject.observed.getUTCDate();
    aeroflyValues.time_hours = limitHours(
      metarObject.observed.getUTCHours()
      + (metarObject.observed.getUTCMinutes() / 60)
      + options.hourOffset
    );

  }
  if (metarObject.wind !== undefined) {
    aeroflyValues.wind_direction_in_degree  = metarObject.wind.degrees;
    aeroflyValues.wind_strength = (metarObject.wind.speed_kt + metarObject.wind.gust_kt) / 2 / options.maxWind;
    if (metarObject.wind.gust_kt === metarObject.wind.speed_kt) {
      // Make some extra turbulence
      metarObject.wind.gust_kt += Math.sqrt(metarObject.wind.gust_kt);
    }
    aeroflyValues.wind_turbulence = Math.min(
      1,
      (metarObject.wind.gust_kt - metarObject.wind.speed_kt) / options.maxTurbulence
    );
  }
  if (metarObject.visibility_m !== undefined) {
    aeroflyValues.visibility = Math.min(1, metarObject.visibility_m / options.maxVisibility);
  }
  if (metarObject.clouds) {
    aeroflyValues.clouds = metarObject.clouds.map((cloud) => {
      return {
        height: Math.min(1, cloud.baseAgl_ft / options.maxCloudsHeight),
        density: randBetween(cloud.minDensity, cloud.maxDensity) / options.maxCloudsDensity
      };
    });
  }
  if (metarObject.temperature_c !== undefined) {
    aeroflyValues.wind_thermal_activity = Math.min(1, Math.max(0,
      metarObject.temperature_c / options.maxTemperature
    ));
  }
  return aeroflyValues;
};

module.exports = metarToAerofly;
