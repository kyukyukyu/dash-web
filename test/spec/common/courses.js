'use strict';

describe('Service: Courses', function () {
  // load the service's module
  beforeEach(module('dashApp.common'));

  // load module for mocking backend
  beforeEach(module('dashApp.mock.campuses'));
  beforeEach(module('dashApp.mock.courses'));

  // instantiate service
  var $httpBackend,
    $timeout,
    Campuses,
    Courses,
    fxCourses;
  beforeEach(inject(function (_$httpBackend_, _$timeout_, _Campuses_,
                              _Courses_, _fxCourses_) {
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
    Campuses = _Campuses_;
    Courses = _Courses_;
    fxCourses = _fxCourses_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should not provide course data if selected campus is not set', function () {
    var _reason;
    var errorHandler = function (reason) { _reason = reason; };

    _reason = null;
    Courses.get(1).catch(errorHandler);
    $timeout.flush();
    expect(_reason).toBe(Courses.REASON_CAMPUS_NOT_SELECTED);

    _reason = null;
    Courses.getList().catch(errorHandler);
    $timeout.flush();
    expect(_reason).toBe(Courses.REASON_CAMPUS_NOT_SELECTED);
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
