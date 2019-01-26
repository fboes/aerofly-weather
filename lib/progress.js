'use strict';

/**
 * @param {Number} value 0..1
 * @param {String} label dito
 * @param {Number} valueBase default to 100
 * @param {String} valueUnit defaults to `%`
 * @returns {String} 'label - bar - written value'
 */
const progressBar = function(value, label = '', valueBase = 100, valueUnit = '%') {
  const calcValue = Math.min(100, Math.max(0, Math.round((value || 0) * 100)));
  label = label.substr(0, 10);

  const i = {
    0: '-',
    1: '~',
    2: '='
  };
  const base = 5;

  let fraction = calcValue % base;
  let string = label ? label + (' '.repeat(12 - label.length)) : '';
  string += i[2].repeat(Math.floor(calcValue / base));
  string += fraction ? i[1] : '';
  string += i[0].repeat(Math.floor((100 - calcValue) / base));
  string += '  ' + Math.round(value * valueBase) + valueUnit;

  return string;
};

module.exports = progressBar;
