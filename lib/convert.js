'use strict';

/**
 * Convert units
 */
const convert = {
  celsiusToFahrenheit: function(celsius) {
    return celsius * 1.8 + 32;
  },

  feetToMeters: function(fett) {
    return fett * 0.3048;
  },

  milesToMeters: function(miles) {
    return miles * 1609.344;
  },

  metersToMiles: function(meters) {
    return meters / 1609.344;
  },

  hginToKpa: function(hgin) {
    return hgin / 0.29529988;
  },

  kpaToHgin: function(kpa) {
    return kpa * 0.29529988;
  }
};

module.exports = convert;
