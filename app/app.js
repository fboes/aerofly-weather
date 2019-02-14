/* eslint-env node, browser */

'use strict';

const metarParser       = require('aewx-metar-parser');
const metarToAerofly    = require('../lib/metar-to-aerofly');
const aeroflyConfigFile = require('../lib/aerofly-config-file');
const fetchMetarUrl     = require('../lib/fetch-url');
const jsonFile          = require('../lib/json-file');
//const pkg               = require('../package.json');

const app = {
  elForm: document.querySelector('form'),
  aeroflyObject: metarToAerofly(),
  configFile: undefined,
  options: {},

  pad: function(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  },

  percent: function(value) {
    return Math.round(Number(value) * 100);
  },

  output: function(event) {
    const el = event.target;
    document.querySelector('output[name="' + el.name + '_o"]').value = el.value + el.getAttribute('data-unit');
  },

  repaint: function() {
    document.querySelectorAll('input[type="range"]').forEach((el) => {
      app.output({target: el});
    });
  },

  transferValue: function(event) {
    const el = event.target;
    switch (el.name) {
      case 'time':
      case 'date':
        app.aeroflyObject.setDate(new Date(app.elForm.date.value + 'T' + app.elForm.time.value + 'Z'));
        break;
      default:
        if (el.getAttribute['type'] && el.getAttribute['type'].match(/^(range|number)$/)) {
          let value = Number(el.value);
          if (el.getAttribute('data-unit') === '%') {
            value /= 100;
          }
          app.aeroflyObject.setValue(el.name, value);
        } else {
          app.options[el.name] = el.value;
        }
        break;
    }
  },

  showMessage: function(message, type = 'error') {
    const elBox = document.getElementById('message');
    elBox.textContent = message;
    elBox.classList.remove('error', 'success');
    elBox.classList.add('is-visible', type);
    window.setTimeout(function() {
      elBox.classList.remove('is-visible');
    }, 5000);
  },

  fetchMetar: function() {
    if (!app.elForm.icao.value) {
      app.showMessage('Missing ICAO code');
      return;
    }

    let url = app.options.api[0].url.replace('XXXX', app.elForm.icao.value);
    app.elForm.metar.value = 'Loading...';
    try {
      fetchMetarUrl(url, { response: app.options.api[0].response, apikey: app.options.api[0].key }, (response) => {
        console.log('Got response from URL ' + url + "\n", response.trim(), "\n");
        app.elForm.metar.value = response;
        app.parseMetar({target: app.elForm.metar});
        app.saveConfigFile();
      });
    } catch (e) {
      console.error(e);
      app.showMessage(e.message);
    }
  },

  parseMetar: function(event) {
    const el = event.target;
    const metarObject = metarParser(el.value);
    const aeroflyObjectValues = app.aeroflyObject.convert(metarObject);
    app.setMetar(aeroflyObjectValues, metarObject.icao);
  },

  setMetar: function(aeroflyObjectValues, icao) {
    app.elForm.icao.value = icao;
    app.elForm.time.value = app.pad(aeroflyObjectValues.time.hour) + ':' + app.pad(aeroflyObjectValues.time.minute);
    app.elForm.date.value = aeroflyObjectValues.time.year + '-' + app.pad(aeroflyObjectValues.time.month) + '-' + app.pad(aeroflyObjectValues.time.day);
    app.elForm['wind.direction_in_degree'].value = Math.round(aeroflyObjectValues.wind.direction_in_degree);
    app.elForm['wind.strength'].value = app.percent(aeroflyObjectValues.wind.strength);
    app.elForm['wind.turbulence'].value = app.percent(aeroflyObjectValues.wind.turbulence);
    app.elForm.thermal_activity.value = app.percent(aeroflyObjectValues.thermal_activity);
    app.elForm.visibility.value = app.percent(aeroflyObjectValues.visibility);

    aeroflyObjectValues.clouds.forEach((cloud, index) => {
      app.elForm['clouds.' + index + '.height'].value = app.percent(cloud.height);
      app.elForm['clouds.' + index + '.density'].value = app.percent(cloud.density);
    });
    app.repaint();
  },

  saveConfigFile: function() {
    try {
      let aeroflyObjectValues = app.aeroflyObject.get();
      console.log('Saving...', aeroflyObjectValues);
      app.configFile.setFromAeroflyObject(aeroflyObjectValues);
      return app.configFile.save();
    } catch (e) {
      console.error(e);
      app.showMessage(e.message);
    }
  },

  init: function() {
    const optionsFile = jsonFile('%userprofile%\\Documents\\Aerofly FS 2\\aewx.json', {
      mcfFilename: '%userprofile%\\Documents\\Aerofly FS 2\\main.mcf',
      api: [
        {
          url: 'http://avwx.rest/api/metar/XXXX?options=&format=json&onfail=cache',
          key: '',
          response: 'json'
        }
      ]
    });
    optionsFile.load();
    app.options = optionsFile.get();
    console.log('Options', app.options);

    app.configFile = aeroflyConfigFile(app.options.mcfFilename);
    try {
      console.log('Loading initial data...');
      const aeroflyObjectValues = app.configFile.getAeroflyObject();
      const curFlightplan = app.configFile.getFlightplan();
      const icao = curFlightplan ? (curFlightplan.destination.icao || curFlightplan.origin.icao) : '';
      app.setMetar(aeroflyObjectValues, icao);
      app.aeroflyObject.set(aeroflyObjectValues);
      console.log(app.aeroflyObject.get());
    } catch (e) {
      console.error(e);
      app.showMessage(e.message);
    }
  }
};

// -----------------------------------------------------------------------------
// Startup & add event handlers
app.init();

document.querySelectorAll('input, select').forEach(function(el) {
  el.addEventListener('input', app.transferValue);
  el.addEventListener('change', function(event) {
    // el = event.target;
    app.transferValue(event);
    app.saveConfigFile(event);
  });
});
document.querySelectorAll('input[data-unit]').forEach(function(el) {
  el.addEventListener('input', app.output);
});
document.querySelector('textarea').addEventListener('keyup', app.parseMetar);
document.querySelector('.metar-fetch').addEventListener('click', app.fetchMetar);
