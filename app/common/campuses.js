'use strict';

/**
 * @ngdoc service
 * @name dashApp.Campuses
 * @description
 * # Campuses
 * Factory in the dashApp.
 */
angular.module('dashApp.common')
  .factory('Campuses', function ($rootScope, $q, Restangular) {
    var service = Restangular.service('campuses');
    var selectedCampus = null;

    // initialize selectedCampus with the first campus entity
    service.getList().then(function (campuses) {
      service.setSelectedCampus(campuses[0]);
    });

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
        $rootScope.$broadcast('campusselected', selectedCampus);
        return selectedCampus;
      });
    };
    service.getSelectedCampus = function () {
      return selectedCampus;
    };

    return service;
  });
