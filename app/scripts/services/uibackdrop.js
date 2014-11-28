'use strict';

/**
 * @ngdoc service
 * @name dashApp.UIBackdrop
 * @description
 * # UIBackdrop
 * Factory in the dashApp.
 */
angular.module('dashApp')
  .factory('UIBackdrop', function ($rootElement, $q) {
    var _backdrop;
    var _isShown = false;
    var _deferred;
    _backdrop = angular.element('<div id="dsBackdrop"></div>')
      .on('click', function () {
        hide();
      });

    var hide = function () {
      if (!_isShown) {
        throw new Error('backdrop is already hidden');
      }
      _backdrop.detach();
      _isShown = false;
      _deferred.resolve();
    };

    return {
      show: function () {
        var deferred = $q.defer();

        if (_isShown) {
          deferred.reject('backdrop is already shown');
        } else {
          $rootElement.append(_backdrop);
          _isShown = true;
          _deferred = deferred;
        }

        return deferred.promise;
      },

      hide: hide,

      isShown: function () { return _isShown; }
    };
  });
