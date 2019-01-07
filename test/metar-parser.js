'use strict';

const assert      = require('assert');

const metarParser = require('../lib/metar-parser');

describe('metarParser', function() {

  const metarTestcases = [
    {
      source: 'https://aviationweather.gov/metar#1',
      metarCode: "KEYW 041053Z AUTO 13005KT 10SM CLR 24/22 A3000 RMK AO2 SLP159 T02440222",
      expectedValues: [
        ['icao', 'KEYW'],
        ['wind', {degrees: 130, speed_kts: 5, gust_kts: 5}],
        ['visibility', { meters: 10 * 1609 }],
        ['clouds', []],
        ['temperature', { celsius: 24 }],
        ['barometer', {kpa: 3000 / 10 / 2.9529988 }]
      ],
      output: false
    },
    {
      source: 'https://aviationweather.gov/metar#2',
      metarCode: "KACV 041053Z AUTO 07003KT 10SM CLR 04/04 A3001 RMK AO2 SLP169 T00440039",
      expectedValues: [
        ['icao', 'KACV'],
        ['wind', {degrees: 70, speed_kts: 3, gust_kts: 3}],
        ['visibility', { meters: 10 * 1609 }],
        ['clouds', []],
        ['temperature', { celsius: 4 }],
        ['barometer', {kpa: 3001 / 10 / 2.9529988 }]
      ],
      output: false
    },
    {
      source: 'https://api.checkwx.com/#1',
      metarCode: "KPIE 260853Z AUTO 02013G17KT 10SM CLR 17/07 A2998 RMK AO2 SLP153 T01720072 57000",
      expectedValues: [
        ['icao', 'KPIE'],
        ['wind', {degrees: 20, speed_kts: 13, gust_kts: 17}],
        ['visibility', { meters: 10 * 1609 }],
        ['clouds', []],
        ['temperature', { celsius: 17 }],
        ['barometer', {kpa: 2998 / 10 / 2.9529988 }]
      ],
      output: false
    },
    {
      source: 'https://api.checkwx.com/#2',
      metarCode: "KSPG 260853Z AUTO 05012KT 10SM CLR 18/09 A2997 RMK AO2 SLP148 T01830094 53001",
      expectedValues: [
        ['icao', 'KSPG'],
        ['wind', {degrees: 50, speed_kts: 12, gust_kts: 12}],
        ['visibility', { meters: 10 * 1609 }],
        ['clouds', []],
        ['temperature', { celsius: 18 }],
        ['barometer', {kpa: 2997 / 10 / 2.9529988 }]
      ],
      output: false
    },
    {
      source: 'https://de.wikipedia.org/wiki/METAR',
      metarCode: "EDDS 081620Z 29010KT 9999 FEW040TCU 09/M03 Q1012 NOSIG",
      expectedValues: [
        ['icao', 'EDDS'],
        ['wind', {degrees: 290, speed_kts: 10, gust_kts: 10}],
        ['visibility', { meters: 9999 }],
        ['clouds', [{base_feet_agl: 4000, minDensity: 1, maxDensity: 2}]],
        ['temperature', { celsius: 9 }],
        ['barometer', {kpa: 101.2 }]
      ],
      output: false
    },
    {
      source: 'https://en.wikipedia.org/wiki/METAR#1',
      metarCode: "METAR LBBG 041600Z 12012MPS 090V150 1400 R04/P1500N R22/P1500U +SN BKN022 OVC050 M04/M07 Q1020 NOSIG 8849//91=",
      expectedValues: [
        ['icao', 'LBBG'],
        ['wind', {degrees: 120, speed_kts: 12 / 1.9438445, gust_kts: 12 / 1.9438445}],
        ['visibility', { meters: 1400 }],
        ['clouds', [{base_feet_agl: 2200, minDensity: 5, maxDensity: 7}, {base_feet_agl: 5000, minDensity: 8, maxDensity: 8}]],
        ['temperature', { celsius: -4 }],
        ['barometer', {kpa: 102.0 }]
      ],
      output: false
    },
    {
      source: 'https://en.wikipedia.org/wiki/METAR#2',
      metarCode: "METAR KTTN 051853Z 04011KT 1/2SM VCTS SN FZFG BKN003 OVC010 M02/M02 A3006 RMK AO2 TSB40 SLP176 P0002 T10171017=",
      expectedValues: [
        ['icao', 'KTTN'],
        ['wind', {degrees: 40, speed_kts: 11, gust_kts: 11}],
        ['visibility', { meters: 0.5 * 1609 }],
        ['clouds', [{base_feet_agl: 300, minDensity: 5, maxDensity: 7}, {base_feet_agl: 1000, minDensity: 8, maxDensity: 8}]],
        ['temperature', { celsius: -2 }],
        ['barometer', {kpa: 3006 / 10 / 2.9529988 }]
      ],
      output: false
    },
    {
      source: 'https://en.allmetsat.com/metar-taf/#1',
      metarCode: "KEYW 041053Z AUTO 13005KT 10SM CLR 24/22 A3000 RMK AO2 SLP159 T02440222",
      expectedValues: [
        ['icao', 'KEYW'],
        ['wind', {degrees: 130, speed_kts: 5, gust_kts: 5}],
        ['visibility', { meters: 10 * 1609 }],
        ['clouds', []],
        ['temperature', { celsius: 24 }],
        ['barometer', {kpa: 3000 / 10 / 2.9529988 }]
      ],
      output: false
    },
    {
      source: 'https://en.allmetsat.com/metar-taf/#2',
      metarCode: "EDDH 041050Z 29013KT 6000 SCT006 BKN009 04/03 Q1028 TEMPO BKN012",
      expectedValues: [
        ['icao', 'EDDH'],
        ['wind', {degrees: 290, speed_kts: 13, gust_kts: 13}],
        ['visibility', { meters: 6000 }],
        ['clouds', [{base_feet_agl: 600, minDensity: 3, maxDensity: 4}, {base_feet_agl: 900, minDensity: 5, maxDensity: 7}]],
        ['temperature', { celsius: 4 }],
        ['barometer', {kpa: 102.8 }]
      ],
      output: false
    },
    {
      source: 'https://en.allmetsat.com/metar-taf/#3',
      metarCode: "ETEB 041056Z AUTO 26010KT 9999 SCT090 00/M01 A3052 RMK AO2 SLP378 T10031013",
      expectedValues: [
        ['icao', 'ETEB'],
        ['wind', {degrees: 260, speed_kts: 10, gust_kts: 10}],
        ['visibility', { meters: 9999 }],
        ['clouds', [{base_feet_agl: 9000, minDensity: 3, maxDensity: 4}]],
        ['temperature', { celsius: 0 }],
        ['barometer', {kpa: 3052 / 10 / 2.9529988 }]
      ],
      output: false
    },
    {
      source: 'https://aviationweather.gov/metar/#3',
      metarCode: "KEYW 050653Z AUTO 19006KT FEW024 BKN039 26/23 A3000 RMK AO2 LTG DSNT W SLP159 T02610228",
      expectedValues: [
        ['icao', 'KEYW'],
        ['wind', {degrees: 190, speed_kts: 6, gust_kts: 6}],
        ['visibility', { meters: 9999 }],
        ['clouds', [{base_feet_agl: 2400, minDensity: 1, maxDensity: 2}, {base_feet_agl: 3900, minDensity: 5, maxDensity: 7}]],
        ['temperature', { celsius: 26 }],
        ['barometer', {kpa: 3000 / 10 / 2.9529988 }]
      ],
      output: false
    },
    {
      source: 'https://api.checkwx.com/#2019-01-07',
      metarCode: 'KSFO 070121Z 19023KT 1 1/2SM R28R/6000VP6000FT -RA BKN004 BKN013 OVC035 15/12 A2970 RMK AO2 T01500122 PNO $',
      expectedValues: [
        ['visibility', { meters: 1.5 * 1609 }]
      ],
      output: false
    }
  ];

  metarTestcases.forEach(function(test) {
    it('must convert METAR string from ' + test.source, function() {
      const metarData = metarParser(test.metarCode);
      if (test.output) {
        console.log(metarData);
      }
      assert.ok(metarData);
      test.expectedValues.forEach((valueTest) => {
        if (Array.isArray(valueTest[1])) {
          assert.ok(metarData[valueTest[0]]);
          assert.strictEqual(metarData[valueTest[0]].length, valueTest[1].length);
        } else if (typeof valueTest[1] === 'object') {
          assert.ok(metarData[valueTest[0]]);
          for (let [key, value] of Object.entries(valueTest[1])) {
            assert.strictEqual(metarData[valueTest[0]][key], value, 'Match for ' + key + '.' + value);
          }
        } else {
          assert.strictEqual(metarData[valueTest[0]], valueTest[1], 'Match for ' + valueTest[0]);
        }
      });
    });
  });
});
