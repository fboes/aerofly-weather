'use strict';

/**
 * Blend between two METAR objects
 * @param {Object} fromMetar METAR object
 * @param {Object} toMetar METAR object
 * @returns {Object} methods for blending METAR objects
 */
const metarBlender = function(fromMetar, toMetar) {
  [0, 1, 2].forEach((index) => {
    if(!fromMetar.clouds[index]) {
      fromMetar.clouds[index] = { code: 'CLR', base_feet_agl: 30000, base_meters_agl: 1000 };
    }
    if(!toMetar.clouds[index]) {
      toMetar.clouds[index] = { code: 'CLR', base_feet_agl: 30000, base_meters_agl: 1000 };
    }
  });
  if(!fromMetar.ceiling) {
    fromMetar.ceiling = { code: 'CLR', base_feet_agl: 30000, base_meters_agl: 1000 };
  }
  if(!toMetar.ceiling) {
    toMetar.ceiling = { code: 'CLR', base_feet_agl: 30000, base_meters_agl: 1000 };
  }

  const _private = {};
  const _public = {};

  /**
   * @param {Number} from dito
   * @param {Number} to   dito
   * @param {Number} percentage 0 = `from`, 1 = `to`
   * @return {Number} blended value
   */
  _private.blendValue = function(from, to, percentage) {
    return (from * percentage) + (to * (1 - percentage));
  };

  _private.blendObject = function(keys, from, to, percentage) {
    let obj = {};
    keys.forEach((key) => {
      if (from[key] !== undefined && to[key] !== undefined) {
        obj[key] = _private.blendValue(from[key], to[key], percentage);
      }
    });
    return obj;
  };

  /**
   * @param {Number} from dito
   * @param {Number} to   dito
   * @param {Number} percentage 0 = `from`, 1 = `to`
   * @return {Object} blended value
   */
  _private.blendCloud = function(from, to, percentage) {
    return {
      code: percentage < 0.5 ? from.code : to.code,
      base_feet_agl: _private.blendValue(from.base_feet_agl, to.base_feet_agl, percentage),
      base_meters_agl: _private.blendValue(from.base_meters_agl, to.base_meters_agl, percentage)
    };
  };

  /**
   * @param {Number} percentage 0 = `from`, 1 = `to`
   * @return {Object} blended METAR object
   */
  _public.blend = function(percentage) {
    percentage = Math.min(1, Math.max(0, percentage));
    if (percentage === 0) {
      return fromMetar;
    } else if (percentage === 1) {
      return toMetar;
    }

    return {
      barometer: _private.blendObject(
        ['hg', 'kpa', 'mb'],
        fromMetar.barometer,
        toMetar.barometer,
        percentage
      ),
      ceiling: _private.blendCloud(fromMetar.ceiling, toMetar.ceiling, percentage),
      clouds: [
        _private.blendCloud(fromMetar.clouds[0], toMetar.clouds[0], percentage),
        _private.blendCloud(fromMetar.clouds[1], toMetar.clouds[1], percentage),
        _private.blendCloud(fromMetar.clouds[2], toMetar.clouds[2], percentage)
      ],
      dewpoint: _private.blendObject(
        ['celsius', 'fahrenheit'],
        fromMetar.dewpoint,
        toMetar.dewpoint,
        percentage
      ),
      humidity_percent: _private.blendValue(fromMetar.humidity_percent, toMetar.humidity_percent, percentage),
      temperature: _private.blendObject(
        ['celsius', 'fahrenheit'],
        fromMetar.temperature,
        toMetar.temperature,
        percentage
      ),
      visibility: _private.blendObject(
        ['miles', 'meters'],
        fromMetar.visibility,
        toMetar.visibility,
        percentage
      ),
      wind: _private.blendObject(
        ['degrees', 'speed_kts', 'speed_mph', 'speed_mps', 'gust_kts', 'gust_mph', 'gust_mps'],
        fromMetar.wind,
        toMetar.wind,
        percentage
      )
    };
  };

  return _public;
};

module.exports = metarBlender;
