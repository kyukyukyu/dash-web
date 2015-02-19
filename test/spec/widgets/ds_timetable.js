'use strict';

describe('Directive: dsTimetable', function () {

  // load the directive's module
  beforeEach(module('dashApp.widgets'));
  beforeEach(module('widgets/ds_timetable.tpl.html'));

  // load mock modules
  beforeEach(module('dashApp.mock.campuses'));
  beforeEach(module('dashApp.mock.courses'));

  // load mock data
  var mockCourses;
  beforeEach(function () {
    var mockDataSource = getJSONFixture('courses.json');
    mockCourses = mockDataSource.objects;
  });

  // load dependency
  var $rootScope,
    $httpBackend,
    Courses;
  beforeEach(inject(function (_$rootScope_, _$httpBackend_, _Courses_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    Courses = _Courses_;
  }));

  // flush HTTP request made by Campuses service
  beforeEach(function () { $httpBackend.flush(1); });

  // make sure there is no outstanding http expectation/request
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  var $compile;
  var element,
    scope;

  beforeEach(inject(function (_$compile_) {
    $compile = _$compile_;
    scope = $rootScope.$new();
  }));

  function compileElement(scope, attrs) {
    var element = angular.element(
      '<ds-timetable></ds-timetable>'
    );
    angular.forEach(attrs || {}, function (value, attr) {
      element.attr(attr, value);
    });
    element = $compile(element)(scope);
    $rootScope.$digest();

    return element;
  }

  it('should accept time-range attribute and render time ruler', function () {
    var timeRange = [6, 17];
    scope.timeRange = timeRange;
    element = compileElement(scope, {'time-range': 'timeRange'});

    // check if ruler was rendered correct
    var colRulerElem = element.find('.col-ruler');
    var tableRulerElem = element.find('.table-ruler');
    expect(colRulerElem.find('.ruler-marking').length).toBe(6); // 11:00, 12:00, 1:00, ..., 4:00
    expect(tableRulerElem.find('tbody > tr').length).toBe(17 - 6 + 1);
  });

  it('should accept fixed-courses attribute and render fixed courses', function () {
    var fixedCourses = [mockCourses[0], mockCourses[2], mockCourses[3]];
    var timeRange = [6, 17];
    scope.fixedCourses = fixedCourses;
    scope.timeRange = timeRange;
    element = compileElement(scope, {'fixed-courses': 'fixedCourses', 'time-range': 'timeRange'});

    // check if fixed courses were rendered correct
    var expectedVector = [
      /* 6*/ [null, [2, 0], [2, 1], [0, 1], null, null],
      /* 7*/ [null, null, null],
      /* 8*/ [null, null, null],
      /* 9*/ [null, null, null, null, null, null],
      /*10*/ [null, null, null, null, null, null],
      /*11*/ [null, null, null, null, null, null],
      /*12*/ [null, null, null, null, null, null],
      /*13*/ [null, [0, 0], null, null, null, null],
      /*14*/ [null, null, null, null, null],
      /*15*/ [null, null, [1, 0], [1, 1], null],
      /*16*/ [null, null, null, null],
      /*17*/ [null, null, null, null]
    ];

    var tableFixedElem = element.find('.table-fixed');
    var tableFixedRowElems = tableFixedElem.find('tbody > tr');

    for (var i = 0; i < expectedVector.length; ++i) {
      var tableFixedRowElem = angular.element(tableFixedRowElems[i]);
      var tableFixedCellElems = tableFixedRowElem.find('td');
      expect(tableFixedCellElems.length).toBe(expectedVector[i].length);

      for (var j = 0; j < expectedVector[i].length; ++j) {
        var vectElem = expectedVector[i][j];
        var tableFixedCellElem = angular.element(tableFixedCellElems[j]);

        if (vectElem === null) {
          expect(tableFixedCellElem).not.toHaveAttr('colspan');
          expect(tableFixedCellElem).toBeEmpty();
        } else {
          /* jshint camelcase: false */
          var course = fixedCourses[vectElem[0]];
          var courseHour = course.hours[vectElem[1]];
          var duration = courseHour.end_time - courseHour.start_time + 1;
          expect(tableFixedCellElem).toHaveAttr('colspan', duration.toString());
          expect(tableFixedCellElem.find('.name')).toContainText(course.subject.name);
        }
      }
    }
  });

  it('should accept preview-course attribute and render fixed courses', function () {
    var previewCourse = mockCourses[0];
    var timeRange = [6, 15];
    scope.previewCourse = previewCourse;
    scope.timeRange = timeRange;
    element = compileElement(scope, {'preview-course': 'previewCourse', 'time-range': 'timeRange'});

    // check if preview course was rendered correct
    var expectedVector = [
      /* 6*/ [null, null, null, 1, null, null],
      /* 7*/ [null, null, null, null, null],
      /* 8*/ [null, null, null, null, null],
      /* 9*/ [null, null, null, null, null, null],
      /*10*/ [null, null, null, null, null, null],
      /*11*/ [null, null, null, null, null, null],
      /*12*/ [null, null, null, null, null, null],
      /*13*/ [null, 0, null, null, null, null],
      /*14*/ [null, null, null, null, null],
      /*15*/ [null, null, null, null, null]
    ];

    var tablePreviewElem = element.find('.table-preview');
    var tablePreviewRowElems = tablePreviewElem.find('tbody > tr');

    for (var i = 0; i < expectedVector.length; ++i) {
      var tablePreviewRowElem = angular.element(tablePreviewRowElems[i]);
      var tablePreviewCellElems = tablePreviewRowElem.find('td');
      expect(tablePreviewCellElems.length).toBe(expectedVector[i].length);

      for (var j = 0; j < expectedVector[i].length; ++j) {
        var vectElem = expectedVector[i][j];
        var tablePreviewCellElem = angular.element(tablePreviewCellElems[j]);

        if (vectElem === null) {
          expect(tablePreviewCellElem).not.toHaveAttr('colspan');
          expect(tablePreviewCellElem).toBeEmpty();
        } else {
          /* jshint camelcase: false */
          var courseHour = previewCourse.hours[vectElem];
          var duration = courseHour.end_time - courseHour.start_time + 1;
          expect(tablePreviewCellElem).toHaveAttr('colspan', duration.toString());
          expect(tablePreviewCellElem.find('.name')).toContainText(previewCourse.subject.name);
        }
      }
    }
  });

});
