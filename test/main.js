'use strict';

const assert         = require('assert');
const path           = require('path');

const main  = require('../lib/main');

describe('main', function() {
  it('should run the main lib', function() {
    const newMain = main();

    assert.ok(newMain);

    assert.doesNotThrow(() => {
      newMain.fromString(
        'KSFO 290756Z 29010KT 10SM FEW006 SCT140 SCT200 11/08 A3000 RMK AO2 SLP158 T01110083 401780100', 
        path.join(__dirname, '/main.mcf'), 
        {
          'dry-run': true,
          'quiet': true
        }
      );
    });
  });
});
