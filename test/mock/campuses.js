(function (undefined) {
'use strict';

var mock = function ($httpBackend, fxCampuses) {
  $httpBackend.when('GET', '/api/campuses').respond(fxCampuses);
  fxCampuses.objects.forEach(function (campus) {
    $httpBackend.when('GET', '/api/campuses/' + campus.id).respond(campus);
  });
};

if (module !== undefined && module.exports) {
  // for e2e testing
  var fxCampuses = require('./campuses.json');
  module.exports = function ($httpBackend) {
    return mock.call(this, $httpBackend, fxCampuses);
  };
} else {
  // for unit testing
  angular.module('dashApp.mock.campuses', ['dashApp.mock.common'])
    .factory('fxCampuses', function () {
      return getJSONFixture('campuses.json');
    })
    .run(mock);
}
})();
