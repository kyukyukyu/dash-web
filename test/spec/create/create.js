'use strict';

describe('Controller: CreateCtrl', function () {

  // load the controller's module
  beforeEach(module('dashApp.create'));

  var MainCtrl,
    scope,
    $modal;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    $modal = {
      open: jasmine.createSpy('open')
    };
    MainCtrl = $controller('CreateCtrl', {
      $scope: scope,
      $modal: $modal
    });
  }));

  it('should attach an object for timetable to the scope', function () {
    expect(scope.timetable).toBeDefined();
    expect(scope.timetable.fixedCourses).toEqual([]);
    expect(scope.timetable.previewCourse).toBeNull();
    expect(scope.timetable.freeHours).toEqual([]);
  });

  it('should open generator options modal', function () {
    scope.openGenOptions();
    expect($modal.open).toHaveBeenCalled();
  });

});
