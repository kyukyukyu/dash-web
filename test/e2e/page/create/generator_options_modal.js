'use strict';

(function (module, undefined) {
  var names = ('minCredits maxCredits minDailyClassCount maxDailyClassCount ' +
               'minWeeklyClassCount maxWeeklyClassCount').split(' ');
  function GeneratorOptionsModal(elem) {
    this.elem = elem;
    names.forEach(function (name, _) {
      this['_' + name] = elem.$('[name=' + name + ']');
    });
    this.closeButton = elem.$('button[name=closeButton]');
    this.saveButton = elem.$('button[name=saveButton]');
  }

  var properties = {};
  names.forEach(function (name, _) {
    properties[name] = {
      get: function () { return this['_' + name].getText(); },
      set: function (val) { this['_' + name].sendKeys(val); }
    };
  });

  Object.defineProperties(GeneratorOptionsModal.prototype, properties);
  GeneratorOptionsModal.prototype.isValid = function (name) {
    var e = this['_' + name];
    return e.getAttribute('class').then(function (classes) {
      return classes.split(' ').indexOf('ng-valid') !== -1;
    });
  };

  module.exports = GeneratorOptionsModal;
})(module);
