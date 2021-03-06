'use strict';

const assert      = require('assert');

const metarToAerofly = require('../lib/metar-to-aerofly');

describe('metarToAerofly', function() {

  it('must convert METAR object to Aerofly object', function() {
    const aeroflyObject = metarToAerofly().convert({
      icao: 'KPIE',
      observed: new Date('2019-01-29T12:30:18.825Z'),
      wind: { degrees: 270, speed_kts: 21, gust_kts: 30 },
      visibility: { meters_float: 20000 },
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
    assert.strictEqual(aeroflyObject.time.day,      29);
    assert.strictEqual(aeroflyObject.time.month,    1);
    assert.strictEqual(aeroflyObject.time.hours,    12.5);
    assert.strictEqual(aeroflyObject.wind.direction_in_degree,  270, 'Wind direction');
    assert.strictEqual(aeroflyObject.visibility,    1, 'Visibility');
    assert.strictEqual(aeroflyObject.clouds.length, 3, 'Clouds');
  });

  it('must have proper wind', function() {
    const aeroflyObject = metarToAerofly({
      maxWind: 16
    }).convert({
      icao: 'KPIE',
      observed: new Date('2019-01-29T12:30:18.825Z'),
      wind: { degrees: 270, speed_kts: 16, gust_kts: 16 },
      visibility: { meters_float: 20000 },
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

    assert.ok(aeroflyObject);
    assert.strictEqual(aeroflyObject.time.day,      29);
    assert.strictEqual(aeroflyObject.time.month,    1);
    assert.strictEqual(aeroflyObject.time.hours,    12.5);
    assert.strictEqual(aeroflyObject.wind.direction_in_degree,  270);
    assert.strictEqual(aeroflyObject.wind.strength, 1, 'Testing sqrt formula for 16kts');
    assert.strictEqual(aeroflyObject.visibility,    1);
    assert.strictEqual(aeroflyObject.clouds.length, 3);
    assert.notStrictEqual(aeroflyObject.clouds[0].density, 0);
    assert.notStrictEqual(aeroflyObject.clouds[0].height,  0);
    assert.strictEqual(aeroflyObject.clouds[1].density, 0);
    assert.strictEqual(aeroflyObject.clouds[1].height,  0);
    assert.strictEqual(aeroflyObject.clouds[2].density, 0);
    assert.strictEqual(aeroflyObject.clouds[2].height,  0);
  });

  it('must have proper wind #2', function() {
    const aeroflyObject = metarToAerofly({
      maxWind: 8
    }).convert({
      icao: 'KPIE',
      observed: new Date('2019-01-29T12:30:18.825Z'),
      wind: { degrees: 270, speed_kts: 8, gust_kts: 8 },
      visibility: { meters_float: 20000 },
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

    assert.ok(aeroflyObject);
    assert.strictEqual(aeroflyObject.time.day,      29);
    assert.strictEqual(aeroflyObject.time.month,    1);
    assert.strictEqual(aeroflyObject.time.hours,    12.5);
    assert.strictEqual(aeroflyObject.wind.direction_in_degree,  270);
    assert.strictEqual(aeroflyObject.wind.strength, 1, 'Testing sqrt formula for 16kts');
    assert.strictEqual(aeroflyObject.visibility,    1);
    assert.strictEqual(aeroflyObject.clouds.length, 3);
    assert.notStrictEqual(aeroflyObject.clouds[0].density, 0);
    assert.notStrictEqual(aeroflyObject.clouds[0].height,  0);
    assert.strictEqual(aeroflyObject.clouds[1].density, 0);
    assert.strictEqual(aeroflyObject.clouds[1].height,  0);
    assert.strictEqual(aeroflyObject.clouds[2].density, 0);
    assert.strictEqual(aeroflyObject.clouds[2].height,  0);
  });

  it('must handle excess values', function() {
    const aeroflyObject = metarToAerofly({
      maxWind: 20,
      maxVisibility: 1000,
      maxTemperature: 5
    }).convert({
      icao: 'KPIE',
      observed: new Date('2019-01-29T23:59:59.999Z'),
      wind: { degrees: -90, speed_kts: 40, gust_kts: 40 },
      visibility: { meters_float: 20000 },
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

    assert.ok(aeroflyObject);
    assert.strictEqual(aeroflyObject.time.day,      29);
    assert.strictEqual(aeroflyObject.time.month,    1);
    assert.ok(aeroflyObject.time.hours < 24);
    assert.strictEqual(aeroflyObject.wind.direction_in_degree,  270, '-90° is 270°');
    assert.ok(aeroflyObject.wind.strength > 1);
    assert.strictEqual(aeroflyObject.visibility,       1, 'Limit to 1');
    assert.strictEqual(aeroflyObject.thermal_activity, 1, 'Limit to 1');
    assert.notStrictEqual(aeroflyObject.clouds[0].density, 0);
    assert.notStrictEqual(aeroflyObject.clouds[0].height,  0);
    assert.strictEqual(aeroflyObject.clouds[1].density, 0);
    assert.strictEqual(aeroflyObject.clouds[1].height,  0);
    assert.strictEqual(aeroflyObject.clouds[2].density, 0);
    assert.strictEqual(aeroflyObject.clouds[2].height,  0);
  });

  it('must convert METAR object to Aerofly object #3', function() {
    const aeroflyObject = metarToAerofly({
      hourOffset: 12
    }).convert({
      icao: 'KPIE',
      observed: new Date('2019-01-29T18:30:18.825Z'),
      wind: { degrees: 270, speed_kts: 5, gust_kts: 5 },
      visibility: { meters_float: 9999 },
      clouds: [
        { base_feet_agl: 2900, minDensity: 5, maxDensity: 7 },
        { base_feet_agl: 4500, minDensity: 1, maxDensity: 2 }
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
    assert.strictEqual(aeroflyObject.time.day,      29);
    assert.strictEqual(aeroflyObject.time.month,    1);
    assert.strictEqual(aeroflyObject.time.hours,    6.5, 'Time has been incremented by maxValues.hourOffset');
    assert.strictEqual(aeroflyObject.wind.direction_in_degree,  270);
    assert.strictEqual(aeroflyObject.visibility,    1);
    assert.strictEqual(aeroflyObject.clouds.length, 3);
    assert.notStrictEqual(aeroflyObject.clouds[0].density, 0);
    assert.notStrictEqual(aeroflyObject.clouds[0].height,  0);
    assert.notStrictEqual(aeroflyObject.clouds[1].density, 0);
    assert.notStrictEqual(aeroflyObject.clouds[1].height,  0);
    assert.strictEqual(aeroflyObject.clouds[2].density, 0);
    assert.strictEqual(aeroflyObject.clouds[2].height,  0);
  });

  it('must interpret 9999 meters as 10 statute miles', function() {
    const aeroflyObject = metarToAerofly({
      maxVisibility: 12000 // :? is bigger than 9999
    }).convert({
      icao: 'KPIE',
      observed: new Date('2019-01-29T18:30:18.825Z'),
      visibility: { meters_float: 9999 }
    });

    //console.log(aeroflyObject);
    assert.ok(aeroflyObject);

    assert.strictEqual(aeroflyObject.visibility,    1, '...because 9999 is interpreted as 10 statute miles');
  });
});
