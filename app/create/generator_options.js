(function () {
  /* jshint latedef: nofunc */
  'use strict';

  /**
   * @ngdoc object
   * @name dashApp.create:GeneratorOptionsCtrl
   * @requires dashApp.create:TimetableGenerator
   * @description
   * # GeneratorOptionsCtrl
   * Controller for timetable generator options modal window.
   */
  angular.module('dashApp.create')
    .controller('GeneratorOptionsCtrl', GeneratorOptionsCtrl);

  var PROPERTY_NAMES = 'credits dailyClassCount weeklyClassCount'.split(' ');

  /* @ngInject */
  function GeneratorOptionsCtrl($scope, TimetableGenerator) {
    var vm = this;

    vm.isValidRange = isValidRange;
    vm.isValidBound = isValidBound;
    vm.userInput = {};
    vm.validity = {
      range: {},
      bound: {}
    };

    var getParseFunc = _.memoize(_getParseFunc);

    activate();

    function activate() {
      var options = TimetableGenerator.getOptions();
      _.forEach(PROPERTY_NAMES, function (propertyName) {
        var _propertyName = capitalize(propertyName);

        _.forEach(['min', 'max'], function (boundPrefix) {
          var boundPropName = boundPrefix + _propertyName;
          vm.userInput[boundPropName] = options[boundPropName] || null;
        });

        $scope.$watchCollection('[vm.userInput.min' + _propertyName + ',' +
                                ' vm.userInput.max' + _propertyName + ']',
                                watchRange);

        function watchRange() {
          vm.validity.range[propertyName] = isValidRange(propertyName);
        }
      });
    }

    function capitalize(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    /**
     * @ngdoc method
     * @name dashApp.create:GeneratorOptions#isValidRange
     * @param {String} propertyName Name of property of which the range is to be checked.
     * @returns {boolean} `true` if the range is valid, else `false`.
     */
    function isValidRange(propertyName) {
      var _propertyName = capitalize(propertyName);
      var parseFunc = getParseFunc(propertyName);

      var boundary =
          _(['min', 'max'])
            .map(function (prefix) {
              return vm.userInput[prefix + _propertyName];
            })
            .map(parseFunc)
            .value();
      var minBound = boundary[0];
      var maxBound = boundary[1];
      return ( (minBound === null && isValidBound(propertyName, maxBound)) ||
               (maxBound === null && isValidBound(propertyName, minBound)) ||
               minBound <= maxBound );
    }

    /**
     * @ngdoc method
     * @name dashApp.create:GeneratorOptions#isValidBound
     * @param {String} propertyName Name of property which the bound is for.
     * @param {String} bound Value to be checked if it is valid as bound for the property.
     * @returns {boolean} `true` if the bound is valid, else `false`.
     */
    function isValidBound(propertyName, bound) {
      var parseFunc = getParseFunc(propertyName);
      var _bound = parseFunc(bound);

      if (_.isNaN(_bound)) {
        return false;
      }
      if (propertyName === 'weeklyClassCount') {
        return (_bound === null || _bound > 0 && _bound <= 7);
      } else {
        return (_bound === null || _bound > 0);
      }
    }

    function _getParseFunc(propertyName) {
      var _parseFunc;

      if (propertyName === 'credits') {
        _parseFunc = _parseFloat;
      } else {
        _parseFunc = _parseInt;
      }

      function parseFunc(bound) {
        if (bound === '' || bound === null) {
          return null;
        }
        return _parseFunc(bound);
      }

      return parseFunc;
    }

    function _parseInt(s) {
      if (/^[0-9]+$/.test(s)) {
        return Number(s);
      }

      return NaN;
    }

    function _parseFloat(s) {
      if (/^[0-9]*(\.([0-9]*)?)?$/.test(s)) {
        return Number(s);
      }

      return NaN;
    }
  }
})();
