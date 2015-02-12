'use strict';

describe('Service: CourseCart', function () {

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
  var CourseCart;
  beforeEach(inject(function (_CourseCart_) {
    CourseCart = _CourseCart_;
  }));

  // flush HTTP request made by Campuses service
  beforeEach(function () { $httpBackend.flush(1); });

  // make sure there is no outstanding http expectation/request
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  function addToCart(courseId) {
    var course = Courses.get(courseId).$object;
    $httpBackend.flush();
    $timeout.flush();
    CourseCart.add(course);
    return course;
  }

  describe('the function that adds course objects', function () {

    it('should add a course object', function () {
      var course = addToCart(1);
      var courseGroups = CourseCart.getCourseGroups();

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
      expect($rootScope.$broadcast).toHaveBeenCalledWith('addtocart', course);
    });

    it('should add a major course object and set it required', function () {
      addToCart(1);
      var courseGroups = CourseCart.getCourseGroups();
      var courseGroup = courseGroups[0];
      expect(courseGroup.required).toBe(true);
    });

    it('should add a general course object and set it optional', function () {
      addToCart(5);
      var courseGroups = CourseCart.getCourseGroups();
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

      var courseGroups = CourseCart.getCourseGroups();

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
      expect($rootScope.$broadcast.calls.count()).toBe(1);
    });

  });

  describe('the function that removes course objects', function () {

    // add some course objects in advance
    var courses;
    beforeEach(function () {
      courses = [];
      for (var i = 1; i <= 3; ++i) {
        courses.push(addToCart(i));
      }
    });

    it('should remove course objects', function () {
      CourseCart.remove(courses[0]);
      var courseGroups = CourseCart.getCourseGroups();
      expect(courseGroups.length).toBe(2);
      var courseGroup;
      courseGroup = courseGroups[0];
      expect(courseGroup.subject.code).toEqual(courses[1].subject.code);
      expect(courseGroup.courses.length).toBe(1);
      expect(courseGroup.courses[0].code).toEqual(courses[1].code);
      courseGroup = courseGroups[1];
      expect(courseGroup.subject.code).toEqual(courses[2].subject.code);
      expect(courseGroup.courses.length).toBe(1);
      expect(courseGroup.courses[0].code).toEqual(courses[2].code);
    });

    it('should broadcast removefromcart event when a course object is removed', function () {
      spyOn($rootScope, '$broadcast');
      CourseCart.remove(courses[0]);
      expect($rootScope.$broadcast).toHaveBeenCalledWith('removefromcart', courses[0]);
    });

    it('should remove course object when no course is in it', function () {
      CourseCart.remove(courses[2]);
      var courseGroups = CourseCart.getCourseGroups();
      expect(courseGroups.length).toBe(1);
      var courseGroup = courseGroups[0];
      expect(courseGroup.subject.code).toEqual(courses[0].subject.code);
      expect(courseGroup.courses.length).toBe(2);
      expect(courseGroup.courses[0].code).toBe(courses[0].code);
      expect(courseGroup.courses[1].code).toBe(courses[1].code);
    });

  });

  describe('the function that changes course group to required/optional one', function () {

    it('should broadcast changerequiredincart event when a required course ' +
    'group is changed to optional one or vice versa', function () {
      var course = addToCart(1);
      var subject = course.subject;

      spyOn($rootScope, '$broadcast').and.callThrough();

      CourseCart.setCourseGroupRequired(subject.id, false);
      expect($rootScope.$broadcast.calls.count()).toBe(1);
      expect($rootScope.$broadcast.calls.mostRecent().args)
        .toEqual(['changerequiredincart', subject.id, false]);

      CourseCart.setCourseGroupRequired(subject.id, false);
      expect($rootScope.$broadcast.calls.count()).toBe(1);

      CourseCart.setCourseGroupRequired(subject.id, true);
      expect($rootScope.$broadcast.calls.mostRecent().args)
        .toEqual(['changerequiredincart', subject.id, true]);
      expect($rootScope.$broadcast.calls.count()).toBe(2);
    });

    it('should not broadcast any event when someone tries to change course ' +
    'group to required/optional one if it is not in the cart', function () {
      var fxCourse = fxCourses.objects[0];
      spyOn($rootScope, '$broadcast');
      CourseCart.setCourseGroupRequired(fxCourse.subject.id, false);
      expect($rootScope.$broadcast).not.toHaveBeenCalled();
    });

  });

  describe('when selected campus is changed', function () {
    var Campuses;
    beforeEach(inject(function (_Campuses_) {
      Campuses = _Campuses_;
    }));

    function fillCart() {
      for (var i = 1; i <= 3; ++i) {
        addToCart(i);
      }
    }

    it('should clear itself', function () {
      fillCart();

      Campuses.setSelectedCampus(2);
      $httpBackend.flush();
      $timeout.flush();

      var courseGroups = CourseCart.getCourseGroups();
      expect(courseGroups.length).toBe(0);
    });

    it('should broadcast clearcart event if course cart was not empty', function () {
      fillCart();

      spyOn($rootScope, '$broadcast').and.callThrough();

      Campuses.setSelectedCampus(2);
      $httpBackend.flush();
      $timeout.flush();

      expect($rootScope.$broadcast).toHaveBeenCalledWith('clearcart');
    });

    it('should not broadcast any event if course cart was empty', function () {
      spyOn($rootScope, '$broadcast').and.callThrough();

      Campuses.setSelectedCampus(2);
      $httpBackend.flush();
      $timeout.flush();

      expect($rootScope.$broadcast).not.toHaveBeenCalledWith('clearcart');
    });

  });

});
