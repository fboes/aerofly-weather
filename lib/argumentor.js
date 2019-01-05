'use strict';

/**
 * Convert process.argv into structured object
 *
 * @param   {Array}  args like process process.argv
 * @returns {Object}      structured object
 */
const argumentor = function(args) {
  const newArgs = {
    _: []
  };

  args.forEach(function(arg, i) {
    if (i >= 2) {
      let m = arg.match(/^--?(.+?)(?:=(.+))?$/);
      if (m) {
        newArgs[m[1].replace(/-+/g, '')] = m[2] || true;
      } else {
        newArgs['_'].push(arg);
      }
    }
  });

  return newArgs;
};

module.exports = argumentor;
