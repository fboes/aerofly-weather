'use strict';

const readline = require('readline');
const util     = require('util');

/**
 * Fill out missing `values` by asking `questions`.
 * @param   {Object}  questions    with `key: Question`
 * @param   {Object}  values       current state with `key: value`
 * @param   {String}  questionFormat append to each question, `%s` is replace with `question`
 * @returns {Object}  with modified `values`
 */
const fillOutTheBlanks = async function(questions, values = {}, questionFormat = '%s?') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  /**
   * Write STDIN into values
   * @param {String} key dito
   * @param {String} question dito
   * @returns {Promise} with resolve(values);
   */
  const askForValue = function(key, question = '') {
    return new Promise((resolve) => {
      rl.question(util.format(questionFormat + ' ', question), (answer) => {
        values[key] = answer;
        resolve(values);
      });
    });
  };

  // Get the blanks
  for (let key in questions) {
    if (values[key] === undefined || values[key] === '') {
      values = await askForValue(key, questions[key]);
    }
  }
  rl.close();
  return values;
};

module.exports = fillOutTheBlanks;
