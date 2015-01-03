'use strict';

angular.module('dashApp.mock.campuses', ['dashApp.mock.common'])
  .factory('fxCampuses', function () {
    return getJSONFixture('campuses.json');
  })
  .run(function ($httpBackend, fxCampuses) {
    $httpBackend.when('GET', '/api/campuses').respond(fxCampuses);
    $httpBackend.when('GET', '/api/campuses/1').respond(fxCampuses.objects[0]);
  });
