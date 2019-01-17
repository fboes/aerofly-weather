'use strict';

const assert         = require('assert');

const aeroflyWriter  = require('../lib/aerofly-config-file');

describe('metarToAerofly', function() {
  it('should convert static objects', function() {
    const aeroflyWriterDing = aeroflyWriter('./test/main-2.mcf');
    aeroflyWriterDing.setFromAeroflyObject({
      time: {
        year: 2020,
        month: 5,
        day: 5,
        hours: 0.5
      },
      wind: {
        direction_in_degree: 50,
        strength: 0.5,
        turbulence: 0.5
      },
      visibility: 0.5,
      clouds: [
        { height: 0.5, density: 0.5 },
        { height: 0.5, density: 0.5 },
        { height: 0.5, density: 0.5 }
      ],
      thermal_activity: 0.5
    });

    const output = aeroflyWriterDing.output();
    //console.log(output);
    assert.ok(aeroflyWriterDing);
    assert.ok(output);
    assert.ok(output.match(/time_year[^>]+2020/));
    assert.ok(output.match(/time_month[^>]+5/));
    assert.ok(output.match(/time_day[^>]+5/));
    assert.ok(output.match(/time_hours[^>]+0\.5/));
    assert.ok(output.match(/direction_in_degree[^>]+50/));
    assert.ok(output.match(/strength[^>]+0\.5/));
    assert.ok(output.match(/turbulence[^>]+0\.5/));
    assert.ok(output.match(/thermal_activity[^>]+0\.5/));
  });

  it('should parse flightplans', function() {
    const aeroflyWriterDing = aeroflyWriter('./test/main.mcf');
    const output = aeroflyWriterDing.getFlightplan();
    //console.log(output);
    assert.ok(output);
    assert.ok(output.origin);
    assert.ok(output.origin.icao);
    assert.ok(output.destination);
    assert.ok(output.destination.icao);
  });

  it('should remove flightplans', function() {
    const aeroflyWriterDing = aeroflyWriter('./test/main-has_nav.mcf');
    aeroflyWriterDing.setFlightplan(null, null);
    const output = aeroflyWriterDing.output();
    // console.log(output);
    assert.ok(output);
    assert.ok(output.match(/Identifier\]\[\]/g));
    assert.ok(output.match(/Uid\]\[0\]/g));
  });
});
