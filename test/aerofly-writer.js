'use strict';

const assert         = require('assert');

const aeroflyWriter  = require('../lib/aerofly-writer');

describe('metarToAerofly', function() {
  it('should convert static objects', function() {
    const aeroflyWriterDing = aeroflyWriter('./test/main-2.mcf');
    aeroflyWriterDing.setFromAeroflyObject({
      time_year: 2020,
      time_month: 5,
      time_day: 5,
      time_hours: 0.5,
      wind_direction_in_degree: 50,
      wind_strength: 0.5,
      wind_turbulence: 0.5,
      visibility: 0.5,
      clouds: [
        { height: 0.5, density: 0.5 },
        { height: 0.5, density: 0.5 },
        { height: 0.5, density: 0.5 }
      ],
      wind_thermal_activity: 0.5
    });

    // console.log(aeroflyWriterDing.output().trim());
    assert.ok(aeroflyWriterDing);
  });
});
