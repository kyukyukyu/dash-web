'use strict';

describe('Service: Courses', function () {
  // load the service's module
  beforeEach(module('dashApp.common'));

  // load module for mocking backend
  beforeEach(module('dashApp.mock.campuses'));
  beforeEach(module('dashApp.mock.courses'));

  var $httpBackend,
    $timeout,
    Campuses,
    Courses,
    fxCourses;

  // instantiate dependencies
  beforeEach(inject(function (_$httpBackend_, _$timeout_, _Campuses_,
                              _fxCourses_) {
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
    Campuses = _Campuses_;
    fxCourses = _fxCourses_;
  }));

  // flush HTTP request made by Campuses service
  beforeEach(function () { $httpBackend.flush(1); });

  // instantiate service
  beforeEach(inject(function (_Courses_) { Courses = _Courses_; }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('with selected campus set', function () {
    beforeEach(function () {
      Campuses.setSelectedCampus(1);
      $httpBackend.flush();
      $timeout.flush();
    });

    it('should provide single course data', function () {
      var course = Courses.get(1).$object;
      $httpBackend.flush();
      expect(course.plain()).toEqual(fxCourses.objects[0]);
    });

    it('should provide multiple courses data', function () {
      /* jshint camelcase: false */
      var courses = Courses.getList().$object;
      $httpBackend.flush();
      expect(courses.numResults).toBe(fxCourses.num_results);
      expect(courses.page).toBe(fxCourses.page);
      expect(courses.numPages).toBe(fxCourses.num_pages);
      expect(courses.plain()).toEqual(fxCourses.objects);
    });
  });

});
