'use strict';

/**
 * Convert METAR object into Aerofly values.
 *
 * Allowed `options`:
 *
 * * maxCloudsHeight:  40000, // ft = 100% Aerofly
 * * maxWind:          40,    // kt = 100% Aerofly
 * * maxVisibility:    20000, // m  = 100% Aerofly
 * * maxTurbulence:    20,    // kt = 100% Aerofly
 * * minTemperature:   5,     // °C = 0% Aerofly
 * * maxTemperature:   30,    // °C = 100% Aerofly
 * * hourOffset:       0.0    // Change time by X hours
 * * noRandom:         false, // Deactivate randomization of values
 *
 * @param   {Object} metarObject from metarParser
 * @param   {Object} options   see above
 * @returns {Object} with Aerofly information
 */
const metarToAerofly = function(metarObject, options = {}) {
  options.maxCloudsDensity  = 8;
  options.maxCloudsHeight   = Number(options.maxCloudsHeight)  || 40000; // ft
  options.maxWind           = Number(options.maxWind)          || 40; // kt
  options.maxVisibility     = Number(options.maxVisibility)    || 20000; // m
  options.maxTurbulence     = Number(options.maxTurbulence)    || 20; // kt
  options.minTemperature    = Number(options.minTemperature)   || 5; // °C
  options.maxTemperature    = Number(options.maxTemperature)   || 30; // °C
  options.hourOffset        = Number(options.hourOffset)       || 0.0;
  options.noRandom          = options.noRandom                 || false;

  // ---------------------------------------------------------------------------

  const _private = {};
  const _public  = {};

  _private.aeroflyValues = {};

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
   * @param {Number} value dito
   * @param {Number} max   0 <= value < max
   * @returns {Number} with `value` being between 0 and `max`
   */
  _private.getRotationalValue = function(value, max) {
    if (max <= 0) {
      throw Error('max value must be positive');
    }
    while (value >= max) {
      value -= max;
    }
    while (value < 0) {
      value += max;
    }
    return value;
  };

  /**
   * @param {Number}  value 0..1
   * @param {Boolean} notMoreThan1   if set to `true`, `value` is allowed to be bigger than 1
   * @returns {Number} with `value` being between 0 and 1 / unlimited
   */
  _private.percent = function(value, notMoreThan1 = false) {
    value = value || 0;
    if (notMoreThan1) {
      value = Math.min(1, value);
    }
    return Math.max(0, value);
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
    if (conditions){
      conditions = conditions.map((c) => {
        return c.code;
      });
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
    }
    // Make some extra gusts (Gusts are only reported if it is above the mean wind speed by 10kts or more)
    gust_kts += Math.sqrt(gust_kts);
    return gust_kts;
  };

  /**
   * @param   {Number} meters visibility range
   * @returns {Number} visibility, 0..1
   */
  _public.setVisibility = function(meters) {
    const maxMiles = 10 * 1609;
    meters = Math.min(maxMiles, meters);
    if (options.maxVisibility > 9999 && (meters === 9999 || meters === 10000)) {
      // because meters cannot be greater than 9999
      // but miles can reach up to 10sm
      // set 9999 meters to 10 sm
      meters = maxMiles;
    }
    _private.aeroflyValues.visibility = _private.percent(meters / options.maxVisibility, true);
    if (options.maxVisibility > maxMiles) {
      // max visibility range cannot be reached, because in METAR there is only <= 10 sm
      // Interpolate the last part
      _private.aeroflyValues.visibility +=
        (1 - (maxMiles / options.maxVisibility)) * Math.pow((meters / maxMiles), 8)
      ;
    }
    return _private.aeroflyValues.visibility;
  };

  /**
   * @param   {Date}   dateObject dito
   * @returns {Object} time
   */
  _public.setDate = function(dateObject) {
    _private.aeroflyValues.time = {
      year:  dateObject.getUTCFullYear(),
      month: (dateObject.getUTCMonth() + 1),
      day:   dateObject.getUTCDate(),
      hours: _private.getRotationalValue(
        dateObject.getUTCHours()
        + (dateObject.getUTCMinutes() / 60)
        + options.hourOffset,
        24
      )
    };
    return _private.aeroflyValues.time;
  };

  /**
   * @param   {Number} degrees   dito
   * @param   {Number} speed_kts dito
   * @param   {Number} gust_kts  dito
   * @param   {Number} degrees_from  dito
   * @param   {Number} degrees_to    dito
   * @returns {Object} wind
   */
  _public.setWind = function(degrees, speed_kts, gust_kts, degrees_from, degrees_to) {
    speed_kts = speed_kts || 0;
    gust_kts  = gust_kts || speed_kts;

    // In percent, 0..1
    const degreesRange = (degrees_to === undefined || degrees_from === undefined)
      ? 0
      : Math.abs(degrees_to - degrees_from) / 360
    ;

    // For 16kts <=> 100 %
    // f(x) = 8 * (x + x^2)
    // f(y) = sqrt((y / 8) + 0.25) - 0.5
    let combinedWindForce = (speed_kts + gust_kts) / 2;
    combinedWindForce = Math.sqrt((combinedWindForce / (options.maxWind / 2)) + 0.25) - 0.5;

    if (gust_kts === speed_kts) {
      gust_kts = _private.makeGust(speed_kts, metarObject.conditions);
    }

    _private.aeroflyValues.wind = {
      direction_in_degree: _private.getRotationalValue(degrees || 0, 360),
      strength: _private.percent(combinedWindForce),
      turbulence: _private.percent(
        Math.max(degreesRange, (gust_kts - speed_kts) / options.maxTurbulence),
        true
      )
    };
    return _private.aeroflyValues.wind;
  };

  /**
   * @param   {Number} celsius  dito
   * @returns {Number} thermal_activity, 0..1
   */
  _public.setThermalActivity = function(celsius) {
    _private.aeroflyValues.thermal_activity = _private.percent(
      (celsius - options.minTemperature) / (options.maxTemperature - options.minTemperature), true
    );
    return _private.aeroflyValues.thermal_activity;
  };

  /**
   * @param   {Object} metarObject like object from metarParser
   * @returns {Object} with converted values for Aerofly
   */
  _public.convert = function(metarObject) {
    _private.aeroflyValues = {};

    if (metarObject.observed !== undefined) {
      _public.setDate(metarObject.observed);
    }
    if (metarObject.wind !== undefined) {
      _public.setWind(
        metarObject.wind.degrees,
        metarObject.wind.speed_kts,
        metarObject.wind.gust_kts
      );
    }
    _public.setVisibility((metarObject.visibility !== undefined && metarObject.visibility.meters_float !== undefined)
      ? metarObject.visibility.meters_float
      : 9999
    );
    if (metarObject.clouds) {
      _private.aeroflyValues.clouds = metarObject.clouds.map((cloud) => {
        let cloudDensity = _private.getCloudDensity(cloud.code);
        return {
          height: cloud.base_feet_agl / options.maxCloudsHeight,
          density: _private.randBetween(cloudDensity.min, cloudDensity.max) / options.maxCloudsDensity
        };
      });
    }
    _public.setThermalActivity((metarObject.temperature !== undefined && metarObject.temperature.celsius !== undefined)
      ? metarObject.temperature.celsius
      : 0
    );
    return _private.aeroflyValues;
  };

  return _public.convert(metarObject);
};

module.exports = metarToAerofly;
