'use strict';

/**
 * STUB: Connector into simulation. Mimics functionality of DLL.
 *
 * @param  {Object} options with `values`
 * @return {Object} AeroflyApi
 */
const AeroflyApi = function(options = {}) {
  let _public = {};
  let _private = {
    values: options.values || {},
    events: {}
  };

  /**
   * STUB: Get value from simulation
   *
   * @param  {String} key dito
   * @return {Mixed}  dito
   */
  _public.getValue = function(key) {
    return _private.values[key] || undefined;
  };

  /**
   * STUB: Set value in simulation
   *
   * @param  {String}  key   dito
   * @param  {Mixed}   value dito
   * @return {Boolean} true
   */
  _public.setValue = function(key, value) {
    _private.values[key] = value;
    return true;
  };

  /**
   * STUB: : Change value in simulation step by step
   *
   * @param  {String}  key   dito
   * @param  {Number}  value dito
   * @param  {Number}  step   dito
   * @return {Boolean} if morph has ended for this value
   */
  _public.morphValues = function(key, value, step = 0.01) {
    let oldValue = _public.getValue(key) || 0;
    if (value === oldValue) {
      return true;
    } else if ((oldValue - step) < value  && value < (oldValue + step)) {
      _public.setValue(key, value);
      return true;
    } else if (value < oldValue) {
      _public.setValue(key, oldValue += step);
    } else { // if (value > oldValue)
      _public.setValue(key, oldValue -= step);
    }
    return false;
  };

  /**
   * STUB: Watch for event in simulation
   *
   * @param  {String}   event    dito
   * @param  {Function} callback with `values` as first parameter
   * @return {Boolean}  true
   */
  _public.watchEvent = function(event, callback) {
    _private.events[event] = callback;
    return true;
  };

  /**
   * STUB: Watch for events in simulation
   *
   * @param  {Array}    events   dito
   * @param  {Function} callback with `values` as first parameter
   * @return {Boolean}  true
   */
  _public.watchEvents = function(events, callback) {
    events.forEach((event) => {
      _public.watchEvent(event, callback);
    });
    return true;
  };

  /**
   * DEBUGGING: Trigger event and execute callback, as if simulation had triggered it
   *
   * @param  {String} event  dito
   * @param  {Mixed}  values dito
   * @return {Mixed}  return value of callback
   */
  _public.triggerEvent = function(event, values) {
    if (!_private.events[event]) {
      return false;
    }
    return _private.events[event](values);
  };

  return _public;
};

module.exports = AeroflyApi;
