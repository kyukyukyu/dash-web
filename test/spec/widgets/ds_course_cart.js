'use strict';

describe('Directive: dsCourseCart', function () {

  // load the directive's module
  beforeEach(module('dashApp.widgets'));
  beforeEach(module('widgets/ds_subject.tpl.html'));
  beforeEach(module('widgets/ds_course_cart.tpl.html'));

  // load mock modules
  beforeEach(module('dashApp.mock.campuses'));
  beforeEach(module('dashApp.mock.courses'));

  // load mock data
  var mockMajorSubject, mockMajorCourses, mockGeneralSubject, mockGeneralCourses;
  beforeEach(function () {
    var mockDataSource = getJSONFixture('courses.json');
    mockMajorSubject = mockDataSource.objects[0].subject;
    mockGeneralSubject = mockDataSource.objects[4].subject;
    mockMajorCourses = mockDataSource.objects.slice(0, 2);
    mockGeneralCourses = mockDataSource.objects.slice(4, 5);
  });

  // load dependency
  var $rootScope,
    $httpBackend,
    Courses,
    CourseCart;
  beforeEach(inject(function (_$rootScope_, _$httpBackend_, _Courses_, _CourseCart_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    Courses = _Courses_;
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

  function removeFromCart(courseId) {
    var course = Courses.get(courseId).$object;
    $httpBackend.flush();
    $timeout.flush();
    CourseCart.remove(course);
    return course;
  }

  var $compile, $timeout;
  var element,
    scope;

  function compileElement(scope) {
    var element = angular.element(
      '<ds-course-cart></ds-course-cart>'
    );
    element = $compile(element)(scope);
    $timeout.flush();

    return element;
  }

  function assertDirective(element, courseGroups) {
    var subjectElems = element.find('ds-subject');
    expect(subjectElems.length).toBe(courseGroups.length);

    angular.forEach(courseGroups, function (courseGroup, i) {
      var subjectElem = angular.element(subjectElems[i]);
      var isolateScope = subjectElem.isolateScope();

      expect(isolateScope.subject).toEqual(courseGroup.subject);
      expect(isolateScope.courses).toEqual(courseGroup.courses);
    });
  }

  beforeEach(inject(function (_$compile_, _$timeout_, $rootScope) {
    $compile = _$compile_;
    $timeout = _$timeout_;
    scope = $rootScope.$new();
  }));

  it('should show course groups in cart', function () {
    var courseGroups;

    addToCart(1);
    addToCart(2);
    addToCart(3);
    courseGroups = CourseCart.getCourseGroups();

    element = compileElement(scope);
    assertDirective(element, courseGroups);
  });

  it('should react to changes in cart', function () {
    var courseGroups;

    addToCart(1);
    courseGroups = CourseCart.getCourseGroups();

    element = compileElement(scope);
    assertDirective(element, courseGroups);

    // this adds a course object in existing course group in the cart
    addToCart(2);
    $rootScope.$digest();

    courseGroups = CourseCart.getCourseGroups();
    assertDirective(element, courseGroups);

    // this adds a course object in new course group in the cart
    addToCart(3);
    $rootScope.$digest();

    courseGroups = CourseCart.getCourseGroups();
    assertDirective(element, courseGroups);

    // this removes a course group in the cart
    removeFromCart(3);
    $rootScope.$digest();

    courseGroups = CourseCart.getCourseGroups();
    assertDirective(element, courseGroups);

    // this removes a course object in course group in the cart
    removeFromCart(2);
    $rootScope.$digest();

    courseGroups = CourseCart.getCourseGroups();
    assertDirective(element, courseGroups);
  });

});
