'use strict';

const assert       = require('assert');

const metarBlender = require('../lib/metar-blender');

describe('metarBlender', function() {
  const fromMetar =   {
    "barometer": {
      "hg": 29.84,
      "kpa": 101.05,
      "mb": 1010.3
    },
    "ceiling": {
      "code": "BKN",
      "text": "Broken",
      "base_feet_agl": 2900,
      "base_meters_agl": 883.92
    },
    "clouds": [
      {
        "code": "BKN",
        "text": "Broken",
        "base_feet_agl": 2900,
        "base_meters_agl": 883.92
      }
    ],
    "dewpoint": {
      "celsius": 12,
      "fahrenheit": 54
    },
    "humidity_percent": 68,
    "temperature": {
      "celsius": 18,
      "fahrenheit": 64
    },
    "visibility": {
      "miles": 10,
      "meters": 16.093
    },
    "wind": {
      "degrees": 330,
      "speed_kts": 20,
      "speed_mph": 23,
      "speed_mps": 10,
      "gust_kts": 29,
      "gust_mph": 33,
      "gust_mps": 15
    }
  };

  const toMetar = {
    "wind": {
      "degrees": 60,
      "speed_kts": 7,
      "speed_mps": 3.60111109710679,
      "gust_kts": 7,
      "gust_mps": 3.60111109710679
    },
    "visibility": {
      "miles": 2.5,
      "meters": 4023.36
    },
    "conditions": [ "-", "RA", "BR" ],
    "clouds":
    [
      { "code": "BKN", "base_feet_agl": 500, "base_meters_agl": 152.4 },
      { "code": "OVC", "base_feet_agl": 800, "base_meters_agl": 243.84 }
    ],
    "ceiling": {
      "code": "OVC", "base_feet_agl": 800, "base_meters_agl": 243.84
    },
    "temperature": {
      "celsius": 9, "fahrenheit": 48.2
    },
    "dewpoint": {
      "celsius": 8, "fahrenheit": 46.4
    },
    "humidity_percent": 93.45399464344838,
    "barometer": {
      "hg": 2.9989999999999997,
      "kpa": 101.55777916333727,
      "mb": 10.155777916333726
    }
  };

  it('must blend to the left', function() {
    const blendedMetar = metarBlender(fromMetar, toMetar).blend(0);

    assert.ok(blendedMetar);
    assert.strictEqual(blendedMetar.dewpoint.celsius, fromMetar.dewpoint.celsius);
    assert.strictEqual(blendedMetar.humidity_percent, fromMetar.humidity_percent);
  });

  it('must blend to the right', function() {
    const blendedMetar = metarBlender(fromMetar, toMetar).blend(1);

    assert.ok(blendedMetar);
    assert.strictEqual(blendedMetar.dewpoint.celsius, toMetar.dewpoint.celsius);
    assert.strictEqual(blendedMetar.humidity_percent, toMetar.humidity_percent);
  });

  it('must blend to the middle', function() {
    const blendedMetar = metarBlender(fromMetar, toMetar).blend(0.5);

    //console.log(blendedMetar);
    assert.ok(blendedMetar);
    assert.notStrictEqual(blendedMetar.dewpoint.celsius, fromMetar.dewpoint.celsius);
    assert.notStrictEqual(blendedMetar.humidity_percent, fromMetar.humidity_percent);
    assert.notStrictEqual(blendedMetar.dewpoint.celsius, toMetar.dewpoint.celsius);
    assert.notStrictEqual(blendedMetar.humidity_percent, toMetar.humidity_percent);
  });
});
