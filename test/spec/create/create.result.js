'use strict';

describe('Controller: CreateResultCtrl', function () {
  // load the controller's module
  beforeEach(module('dashApp.create'));

  var mock$state,
      $timeout,
      CreateResultCtrl,
      scope;

  // mock services
  beforeEach(module(function ($provide) {
    /* jshint latedef: nofunc */
    $provide.service('$state', $state);

    function $state() {
      this.go = jasmine.createSpy('$state.go');
    }
  }));

  // instantiate dependencies
  beforeEach(inject(function (_$state_, _$timeout_) {
    mock$state = _$state_;
    $timeout = _$timeout_;
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateResultCtrl = $controller('CreateResultCtrl', {
      $scope: scope
    });
  }));

});
