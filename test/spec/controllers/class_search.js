/* global getJSONFixture, URI */
'use strict';

describe('Controller: ClassSearchCtrl', function () {
  jasmine.getJSONFixtures().fixturesPath = 'base/test/mock';

  var fxClasses = getJSONFixture('classes.json');

  // load the controller's module
  beforeEach(module('dashApp'));

  var $httpBackend, $timeout, UIBackdrop, ClassSearchCtrl, scope;
  var backendUrlRegex = /^\/api\/classes(\?(.*))?$/;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, _$timeout_, $controller, $rootScope, _UIBackdrop_) {
    /* jshint unused: false */

    $httpBackend = _$httpBackend_;
    $httpBackend.when('GET', backendUrlRegex).respond(fxClasses);
    $timeout = _$timeout_;
    scope = $rootScope.$new();
    ClassSearchCtrl = $controller('ClassSearchCtrl', {
      $scope: scope
    });
    UIBackdrop = _UIBackdrop_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('should search classes', function () {
    /* jshint camelcase: false */

    // Set request expectations
    var expectedQueryObj;
    beforeEach(function () {
      var self = this;

      expectedQueryObj = {};
      $httpBackend.expect('GET', backendUrlRegex)
        .respond(function () {
          var uri = new URI(arguments[1]);
          self.queryObj = uri.query(true);

          return [200, fxClasses, {}, 'OK'];
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

      it('of general education by its area', function () {
        scope.userInput.type = 'general';
        scope.userInput.area_id = 2;
        expectedQueryObj.type = 'general';
        expectedQueryObj.area_id = '2';
      });

      it('of major education', function () {
        scope.userInput.type = 'major';
        expectedQueryObj.type = 'major';
      });

      it('of major education by its target grade', function () {
        scope.userInput.type = 'major';
        scope.userInput.grade = 3;
        expectedQueryObj.type = 'major';
        expectedQueryObj.grade = '3';
      });

      it('of major education by its department', function () {
        scope.userInput.type = 'major';
        scope.userInput.department_id = 1;
        expectedQueryObj.type = 'major';
        expectedQueryObj.department_id = '1';
      });

      it('of major education by its target grade and department', function () {
        scope.userInput.type = 'major';
        scope.userInput.grade = 3;
        scope.userInput.department_id = 1;
        expectedQueryObj.type = 'major';
        expectedQueryObj.grade = '3';
        expectedQueryObj.department_id = '1';
      });
    };

    var specsWithName = createSpecGroup('by its name', 'name', 'name', 'understanding');
    var specsWithInstructor = createSpecGroup('by its instructor', 'instructor', 'instructor', 'Yun, sunhee');
    var specsWithCode = createSpecGroup('by its subject code', 'subject', 'subject', 'GEN4091');

    specsWithName(function () {
      specsWithInstructor(function () {
        specsWithCode(commonSpecs);
      });
    });

    afterEach(function () {
      scope.searchClasses();
      $httpBackend.flush();
      expect(this.queryObj).toEqual(expectedQueryObj);
    });
  });

  it('should group the search result by its subject', function () {
    /* jshint camelcase: false */
    scope.searchClasses();

    $httpBackend.flush();

    var searchResult = angular.copy(scope.searchResult);
    expect(searchResult.length).toBe(4);

    var expectedResult = [
      {subjectId: 2, classIds: [3]},
      {subjectId: 4, classIds: [5]},
      {subjectId: 3, classIds: [4]},
      {subjectId: 1, classIds: [1, 2]}
    ];

    searchResult.sort(function (a, b) {
      return a.subject.name.localeCompare(b.subject.name);
    });

    angular.forEach(searchResult, function (classGroup, i) {
      var expectedClassGroup = expectedResult[i];
      expect(classGroup.subject.id).toBe(expectedClassGroup.subjectId);
      expect(classGroup.classes.length).toBe(expectedClassGroup.classIds.length);

      var classes = angular.copy(classGroup.classes);
      classes.sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        return 0;
      });
      angular.forEach(classes, function (c, j) {
        expect(c.id).toBe(expectedClassGroup.classIds[j]);
      });
    });
  });

  describe('search box event', function () {
    it('should set uiStatus.isSearchBoxFocused true when event handler is called', function () {
      expect(scope.uiStatus.isSearchBoxFocused).toBe(false);
      scope.focusOnSearchBox();
      expect(scope.uiStatus.isSearchBoxFocused).toBe(true);
    });

    it('should show backdrop when event handler is called', function () {
      spyOn(UIBackdrop, 'show').and.callThrough();
      scope.focusOnSearchBox();
      expect(UIBackdrop.show).toHaveBeenCalled();
    });

    it('should set uiStatus.isSearchBoxFocused false when backdrop shown by this was hidden', function () {
      scope.focusOnSearchBox();
      expect(scope.uiStatus.isSearchBoxFocused).toBe(true);
      UIBackdrop.hide();
      $timeout.flush();
      expect(scope.uiStatus.isSearchBoxFocused).toBe(false);
    });
  });
});
