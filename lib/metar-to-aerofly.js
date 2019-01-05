'use strict';

/**
 * Convert METAR object into Aerofly values
 *
 * maxValues = {
 *    cloudsHeight:   30000, // ft
 *    cloudsDensity:  8,
 *    wind:           30, // kt
 *    visibility:     10000, // m
 *    turbulence:     15, // kt
 *    maxTemperature: 30, // °C
 *    noRandom:       false
 * };
 *
 * @param   {Object} metarObject from metarParser
 * @param   {Object} maxValues   see above
 * @returns {Object} with Aerofly information
 */
const metarToAerofly = function(metarObject, maxValues = {}) {
  maxValues.cloudsHeight   = maxValues.cloudsHeight   || 30000; // ft
  maxValues.cloudsDensity  = maxValues.cloudsDensity  || 8;
  maxValues.wind           = maxValues.wind           || 60; // kt
  maxValues.visibility     = maxValues.visibility     || 10000; // m
  maxValues.turbulence     = maxValues.turbulence     || 15; // kt
  maxValues.maxTemperature = maxValues.maxTemperature || 40; // °C
  maxValues.noRandom       = maxValues.noRandom       || false;

  const randBetween = function(min, max) {
    const random = maxValues.noRandom ? 0.5 : Math.random();
    return random * (max - min) + min;
  };

  let aeroflyValues = {};
  if (metarObject.observed !== undefined) {
    aeroflyValues.time_year  = metarObject.observed.getUTCFullYear();
    aeroflyValues.time_month = (metarObject.observed.getUTCMonth() + 1);
    aeroflyValues.time_day   = metarObject.observed.getUTCDate();
    aeroflyValues.time_hours = metarObject.observed.getUTCHours() + (metarObject.observed.getUTCMinutes() / 60);
  }
  if (metarObject.wind !== undefined) {
    aeroflyValues.wind_direction_in_degree  = metarObject.wind.degrees;
    aeroflyValues.wind_strength = (metarObject.wind.speed_kt + metarObject.wind.gust_kt) / 2 / maxValues.wind;
    if (metarObject.wind.gust_kt === metarObject.wind.speed_kt) {
      // Make some extra turbulence
      metarObject.wind.gust_kt += Math.sqrt(metarObject.wind.gust_kt);
    }
    aeroflyValues.wind_turbulence = Math.min(
      1,
      (metarObject.wind.gust_kt - metarObject.wind.speed_kt) / maxValues.turbulence
    );
  }
  if (metarObject.visibility_m !== undefined) {
    aeroflyValues.visibility = Math.min(1, metarObject.visibility_m / maxValues.visibility);
  }
  if (metarObject.clouds) {
    aeroflyValues.clouds = metarObject.clouds.map((cloud) => {
      return {
        height: Math.min(1, cloud.baseAgl_ft / maxValues.cloudsHeight),
        density: randBetween(cloud.minDensity, cloud.maxDensity) / maxValues.cloudsDensity
      };
    });
  }
  if (metarObject.temperature_c !== undefined) {
    aeroflyValues.wind_thermal_activity = Math.min(
      1,
      Math.max(0, metarObject.temperature_c / maxValues.maxTemperature)
    );
  }
  return aeroflyValues;
};

module.exports = metarToAerofly;
