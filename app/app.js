'use strict';

const metarParser       = require('aewx-metar-parser');
const metarToAerofly    = require('../lib/metar-to-aerofly');
const aeroflyConfigFile = require('../lib/aerofly-config-file');
const fetchMetarUrl     = require('../lib/fetch-url');


const options = {
  file: '%userprofile%\\Documents\\Aerofly FS 2\\main.mcf',
  url: 'http://avwx.rest/api/metar/XXXX?options=&format=json&onfail=cache',
  //url: 'https://3960.org/metar/XXXX.txt',
  http_options: {
    response: 'json'
  }
};

const app = {
  elForm: document.querySelector('form'),
  aeroflyObject: metarToAerofly(),
  configFile: aeroflyConfigFile(options.file),

  pad: function(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  },
  percent: function(value) {
    return Math.round(Number(value) * 100);
  },

  output: function(el) {
    document.querySelector('output[name="' + el.name + '_o"]').value = el.value + el.getAttribute('data-unit');
  },

  repaint: function() {
    document.querySelectorAll('input[type="range"]').forEach((el) => {
      app.output(el);
    })
  },

  transferValue: function(el) {
    switch (el.name) {
      case 'time':
      case 'date':
        app.aeroflyObject.setDate(new Date(app.elForm.date.value + 'T' + app.elForm.time.value + 'Z'));
        break;
      default:
        let value = Number(el.value);
        if (el.getAttribute('data-unit') === '%') {
          value /= 100;
        }
        app.aeroflyObject.setValue(el.name, value);
        break;
    }
  },

  fetch: function() {
    let url = options.url.replace('XXXX', app.elForm.icao.value);

    app.elForm.metar.value = 'Loading...';
    try {
      fetchMetarUrl(url, options.http_options, (response) => {
        console.log('Got response from URL ' + url + "\n", response.trim(), "\n");
        app.elForm.metar.value = response;
        app.parseMetar(app.elForm.metar);
        app.save();
      });
    } catch (e) {
      app.showMessage(e.message);
    }
  },

  save: function() {
    try {
      let aeroflyObjectValues = app.aeroflyObject.get();
      console.log('Saving...', aeroflyObjectValues);
      app.configFile.setFromAeroflyObject(aeroflyObjectValues);
      return app.configFile.save();
    } catch (e) {
      app.showMessage(e.message);
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

  loadInitial: function() {
    try {
      console.log('Loading initial data...');
      const aeroflyObjectValues = app.configFile.getAeroflyObject();
      console.log(aeroflyObjectValues);
      const curFlightplan = app.configFile.getFlightplan();
      const icao = curFlightplan ? (curFlightplan.destination.icao || curFlightplan.origin.icao) : '';
      app.setMetar(aeroflyObjectValues, icao);
    } catch (e) {
      app.showMessage(e.message);
    }
  },

  parseMetar: function(el) {
    const metarObject = metarParser(el.value);
    const aeroflyObjectValues = app.aeroflyObject.convert(metarObject);
    app.setMetar(aeroflyObjectValues,  metarObject.icao);
  },

  setMetar: function(aeroflyObjectValues, icao) {
    app.elForm.icao.value = icao;
    app.elForm.time.value = app.pad(aeroflyObjectValues.time.hour) + ':' +app.pad(aeroflyObjectValues.time.minute);
    app.elForm.date.value = aeroflyObjectValues.time.year + '-' + app.pad(aeroflyObjectValues.time.month) + '-' +app.pad(aeroflyObjectValues.time.day);
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
  }
};

//app.parseMetar(document.querySelector('[name="metar"]'));
app.loadInitial();
