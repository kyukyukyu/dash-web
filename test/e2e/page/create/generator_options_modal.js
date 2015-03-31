'use strict';

(function (module, undefined) {
  var propertyNames = 'credits dailyClassCount weeklyClassCount'.split(' ');
  var names = propertyNames.reduce(function (_names, propertyName) {
    var _propertyName = propertyName.charAt(0).toUpperCase() +
                        propertyName.substr(1);
    _names.push('min' + _propertyName, 'max' + _propertyName);
    return _names;
  }, []);
  function GeneratorOptionsModal(elem) {
    this.elem = elem;
    this.formGroup = {};
    propertyNames.forEach(function (propertyName) {
      var _propertyName =
          propertyName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      this.formGroup[propertyName] = elem.$('.form-group-' + _propertyName);
    }, this);
    names.forEach(function (name, _) {
      this['_' + name] = elem.$('[name=' + name + ']');
    }, this);
    this.cancelButton = elem.$('button[name=cancelButton]');
    this.saveButton = elem.$('button[name=saveButton]');
  }

  var properties = {};
  names.forEach(function (name, _) {
    properties[name] = {
      get: function () { return this['_' + name].getText(); },
      set: function (val) {
        var inputBox = this['_' + name];
        inputBox.clear();
        inputBox.sendKeys(val);
      }
    };
  });

  Object.defineProperties(GeneratorOptionsModal.prototype, properties);
  GeneratorOptionsModal.prototype.isValid = function (name) {
    var e = this.formGroup[name];
    return e.getAttribute('class').then(function (classes) {
      return classes.split(' ').indexOf('has-error') === -1;
    });
  };

  module.exports = GeneratorOptionsModal;
})(module);
