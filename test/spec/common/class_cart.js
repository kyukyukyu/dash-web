'use strict';

describe('Service: ClassCart', function () {

  // load the service's module
  beforeEach(module('dashApp.common'));

  // load mock modules
  beforeEach(module('dashApp.mock.campuses'));
  beforeEach(module('dashApp.mock.courses'));

  // instantiate dependencies
  var $rootScope,
    $httpBackend,
    $timeout,
    Courses;
  beforeEach(inject(function (_$rootScope_,
                              _$httpBackend_,
                              _$timeout_,
                              _Courses_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
    Courses = _Courses_;
  }));

  // instantiate fixtures
  var fxCourses;
  beforeEach(inject(function (_fxCourses_) {
    fxCourses = _fxCourses_;
  }));

  // instantiate service
  var ClassCart;
  beforeEach(inject(function (_ClassCart_) {
    ClassCart = _ClassCart_;
  }));

  // flush HTTP request made by Campuses service
  beforeEach(function () { $httpBackend.flush(1); });

  // make sure there is no outstanding http expectation/request
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('the function that adds course objects', function () {
    var addToCart = function (courseId) {
      var course = Courses.get(courseId).$object;
      $httpBackend.flush();
      ClassCart.add(course);
      return course;
    };

    it('should add a course object', function () {
      var course = addToCart(1);
      var courseGroups = ClassCart.getCourseGroups();

      expect(courseGroups.length).toBe(1);
      var courseGroup = courseGroups[0];
      expect(courseGroup.subject.id).toEqual(course.subject.id);
      expect(courseGroup.subject.name).toEqual(course.subject.name);
      expect(courseGroup.subject.code).toEqual(course.subject.code);
      expect(courseGroup.subject.credit).toEqual(course.subject.credit);

      expect(courseGroup.courses.length).toBe(1);
      var courseInCart = courseGroup.courses[0];
      expect(courseInCart.id).toEqual(course.id);
      expect(courseInCart.name).toEqual(course.name);
      expect(courseInCart.code).toEqual(course.code);
      expect(courseInCart.instructor).toEqual(course.instructor);
    });

    it('should broadcast addtocart event when a course object is added', function () {
      spyOn($rootScope, '$broadcast');
      var course = addToCart(1);
      $timeout.flush();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('addtocart', course);
    });

    it('should add a major course object and set it required', function () {
      addToCart(1);
      var courseGroups = ClassCart.getCourseGroups();
      var courseGroup = courseGroups[0];
      expect(courseGroup.required).toBe(true);
    });

    it('should add a general course object and set it optional', function () {
      addToCart(5);
      var courseGroups = ClassCart.getCourseGroups();
      var courseGroup = courseGroups[0];
      expect(courseGroup.required).toBe(false);
    });

    it('should group course objects by their subject when added', function () {
      var courses = [];
      var course;
      course = addToCart(1);
      courses.push(course);
      course = addToCart(2);
      courses.push(course);

      var courseGroups = ClassCart.getCourseGroups();

      expect(courseGroups.length).toBe(1);
      var courseGroup = courseGroups[0];

      expect(courseGroup.courses.length).toBe(2);
      angular.forEach(courseGroup.courses, function (c, i) {
        course = courses[i];
        expect(c.id).toEqual(course.id);
        expect(c.name).toEqual(course.name);
        expect(c.code).toEqual(course.code);
        expect(c.instructor).toEqual(course.instructor);
      });
    });

    it('should add course objects with same code only once', function () {
      spyOn($rootScope, '$broadcast');
      addToCart(1);
      addToCart(1);
      $timeout.flush();
      expect($rootScope.$broadcast.calls.count()).toBe(1);
    });
  });

  /*
  describe('removing course objects', function () {
    // add some course objects in advance
    var courses;
    beforeEach(function () {
      courses = [];
      var c;
      for (var i = 1; i <= 3; ++i) {
        c = Courses.get(i).$object;
        courses.push(c);
        ClassCart.add(c);
      }
      $httpBackend.flush();
    });

    it('should provide function that removes course objects', function () {
      ClassCart.remove(courses[0]);
    });
  });
  */

});
