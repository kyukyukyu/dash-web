'use strict';

describe('Controller: CreateResultListCtrl', function () {
  // load the controller's module
  beforeEach(module('dashApp.create'));

  // load module for mocking backend
  beforeEach(module('dashApp.mock.courses'));

  var mock$state,
      $timeout,
      mockTimetableGenerator,
      fxCourses,
      CreateResultListCtrl,
      scope;

  // mock services
  beforeEach(module(function ($provide) {
    /* jshint latedef: nofunc */
    $provide.service('$state', $state);
    $provide.service('TimetableGenerator', TimetableGenerator);

    function $state() {
      this.go = jasmine.createSpy('$state.go');
    }

    function TimetableGenerator(fxCourses) {
      var courses = fxCourses.objects;
      this.generatedTimetables = [
        {
          credits: 6.00,
          nClassDays: 4,
          nFreeHours: 0.0,
          courses: [courses[2], courses[3]]
        },
        {
          credits: 9.00,
          nClassDays: 4,
          nFreeHours: 5.5,
          courses: [courses[0], courses[2], courses[3]]
        }
      ];
    }
  }));

  // instantiate dependencies
  beforeEach(inject(function (_$state_, _$timeout_, _TimetableGenerator_,
                              _fxCourses_) {
    mock$state = _$state_;
    $timeout = _$timeout_;
    mockTimetableGenerator = _TimetableGenerator_;
    fxCourses = _fxCourses_;
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateResultListCtrl = $controller('CreateResultListCtrl', {
      $scope: scope
    });
  }));

  it('should expose array of generated timetables to view model', function () {
    expect(CreateResultListCtrl.timetables)
        .toEqual(mockTimetableGenerator.generatedTimetables);
  });

  it('should expose a function that converts number of free hours to real amount of free time', function () {
    expect(CreateResultListCtrl.getAmountOfFreeTime).not.toBeUndefined();
    expect(CreateResultListCtrl.getAmountOfFreeTime(4)).toEqual(2);
  });

});
