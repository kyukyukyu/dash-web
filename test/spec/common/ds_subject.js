'use strict';

describe('Directive: dsSubject', function () {

  // load the directive's module
  beforeEach(module('dashApp.common'));
  beforeEach(module('common/ds_subject.tpl.html'));

  // load mock modules
  beforeEach(module('dashApp.mock.campuses'));
  beforeEach(module('dashApp.mock.courses'));

  // load mock data
  var mockSubject, mockSubject2, mockCourses;
  beforeEach(function () {
    var mockDataSource = getJSONFixture('courses.json');
    mockSubject = mockDataSource.objects[0].subject;
    mockSubject2 = mockDataSource.objects[2].subject;
    mockCourses = mockDataSource.objects.slice(0, 2);
  });

  var $compile, $timeout;
  var element,
    scope;

  beforeEach(inject(function (_$compile_, _$timeout_, $rootScope) {
    $compile = _$compile_;
    $timeout = _$timeout_;
    scope = $rootScope.$new();
  }));

  it('should show subject information', function () {
    var cellElement;

    scope.mockSubject = mockSubject;
    element =
      angular.element(
        '<ds-subject subject="mockSubject"></ds-subject>'
      );
    element = $compile(element)(scope);
    $timeout.flush();

    cellElement = element.find('.cell');
    expect(element.data('id')).toBe(1);
    expect(cellElement.find('.credit').text()).toBe('3.00');
    expect(cellElement.find('.name').text()).toBe('Software Engineering');
    expect(cellElement.find('.code').text()).toBe('CSE4006');
  });

  it('should show course information when provided', function () {
    scope.mockSubject = mockSubject;
    scope.mockCourses = mockCourses;
    element =
      angular.element(
        '<ds-subject subject="mockSubject" courses="mockCourses">' +
        '</ds-subject>'
      );
    element = $compile(element)(scope);
    $timeout.flush();

    var courseElems = element.find('.courses > .course');
    expect(courseElems.length).toBe(2);
    courseElems.each(function (index, courseElem) {
      var mockCourse = mockCourses[index];
      courseElem = angular.element(courseElem);
      expect(courseElem.data('id')).toBe(mockCourse.id);
      expect(courseElem.find('.instructor').text()).toBe(mockCourse.instructor);
      expect(courseElem.find('.code').text()).toBe(mockCourse.code);
    });
  });

  it('should expand courses when expanded attribute has truthy value', function () {
    scope.mockSubject = mockSubject;
    scope.mockCourses = mockCourses;
    element =
      angular.element(
        '<ds-subject subject="mockSubject" courses="mockCourses"' +
        ' expanded="true">' +
        '</ds-subject>'
      );
    element = $compile(element)(scope);
    $timeout.flush();

    var chevronElem = element.find('.actions .chevron');
    expect(chevronElem).toHaveAttr('aria-label', 'Collapse');
    expect(chevronElem.find('i')).toHaveClass('fa-chevron-down');
    expect(element.find('.courses')).not.toHaveClass('ng-hide');
  });

  it('should collapse courses when expanded attribute has falsy value', function () {
    scope.mockSubject = mockSubject;
    scope.mockCourses = mockCourses;
    element =
      angular.element(
        '<ds-subject subject="mockSubject" courses="mockCourses"' +
        ' expanded="false">' +
        '</ds-subject>'
      );
    element = $compile(element)(scope);
    $timeout.flush();

    var chevronElem = element.find('.actions .chevron');
    expect(chevronElem).toHaveAttr('aria-label', 'Expand');
    expect(chevronElem.find('i')).toHaveClass('fa-chevron-right');
    expect(element.find('.courses')).toHaveClass('ng-hide');
  });

  it('should be able to be used with ng-repeat directive', function () {
    scope.mockSubjects = [mockSubject, mockSubject2];
    // It is strongly recommended to use `track by` expression to not add
    // $$hashKey property to original object.
    element =
      angular.element(
        '<div>' +
        '<ds-subject ng-repeat="subject in mockSubjects track by subject.id" subject="subject">' +
        '</ds-subject>' +
        '</div>'
      );
    element = $compile(element)(scope);
    $timeout.flush();

    expect(element.find('ds-subject').length).toBe(2);
  });

  describe('syncing with course cart', function () {

    // load dependency
    var $httpBackend,
      Courses,
      CourseCart;
    beforeEach(inject(function (_$httpBackend_, _Courses_, _CourseCart_) {
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

    it('should show \'Add to cart\' button if no course of the subject is ' +
       'in cart', function () {
      scope.mockSubject = mockSubject;
      scope.mockCourses = mockCourses;
      element = angular.element(
        '<ds-subject subject="mockSubject" courses="mockCourses"></ds-subject>'
      );
      element = $compile(element)(scope);
      $timeout.flush();

      var btnCart = element.find('.actions > .btn-cart').not('.courses *');
      expect(btnCart).toHaveClass('btn-cart-add');
      expect(btnCart).not.toHaveClass('btn-cart-remove');
    });

    it('should show \'Add to cart\' button if not all course of the ' +
       'subject is in cart', function () {
      scope.mockSubject = mockSubject;
      scope.mockCourses = mockCourses;
      addToCart(1);
      element = angular.element(
        '<ds-subject subject="mockSubject" courses="mockCourses"></ds-subject>'
      );
      element = $compile(element)(scope);
      $timeout.flush();

      var btnCart = element.find('.actions > .btn-cart').not('.courses *');
      expect(btnCart).toHaveClass('btn-cart-add');
      expect(btnCart).not.toHaveClass('btn-cart-remove');
    });

    it('should show \'Remove from cart\' button if all course of the ' +
    'subject is in cart', function () {
      scope.mockSubject = mockSubject;
      scope.mockCourses = mockCourses;
      addToCart(1);
      addToCart(2);
      element = angular.element(
        '<ds-subject subject="mockSubject" courses="mockCourses"></ds-subject>'
      );
      element = $compile(element)(scope);
      $timeout.flush();

      var btnCart = element.find('.actions > .btn-cart').not('.courses *');
      expect(btnCart).not.toHaveClass('btn-cart-add');
      expect(btnCart).toHaveClass('btn-cart-remove');
    });

    it('should show \'Add to cart\' button if the course is not in cart', function () {
      scope.mockSubject = mockSubject;
      scope.mockCourses = mockCourses;
      element = angular.element(
        '<ds-subject subject="mockSubject" courses="mockCourses"></ds-subject>'
      );
      element = $compile(element)(scope);
      $timeout.flush();

      var btnCart = element.find('.courses .btn-cart');
      expect(btnCart).toHaveClass('btn-cart-add');
      expect(btnCart).not.toHaveClass('btn-cart-remove');
    });

    it('should show \'Remove from cart\' button if the course is in cart', function () {
      scope.mockSubject = mockSubject;
      scope.mockCourses = mockCourses.slice(0, 1);
      addToCart(1);
      element = angular.element(
        '<ds-subject subject="mockSubject" courses="mockCourses"></ds-subject>'
      );
      element = $compile(element)(scope);
      $timeout.flush();

      var btnCart = element.find('.courses .btn-cart');
      expect(btnCart).not.toHaveClass('btn-cart-add');
      expect(btnCart).toHaveClass('btn-cart-remove');
    });

    describe('setting proper class on whether course group is required or unavailable', function () {

      function prepareElement(courseIndex, putInCart) {
        var element;
        var mockDataSource = getJSONFixture('courses.json');
        var mockCourse = mockDataSource.objects[courseIndex];
        scope.mockCourses = [mockCourse];
        scope.mockSubject = mockCourse.subject;
        if (putInCart) {
          addToCart(mockCourse.id);
        }
        element = angular.element(
          '<ds-subject subject="mockSubject" courses="mockCourses"></ds-subject>'
        );
        element = $compile(element)(scope);
        $timeout.flush();
        return element;
      }

      it('should set proper class if the course group is required', function () {
        element = prepareElement(0, true);
        expect(element.find('.is-required')).toHaveClass('is-required-true');
      });

      it('should set proper class if the course group is optional', function () {
        element = prepareElement(4, true);
        expect(element.find('.is-required')).toHaveClass('is-required-false');
      });

      it('should set proper class if the course group is not in cart', function () {
        element = prepareElement(0, false);
        expect(element.find('.is-required')).toHaveClass('is-required-unavailable');
      });

    });

  });

});
