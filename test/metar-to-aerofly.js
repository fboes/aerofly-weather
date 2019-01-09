'use strict';

const assert      = require('assert');

const metarToAerofly = require('../lib/metar-to-aerofly');

describe('metarToAerofly', function() {

  it('must convert METAR object to Aerofly object', function() {
    const aeroflyObject = metarToAerofly({
      icao: 'KPIE',
      observed: new Date('2019-01-29T12:30:18.825Z'),
      wind: { degrees: 270, speed_kts: 21, gust_kts: 30 },
      visibility: { meters: 20000 },
      clouds: [
        { base_feet_agl: 2900, minDensity: 5, maxDensity: 7 }
      ],
      temperature: {
        celsius: 18
      },
      barometer: {
        kpa: 101.0
      }
    });

    // console.log(aeroflyObject);
    assert.ok(aeroflyObject);
    assert.strictEqual(aeroflyObject.time_day,      29);
    assert.strictEqual(aeroflyObject.time_month,    1);
    assert.strictEqual(aeroflyObject.time_hours,    12.5);
    assert.strictEqual(aeroflyObject.wind_direction_in_degree,  270, 'Wind direction');
    assert.strictEqual(aeroflyObject.visibility,    1, 'Visibility');
    assert.strictEqual(aeroflyObject.clouds.length, 1, 'Clouds');
  });

  it('must have proper wind', function() {
    const aeroflyObject = metarToAerofly({
      icao: 'KPIE',
      observed: new Date('2019-01-29T12:30:18.825Z'),
      wind: { degrees: 270, speed_kts: 40, gust_kts: 40 },
      visibility: { meters: 20000 },
      clouds: [
        { base_feet_agl: 2900, minDensity: 5, maxDensity: 7 }
      ],
      temperature: {
        celsius: 18
      },
      barometer: {
        kpa: 101.0
      }
    }, {
      maxWind: 40
    });

    assert.ok(aeroflyObject);
    assert.strictEqual(aeroflyObject.time_day,      29);
    assert.strictEqual(aeroflyObject.time_month,    1);
    assert.strictEqual(aeroflyObject.time_hours,    12.5);
    assert.strictEqual(aeroflyObject.wind_direction_in_degree,  270);
    assert.strictEqual(aeroflyObject.wind_strength, 1, 'Testing sqrt formula for 40kts');
    assert.strictEqual(aeroflyObject.visibility,    1);
    assert.strictEqual(aeroflyObject.clouds.length, 1);
  });

  it('must have proper wind #2', function() {
    const aeroflyObject = metarToAerofly({
      icao: 'KPIE',
      observed: new Date('2019-01-29T12:30:18.825Z'),
      wind: { degrees: 270, speed_kts: 20, gust_kts: 20 },
      visibility: { meters: 20000 },
      clouds: [
        { base_feet_agl: 2900, minDensity: 5, maxDensity: 7 }
      ],
      temperature: {
        celsius: 18
      },
      barometer: {
        kpa: 101.0
      }
    }, {
      maxWind: 20
    });

    assert.ok(aeroflyObject);
    assert.strictEqual(aeroflyObject.time_day,      29);
    assert.strictEqual(aeroflyObject.time_month,    1);
    assert.strictEqual(aeroflyObject.time_hours,    12.5);
    assert.strictEqual(aeroflyObject.wind_direction_in_degree,  270);
    assert.strictEqual(aeroflyObject.wind_strength, 1, 'Testing sqrt formula for 40kts');
    assert.strictEqual(aeroflyObject.visibility,    1);
    assert.strictEqual(aeroflyObject.clouds.length, 1);
  });

  it('must convert METAR object to Aerofly object #3', function() {
    const aeroflyObject = metarToAerofly({
      icao: 'KPIE',
      observed: new Date('2019-01-29T18:30:18.825Z'),
      wind: { degrees: 270, speed_kts: 5, gust_kts: 5 },
      visibility: { meters: 20000 },
      clouds: [
        { base_feet_agl: 2900, minDensity: 5, maxDensity: 7 }
      ],
      temperature: {
        celsius: 18
      },
      barometer: {
        kpa: 101.0
      }
    }, {
      hourOffset: 12
    });

    // console.log(aeroflyObject);
    assert.ok(aeroflyObject);
    assert.strictEqual(aeroflyObject.time_day,      29);
    assert.strictEqual(aeroflyObject.time_month,    1);
    assert.strictEqual(aeroflyObject.time_hours,    6.5, 'Time has been incremented by maxValues.hourOffset');
    assert.strictEqual(aeroflyObject.wind_direction_in_degree,  270);
    assert.strictEqual(aeroflyObject.visibility,    1);
    assert.strictEqual(aeroflyObject.clouds.length, 1);
  });
});
