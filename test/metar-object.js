'use strict';

const assert      = require('assert');

const metarObject = require('../lib/metar-object');

describe('metarObject', function() {

  it('should convert METAR string from https://api.checkwx.com/', function() {
    const metarData = metarObject("KPIE 291353Z 33021G30KT 10SM BKN029 18/12 A2984 RMK AO2 PK WND 32030/1344 SLP103 T01780117");

    //console.log(metarData);

    assert.ok(metarData);
    assert.strictEqual(metarData.icao,          'KPIE');
    assert.strictEqual(metarData.temperature_c, 18);
  });

  it('should convert METAR string from Wikipedia', function() {
    const metarData = metarObject("EDDS 081620Z 29010KT 9999 FEW040TCU 09/M03 Q1012 NOSIG");

    //console.log(metarData);

    assert.ok(metarData);
    assert.strictEqual(metarData.icao,          'EDDS');
    assert.strictEqual(metarData.temperature_c, 9);
  });
});
