'use strict';

describe('Directive: dsSubject', function () {

  // load the directive's module
  beforeEach(module('dashApp.common'));
  beforeEach(module('common/ds_subject.tpl.html'));

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

  var $compile, $timeout;
  var element,
    scope;

  function compileElement(scope) {
    var element = angular.element(
      '<ds-subject subject="mockSubject" courses="mockCourses"></ds-subject>'
    );
    element = $compile(element)(scope);
    $timeout.flush();

    return element;
  }

  beforeEach(inject(function (_$compile_, _$timeout_, $rootScope) {
    $compile = _$compile_;
    $timeout = _$timeout_;
    scope = $rootScope.$new();
  }));

  it('should show subject information', function () {
    var cellElement;

    scope.mockSubject = mockMajorSubject;
    element = angular.element(
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
    scope.mockSubject = mockMajorSubject;
    scope.mockCourses = mockMajorCourses;
    element = compileElement(scope);

    var courseElems = element.find('.courses > .course');
    expect(courseElems.length).toBe(2);
    courseElems.each(function (index, courseElem) {
      var mockCourse = mockMajorCourses[index];
      courseElem = angular.element(courseElem);
      expect(courseElem.data('id')).toBe(mockCourse.id);
      expect(courseElem.find('.instructor').text()).toBe(mockCourse.instructor);
      expect(courseElem.find('.code').text()).toBe(mockCourse.code);
    });
  });

  it('should expand courses when expanded attribute exists', function () {
    scope.mockSubject = mockMajorSubject;
    scope.mockCourses = mockMajorCourses;
    element =
      angular.element(
        '<ds-subject subject="mockSubject" courses="mockCourses"' +
        ' expanded>' +
        '</ds-subject>'
      );
    element = $compile(element)(scope);
    $timeout.flush();

    var chevronElem = element.find('.actions .chevron');
    expect(chevronElem).toHaveAttr('aria-label', 'Collapse');
    expect(chevronElem.find('i')).toHaveClass('fa-chevron-down');
    expect(element.find('.courses')).not.toHaveClass('ng-hide');
  });

  it('should collapse courses when expanded attribute does not exist', function () {
    scope.mockSubject = mockMajorSubject;
    scope.mockCourses = mockMajorCourses;
    element =
      angular.element(
        '<ds-subject subject="mockSubject" courses="mockCourses">' +
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
    scope.mockSubjects = [mockMajorSubject, mockGeneralSubject];
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

    it('should show \'Add to cart\' button if no course of the subject is ' +
       'in cart', function () {
      scope.mockSubject = mockMajorSubject;
      scope.mockCourses = mockMajorCourses;
      element = compileElement(scope);

      var btnCart = element.find('.actions > .btn-cart').not('.courses *');
      expect(btnCart).toHaveClass('btn-cart-add');
      expect(btnCart).not.toHaveClass('btn-cart-remove');
    });

    it('should show \'Add to cart\' button if not all course of the ' +
       'subject is in cart', function () {
      scope.mockSubject = mockMajorSubject;
      scope.mockCourses = mockMajorCourses;
      addToCart(1);
      element = compileElement(scope);

      var btnCart = element.find('.actions > .btn-cart').not('.courses *');
      expect(btnCart).toHaveClass('btn-cart-add');
      expect(btnCart).not.toHaveClass('btn-cart-remove');
    });

    it('should show \'Remove from cart\' button if all course of the ' +
    'subject is in cart', function () {
      scope.mockSubject = mockMajorSubject;
      scope.mockCourses = mockMajorCourses;
      addToCart(1);
      addToCart(2);
      element = compileElement(scope);

      var btnCart = element.find('.actions > .btn-cart').not('.courses *');
      expect(btnCart).not.toHaveClass('btn-cart-add');
      expect(btnCart).toHaveClass('btn-cart-remove');
    });

    it('should show \'Add to cart\' button if the course is not in cart', function () {
      scope.mockSubject = mockMajorSubject;
      scope.mockCourses = mockMajorCourses;
      element = compileElement(scope);

      var btnCart = element.find('.courses .btn-cart');
      expect(btnCart).toHaveClass('btn-cart-add');
      expect(btnCart).not.toHaveClass('btn-cart-remove');
    });

    it('should show \'Remove from cart\' button if the course is in cart', function () {
      scope.mockSubject = mockMajorSubject;
      scope.mockCourses = mockMajorCourses.slice(0, 1);
      addToCart(1);
      element = compileElement(scope);

      var btnCart = element.find('.courses .btn-cart');
      expect(btnCart).not.toHaveClass('btn-cart-add');
      expect(btnCart).toHaveClass('btn-cart-remove');
    });

    describe('setting proper class on whether course group is required or unavailable', function () {

      it('should set proper class if the course group is required', function () {
        scope.mockSubject = mockMajorSubject;
        scope.mockCourses = mockMajorCourses;
        addToCart(1);
        addToCart(2);
        element = compileElement(scope);
        expect(element.find('.is-required')).toHaveClass('is-required-true');
      });

      it('should set proper class if the course group is optional', function () {
        scope.mockSubject = mockGeneralSubject;
        scope.mockCourses = mockGeneralCourses;
        addToCart(5);
        element = compileElement(scope);
        expect(element.find('.is-required')).toHaveClass('is-required-false');
      });

      it('should set proper class if the course group is not in cart', function () {
        scope.mockSubject = mockMajorSubject;
        scope.mockCourses = mockMajorCourses;
        element = compileElement(scope);
        expect(element.find('.is-required')).toHaveClass('is-required-unavailable');
      });

    });

    describe('reacting to events occured by course cart', function () {

      function getCourseElem(courseId) {
        return element.find('.courses > .course').filter(function () {
          return angular.element(this).data('id') === courseId;
        });
      }

      it('should react to changerequiredincart event', function () {
        scope.mockSubject = mockMajorSubject;
        scope.mockCourses = mockMajorCourses;
        addToCart(1);
        element = compileElement(scope);

        $rootScope.$broadcast('changerequiredincart', mockMajorSubject.id, false);
        $rootScope.$digest();
        expect(element.find('.is-required')).toHaveClass('is-required-false');

        $rootScope.$broadcast('changerequiredincart', mockMajorSubject.id, true);
        $rootScope.$digest();
        expect(element.find('.is-required')).toHaveClass('is-required-true');
      });

      it('should react to addtocart event', function () {
        scope.mockSubject = mockMajorSubject;
        scope.mockCourses = mockMajorCourses;
        element = compileElement(scope);

        var courseElem, btnCartElem;

        // this occurs addtocart event
        addToCart(1);
        $rootScope.$digest();

        expect(element.find('.is-required')).toHaveClass('is-required-true');

        courseElem = getCourseElem(1);
        btnCartElem = courseElem.find('.actions .btn-cart');
        expect(btnCartElem).not.toHaveClass('btn-cart-add');
        expect(btnCartElem).toHaveClass('btn-cart-remove');

        // this occurs addtocart event, again
        addToCart(2);
        $rootScope.$digest();

        courseElem = getCourseElem(2);
        btnCartElem = courseElem.find('.actions .btn-cart');
        expect(btnCartElem).not.toHaveClass('btn-cart-add');
        expect(btnCartElem).toHaveClass('btn-cart-remove');

        btnCartElem = element.find('.actions > .btn-cart').not('.courses *');
        expect(btnCartElem).not.toHaveClass('btn-cart-add');
        expect(btnCartElem).toHaveClass('btn-cart-remove');
      });

      it('should react to removefromcart event', function () {
        scope.mockSubject = mockMajorSubject;
        scope.mockCourses = mockMajorCourses;
        addToCart(1);
        addToCart(2);
        element = compileElement(scope);

        var courseElem, btnCartElem;

        // this occurs removefromcart event
        removeFromCart(2);
        $rootScope.$digest();

        courseElem = getCourseElem(2);
        btnCartElem = courseElem.find('.actions .btn-cart');
        expect(btnCartElem).toHaveClass('btn-cart-add');
        expect(btnCartElem).not.toHaveClass('btn-cart-remove');
        btnCartElem = element.find('.actions > .btn-cart').not('.courses *');
        expect(btnCartElem).toHaveClass('btn-cart-add');
        expect(btnCartElem).not.toHaveClass('btn-cart-remove');

        // this occurs removefromcart event, again
        removeFromCart(1);
        $rootScope.$digest();

        courseElem = getCourseElem(1);
        btnCartElem = courseElem.find('.actions .btn-cart');
        expect(btnCartElem).toHaveClass('btn-cart-add');
        expect(btnCartElem).not.toHaveClass('btn-cart-remove');

        expect(element.find('.is-required')).toHaveClass('is-required-unavailable');
      });

    });

    describe('cart button on subject', function () {

      it('should add all courses to cart', function () {
        scope.mockSubject = mockMajorSubject;
        scope.mockCourses = mockMajorCourses;
        element = compileElement(scope);

        var btnCartElem = element.find('.actions > .btn-cart').not('.courses *');
        btnCartElem.click();

        var courseGroup = CourseCart.getCourseGroup(mockMajorSubject.id);
        var courses = angular.copy(courseGroup.courses).sort(function (ca, cb) {
          return ca.id - cb.id;
        });
        expect(courses.length).toEqual(mockMajorCourses.length);
        angular.forEach(courses, function (course, i) {
          expect(course).toEqual(mockMajorCourses[i]);
        });
      });

      it('should remove all courses from cart', function () {
        scope.mockSubject = mockMajorSubject;
        scope.mockCourses = mockMajorCourses;
        addToCart(1);
        addToCart(2);
        element = compileElement(scope);

        var btnCartElem = element.find('.actions > .btn-cart').not('.courses *');
        btnCartElem.click();

        expect(function () {
          CourseCart.getCourseGroup(mockMajorSubject.id);
        }).toThrow('no course group found');
      });

    });

    describe('cart button on course', function () {

      it('should add course to cart', function () {
        scope.mockSubject = mockMajorSubject;
        scope.mockCourses = mockMajorCourses;
        element = compileElement(scope);

        var btnCartElem = element.find('.courses .course:first .btn-cart');
        btnCartElem.click();

        var courseGroup = CourseCart.getCourseGroup(mockMajorSubject.id);
        var courses = courseGroup.courses;
        expect(courses.length).toEqual(1);
        expect(courses[0]).toEqual(mockMajorCourses[0]);
      });

      it('should remove course from cart', function () {
        scope.mockSubject = mockMajorSubject;
        scope.mockCourses = mockMajorCourses;
        addToCart(1);
        element = compileElement(scope);

        var btnCartElem = element.find('.courses .course:first .btn-cart');
        btnCartElem.click();

        expect(function () {
          CourseCart.getCourseGroup(mockMajorSubject.id);
        }).toThrow('no course group found');
      });

    });

  });

  it('should expand and collapse the list of courses', function () {
    scope.mockSubject = mockMajorSubject;
    scope.mockCourses = mockMajorCourses;
    element = angular.element(
      '<ds-subject subject="mockSubject" courses="mockCourses" expanded></ds-subject>'
    );
    element = $compile(element)(scope);
    $timeout.flush();

    var chevronElem = element.find('.actions .chevron');
    var coursesElem = element.find('.courses');

    chevronElem.click();
    expect(coursesElem).toHaveClass('ng-hide');

    chevronElem.click();
    expect(coursesElem).not.toHaveClass('ng-hide');
  });

});
