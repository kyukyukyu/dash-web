'use strict';

/**
 * @ngdoc service
 * @name dashApp.Campuses
 * @description
 * # Campuses
 * Factory in the dashApp.
 */
angular.module('dashApp')
  .factory('Campuses', function ($q, Restangular) {
    var service = Restangular.service('campuses');
    var selectedCampus = null;
    service.setSelectedCampus = function (campusOrId) {
      var promise;

      if (angular.isNumber(campusOrId)) {
        // function called with ID
        promise = service.one(campusOrId).get();
      } else {
        // function called with object
        promise = $q.when(campusOrId);
      }

      return promise.then(function (campus) {
        selectedCampus = campus;
        return selectedCampus;
      });
    };
    service.getSelectedCampus = function () {
      return selectedCampus;
    };

    return service;
  });
