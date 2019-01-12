'use strict';

const assert      = require('assert');

const argumentor = require('../lib/argumentor');

describe('argumentor', function() {

  const testCases = [
    {
      input: ['node', 'test.js'],
      expected: { _: [] },
      output: false
    },
    {
      input: ['node', 'test.js', 'a', 'b', 'c'],
      expected: {
        _: [ 'a', 'b', 'c' ]
      },
      output: false
    },
    {
      input: ['node', 'test.js', 'a', '--test=1', 'c'],
      expected: {
        _: [ 'a', 'c' ],
        test: 1
      },
      output: false
    },
    {
      input: ['node', 'test.js', 'a', '--test', 'c'],
      expected: {
        _: [ 'a', 'c' ],
        test: true
      },
      output: false
    }
  ];

  testCases.forEach(function(test) {
    it('must convert "' + test.input.join(' ') + '"', function() {
      const args = argumentor(test.input);
      if (test.output) {
        console.log(args);
      }
      assert.ok(args);
      assert.deepEqual(args, test.expected);
    });
  });
});
