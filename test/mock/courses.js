'use strict';

angular.module('dashApp.mock.courses', ['dashApp.mock.common'])
  .factory('fxCourses', function () {
    return getJSONFixture('courses.json');
  })
  .constant('coursesApiUrlRegex', /^\/api(\/campuses\/\d+)?\/courses(\?(.*))?$/)
  .run(function ($httpBackend, coursesApiUrlRegex, fxCourses) {
    $httpBackend.when('GET', coursesApiUrlRegex).respond(fxCourses);
    angular.forEach(fxCourses.objects, function (course) {
      var regex = new RegExp('^/api(/campuses/1)?/courses/' + course.id + '$');
      $httpBackend.when('GET', regex).respond(course);
    });
  });
