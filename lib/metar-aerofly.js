'use strict';

/**
 * Convert METAR object into Aerofly values
 * @param   {Object} metarObject from metarParser
 * @returns {Object} with Aerofly information
 */
const metarToAeroflyValues = function(metarObject) {
  const maxValues = {
    cloudsHeight: 30000, // ft
    cloudsDensity: 8,
    wind: 50, // kt
    visibility: 20000, // m
    turbulence: 25, // kt
    maxTemperature: 30 // °C
  };

  const randBetween = function(min, max, multiplier = 1) {
    return (Math.random() * (max - min) + min) * multiplier;
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

module.exports = metarToAeroflyValues;
