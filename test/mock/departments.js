(function (undefined) {
'use strict';

var collectionUrl = /^\/api(\/campuses\/\d+)?\/departments(\?(.*))?$/;
var mock = function ($httpBackend, fxDepartments) {
  $httpBackend.when('GET', collectionUrl).respond(fxDepartments);
  fxDepartments.objects.forEach(function (department) {
    /* jshint camelcase: false */
    var regex = new RegExp('^/api(/campuses/' + department.campus_id + ')?/departments/' + department.id + '$');
    $httpBackend.when('GET', regex).respond(department);
  });
};

if (module !== undefined && module.exports) {
  // for e2e testing
  var fxDepartments = require('./departments.json');
  module.exports = function ($httpBackend) {
    return mock.call(this, $httpBackend, fxDepartments);
  };
} else {
  // for unit testing
  angular.module('dashApp.mock.departments', ['dashApp.mock.common'])
    .factory('fxDepartments', function () {
      return getJSONFixture('departments.json');
    })
    .constant('departmentsApiUrlRegex', collectionUrl)
    .run(mock);
}
})();
