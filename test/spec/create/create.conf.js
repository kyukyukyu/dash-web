/* global URI */
'use strict';

describe('Controller: CreateConfCtrl', function () {
  // load the controller's module
  beforeEach(module('dashApp.create'));

  // load module for mocking backend
  beforeEach(module('dashApp.mock.campuses'));
  beforeEach(module('dashApp.mock.departments'));
  beforeEach(module('dashApp.mock.genEduCategories'));
  beforeEach(module('dashApp.mock.courses'));

  var $httpBackend,
    mock$state,
    $timeout,
    UIBackdrop,
    Campuses,
    CreateConfCtrl,
    mockTimetableGenerator,
    mockCreateSectionState,
    scope,
    fxCourses;

  // mock services
  beforeEach(module(function ($provide) {
    /* jshint latedef: nofunc */
    $provide.service('$state', $state);
    $provide.service('TimetableGenerator', TimetableGenerator);
    $provide.factory('CreateSectionState', CreateSectionState);

    function $state() {
      this.go = jasmine.createSpy('$state.go');
    }

    function TimetableGenerator($q) {
      this.generate = jasmine.createSpy('TimetableGenerator.generate').and.callFake(function () {
        var deferred = $q.defer();
        deferred.resolve([]);
        return deferred.promise;
      });
    }

    function CreateSectionState() {
      var stateVars = {};
      stateVars.timetable = {
        fixedCourses: [],
        previewCourse: null,
        freeHours: []
      };
      stateVars.generatedTimetables = null;
      return stateVars;
    }
  }));

  // instantiate dependencies
  beforeEach(inject(function (_$httpBackend_, _$state_, _$timeout_, _Campuses_,
                              _TimetableGenerator_, _CreateSectionState_,
                              _UIBackdrop_, _fxCourses_) {
    $httpBackend = _$httpBackend_;
    mock$state = _$state_;
    $timeout = _$timeout_;
    Campuses = _Campuses_;
    mockTimetableGenerator = _TimetableGenerator_;
    mockCreateSectionState = _CreateSectionState_;
    UIBackdrop = _UIBackdrop_;
    fxCourses = _fxCourses_;
  }));

  // flush HTTP request made by Campuses service
  beforeEach(function () { $httpBackend.flush(1); });

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateConfCtrl = $controller('CreateConfCtrl', {
      $scope: scope
    });
  }));

  // flush HTTP request made by controller
  beforeEach(function () { $httpBackend.flush(2); });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should load list of departments and gen.edu categories',
    inject(function (fxDepartments, fxGenEduCategories) {
      expect(scope.departments.plain()).toEqual(fxDepartments.objects);
      expect(scope.categories.plain()).toEqual(fxGenEduCategories.objects);
    }));

  describe('search options', function () {
    /* jshint camelcase: false */
    it('should initialize search options', function () {
      expect(scope.userInput.keyword).toBe('');
      expect(scope.userInput.type).toBeNull();
      expect(scope.userInput.target_grade).toBeUndefined();
      expect(scope.userInput.department_id).toBeUndefined();
      expect(scope.userInput.category_id).toBeUndefined();
    });

    it('should initialize search options for major classes when selected', function () {
      scope.userInput.type = 'major';
      scope.$digest();
      expect(scope.userInput.target_grade).toBeNull();
      expect(scope.userInput.department_id).toBeNull();
    });

    it('should initialize search options for general classes when selected', function () {
      scope.userInput.type = 'general';
      scope.$digest();
      expect(scope.userInput.category_id).toBeNull();
    });
  });

  describe('generating search queries', function () {
    /* jshint camelcase: false */

    // set selected campus
    beforeEach(function () {
      $httpBackend.expect('GET', '/api/campuses/1');
      Campuses.setSelectedCampus(1);
      $httpBackend.flush();
      $timeout.flush();
    });

    // Set request expectations
    var expectedQueryObj;
    var expectedApiUrlRegex = new RegExp('^/api/campuses/1/courses(\\?.*)?$');
    beforeEach(function () {
      var self = this;

      expectedQueryObj = {};
      $httpBackend.expect('GET', expectedApiUrlRegex)
        .respond(function () {
          var uri = new URI(arguments[1]);
          self.queryObj = uri.query(true);

          return [200, fxCourses, {}, 'OK'];
        });
    });

    /**
     * createSpecGroup returns a function that receives a group of test specs
     * as argument, copies it as a subgroup with given information.
     * @param {String} description The description for new subgroup of test
     *                 specs.
     * @param {String} property The property which should be written in search
     *                 box.
     * @param {String} queryObjKey The key for object that represents the
     *                 expected query.
     * @param {String|Number} value The value for option.
     * @returns {Function(specs)} A function that can be run in the middle of
     *                            test specs. This accepts a group of test
     *                            specs as argument, and creates a new
     *                            subgroup of test specs with beforeEach()
     *                            block. In this beforeEach() block,
     *                            scope.keyword and expectedQueryObj is
     *                            modified.
     */
    var createSpecGroup = function (description, property, queryObjKey, value) {
      return function (specs) {
        describe(description, function () {
          beforeEach(function () {
            scope.userInput.keyword = (scope.userInput.keyword || '') + ' ' + property + ':' + value;
            expectedQueryObj[queryObjKey] = value;
          });

          specs.apply(this);
        });

        specs.apply(this);
      };
    };

    var commonSpecs = function () {
      it('of every type', function () {
      });

      it('of general education', function () {
        scope.userInput.type = 'general';
        expectedQueryObj.type = 'general';
      });

      it('of general education by its category', function () {
        scope.userInput.type = 'general';
        scope.userInput.category_id = 2;
        expectedQueryObj.type = 'general';
        expectedQueryObj.category_id = '2';
      });

      it('of major education', function () {
        scope.userInput.type = 'major';
        expectedQueryObj.type = 'major';
      });

      it('of major education by its target grade', function () {
        scope.userInput.type = 'major';
        scope.userInput.target_grade = 3;
        expectedQueryObj.type = 'major';
        expectedQueryObj.target_grade = '3';
      });

      it('of major education by its department', function () {
        scope.userInput.type = 'major';
        scope.userInput.department_id = 1;
        expectedQueryObj.type = 'major';
        expectedQueryObj.department_id = '1';
      });

      it('of major education by its target grade and department', function () {
        scope.userInput.type = 'major';
        scope.userInput.target_grade = 3;
        scope.userInput.department_id = 1;
        expectedQueryObj.type = 'major';
        expectedQueryObj.target_grade = '3';
        expectedQueryObj.department_id = '1';
      });
    };

    var specsWithName = createSpecGroup(
      'should generate queries which search courses by its name',
      'name', 'name', 'understanding'
    );
    var specsWithInstructor = createSpecGroup(
      'should generate queries which search courses by its instructor',
      'instructor', 'instructor', 'Yun, sunhee'
    );
    var specsWithCode = createSpecGroup(
      'should generate queries which search courses by its subject code',
      'subject', 'subject', 'GEN4091'
    );

    specsWithName(function () {
      specsWithInstructor(function () {
        specsWithCode(commonSpecs);
      });
    });

    afterEach(function () {
      scope.searchCourses();
      $httpBackend.flush();
      expect(this.queryObj).toEqual(expectedQueryObj);
    });
  });

  it('should group the search result by its subject', function () {
    /* jshint camelcase: false */
    Campuses.setSelectedCampus(1);
    $httpBackend.flush();
    scope.searchCourses();
    $httpBackend.flush();

    var searchResult = angular.copy(scope.searchResult);
    expect(searchResult.length).toBe(4);

    var expectedResult = [
      {subjectId: 2, courseIds: [3]},
      {subjectId: 4, courseIds: [5]},
      {subjectId: 3, courseIds: [4]},
      {subjectId: 1, courseIds: [1, 2]}
    ];

    searchResult.sort(function (a, b) {
      return a.subject.name.localeCompare(b.subject.name);
    });

    angular.forEach(searchResult, function (courseGroup, i) {
      var expectedCourseGroup = expectedResult[i];
      expect(courseGroup.subject.id).toBe(expectedCourseGroup.subjectId);
      expect(courseGroup.courses.length).toBe(expectedCourseGroup.courseIds.length);

      var courses = angular.copy(courseGroup.courses);
      courses.sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        return 0;
      });
      angular.forEach(courses, function (c, j) {
        expect(c.id).toBe(expectedCourseGroup.courseIds[j]);
      });
    });
  });

  describe('search box event', function () {

    it('should update state variables when event handler is called', function () {
      expect(scope.uiStatus.isSearchBoxFocused).toBe(false);
      scope.focusOnSearchBox();
      expect(mock$state.go).toHaveBeenCalledWith('^.search');
      expect(scope.uiStatus.isSearchBoxFocused).toBe(true);
    });

    it('should show backdrop when event handler is called', function () {
      spyOn(UIBackdrop, 'show').and.callThrough();
      scope.focusOnSearchBox();
      expect(UIBackdrop.show).toHaveBeenCalled();
    });

    it('should update state variables when backdrop shown by this was hidden', function () {
      scope.focusOnSearchBox();
      expect(scope.uiStatus.isSearchBoxFocused).toBe(true);
      UIBackdrop.hide();
      $timeout.flush();
      expect(scope.uiStatus.isSearchBoxFocused).toBe(false);
      expect(mock$state.go).toHaveBeenCalledWith('^.course-cart');
    });

    it('should update state variables when search result is retrieved', function () {
      expect(scope.uiStatus.isResultBoxOpen).toBe(false);
      Campuses.setSelectedCampus(1);
      $httpBackend.flush();
      scope.searchCourses();
      $httpBackend.flush();
      expect(scope.uiStatus.isResultBoxOpen).toBe(true);
      expect(mock$state.go).toHaveBeenCalledWith('^.search-result');
    });

  });

  describe('user interface', function () {

    it('should expose a function that updates the value of state variable for preview course in timetable to scope', function () {
      var courses = fxCourses.objects;
      expect(mockCreateSectionState.timetable.previewCourse).toBeNull();
      scope.setPreviewCourse(courses[0]);
      expect(mockCreateSectionState.timetable.previewCourse).toBe(courses[0]);
    });

  });

  describe('generating timetables', function () {

    it('should use TimetableGenerator service for generating timetables', function () {
      scope.generateTimetables();
      expect(mockTimetableGenerator.generate).toHaveBeenCalled();
    });

    it('should update state variable when generating timetables has begun', function () {
      expect(scope.uiStatus.generating).toBeFalsy();
      expect(mockCreateSectionState.generatedTimetables).toBeNull();
      scope.generateTimetables();
      expect(scope.uiStatus.generating).toBeTruthy();
      $timeout.flush();
      expect(mock$state.go).toHaveBeenCalledWith('^.^.result.list');
      expect(mockCreateSectionState.generatedTimetables).toEqual([]);
    });

  });

});
