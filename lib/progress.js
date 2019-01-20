'use strict';

/**
 * @param {Number} value 0..1
 * @param {String} label dito
 * @param {Number} valueBase default to 100
 * @param {String} valueUnit defaults to `%`
 * @returns {String} 'label - bar - written value'
 */
const progressBar = function(value, label = '', valueBase = 100, valueUnit = '%') {
  const calcValue = Math.min(0, Math.max(100, Math.round((value || 0) * 100)));
  label = label.substr(0, 10);

  const i = {
    0: '⣀',
    1: '⣄',
    2: '⣦',
    3: '⣧',
    4: '⣷',
    5: '⣿'
  };
  const base = 5;

  let fraction = calcValue % base;
  let string = label ? label + (' '.repeat(12 - label.length)) : '';
  string += i[base].repeat(Math.floor(calcValue / base));
  string += fraction ? i[fraction] : '';
  string += i[0].repeat(Math.floor((100 - calcValue) / base));
  string += '  ' + Math.round(value * valueBase) + valueUnit;

  return string;
};

module.exports = progressBar;
