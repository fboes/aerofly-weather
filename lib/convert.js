'use strict';


const convert = {
  celsiusToFahrenheit: function(value) {
    return value * 1.8 + 32;
  },

  feetToMeters: function(value) {
    return value * 0.3048;
  },

  milesToMeters: function(value) {
    return value * 1609;
  },

  metersToMiles: function(value) {
    return value / 1609;
  }
};

module.exports = convert;
