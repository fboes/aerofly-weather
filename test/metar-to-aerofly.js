'use strict';

const assert      = require('assert');

const metarToAerofly = require('../lib/metar-to-aerofly');

describe('metarToAerofly', function() {

  it('should convert METAR object to Aerofly object', function() {
    const aeroflyObject = metarToAerofly({
      icao: 'KPIE',
      observed: new Date('2019-01-29T12:30:18.825Z'),
      wind: { degrees: 270, speed_kt: 21, gust_kt: 30 },
      visibility_m: 20000,
      clouds: [
        { baseAgl_ft: 2900, minDensity: 5, maxDensity: 7 }
      ],
      temperature_c: 18,
      barometer_hpa: 1010
    });

    // console.log(aeroflyObject);
    assert.ok(aeroflyObject);
    assert.strictEqual(aeroflyObject.time_day,      29);
    assert.strictEqual(aeroflyObject.time_month,    1);
    assert.strictEqual(aeroflyObject.time_hours,    12.5);
    assert.strictEqual(aeroflyObject.wind_direction_in_degree,  270);
    assert.strictEqual(aeroflyObject.visibility,    1);
    assert.strictEqual(aeroflyObject.clouds.length, 1);
  });

  it('should convert METAR object to Aerofly object #2', function() {
    const aeroflyObject = metarToAerofly({
      icao: 'KPIE',
      observed: new Date('2019-01-29T12:30:18.825Z'),
      wind: { degrees: 270, speed_kt: 20, gust_kt: 20 },
      visibility_m: 20000,
      clouds: [
        { baseAgl_ft: 2900, minDensity: 5, maxDensity: 7 }
      ],
      temperature_c: 18,
      barometer_hpa: 1010
    });

    // console.log(aeroflyObject);
    assert.ok(aeroflyObject);
    assert.strictEqual(aeroflyObject.time_day,      29);
    assert.strictEqual(aeroflyObject.time_month,    1);
    assert.strictEqual(aeroflyObject.time_hours,    12.5);
    assert.strictEqual(aeroflyObject.wind_direction_in_degree,  270);
    assert.strictEqual(aeroflyObject.visibility,    1);
    assert.strictEqual(aeroflyObject.clouds.length, 1);
  });

  it('should convert METAR object to Aerofly object #3', function() {
    const aeroflyObject = metarToAerofly({
      icao: 'KPIE',
      observed: new Date('2019-01-29T12:30:18.825Z'),
      wind: { degrees: 270, speed_kt: 5, gust_kt: 5 },
      visibility_m: 20000,
      clouds: [
        { baseAgl_ft: 2900, minDensity: 5, maxDensity: 7 }
      ],
      temperature_c: 18,
      barometer_hpa: 1010
    });

    // console.log(aeroflyObject);
    assert.ok(aeroflyObject);
    assert.strictEqual(aeroflyObject.time_day,      29);
    assert.strictEqual(aeroflyObject.time_month,    1);
    assert.strictEqual(aeroflyObject.time_hours,    12.5);
    assert.strictEqual(aeroflyObject.wind_direction_in_degree,  270);
    assert.strictEqual(aeroflyObject.visibility,    1);
    assert.strictEqual(aeroflyObject.clouds.length, 1);
  });
});
