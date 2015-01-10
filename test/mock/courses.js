(function (undefined) {
'use strict';

var collectionUrl = /^\/api(\/campuses\/\d+)?\/courses(\?(.*))?$/;
var mock = function($httpBackend, fxCourses) {
  $httpBackend.when('GET', collectionUrl).respond(fxCourses);
  fxCourses.objects.forEach(function (course) {
    var regex = new RegExp('^/api(/campuses/1)?/courses/' + course.id + '$');
    $httpBackend.when('GET', regex).respond(course);
  });
};

if (module !== undefined && module.exports) {
  // for e2e testing
  var fxCourses = require('./courses.json');
  module.exports = function ($httpBackend) {
    return mock.call(this, $httpBackend, fxCourses);
  };
} else {
  // for unit testing
  angular.module('dashApp.mock.courses', ['dashApp.mock.common'])
    .factory('fxCourses', function () {
      return getJSONFixture('courses.json');
    })
    .constant('coursesApiUrlRegex', collectionUrl)
    .run(mock);
}
})();
