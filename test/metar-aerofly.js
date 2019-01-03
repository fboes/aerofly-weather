'use strict';

const assert      = require('assert');

const metarObject = require('../lib/metar-object');
const metarToAerofly = require('../lib/metar-aerofly');

describe('metarToAerofly', function() {

  it('should convert METAR object to Aerofly object', function() {
    const metarData     = metarObject("KPIE 291230Z 33021G30KT 10SM BKN029 18/12 A2984 RMK AO2 PK WND 32030/1344 SLP103 T01780117");
    const aeroflyObject = metarToAerofly(metarData);

    //console.log(aeroflyObject);

    assert.ok(aeroflyObject);
    assert.strictEqual(aeroflyObject.time_day,  29);
  });
});
