'use strict';

describe('Controller: CreateResultCtrl', function () {
  // load the controller's module
  beforeEach(module('dashApp.create'));

  var mock$state,
      mockCreateSectionState,
      $rootScope,
      $timeout,
      CreateResultCtrl,
      scope;

  // mock services
  beforeEach(module(function ($provide) {
    /* jshint latedef: nofunc */
    $provide.service('$state', $state);
    $provide.factory('CreateSectionState', CreateSectionState);

    function $state() {
      var that = this;
      this.go = go;
      this.current = { name: 'create.result.list' };

      function go(newStateName) {
        var oldStateName = that.current.name;
        that.current.name = newStateName;
        $rootScope.$broadcast(
            '$stateChangeStart',
            {
              name: newStateName
            },
            undefined,
            {
              name: oldStateName
            },
            undefined
        );
      }
      spyOn(this, 'go').and.callThrough();
    }

    function CreateSectionState() {
      var stateVars = {};
      stateVars.UI_STATE_CONF_COURSE_CART = 'create.conf.course-cart';
      stateVars.UI_STATE_RESULT_LIST = 'create.result.list';
      stateVars.UI_STATE_RESULT_DETAILS = 'create.result.details';
      stateVars.popUiState =
          jasmine.createSpy('CreateSectionState.popUiState');
      return stateVars;
    }
  }));

  // instantiate dependencies
  beforeEach(inject(function (_$state_, _$rootScope_, _$timeout_,
                              _CreateSectionState_) {
    mock$state = _$state_;
    mockCreateSectionState = _CreateSectionState_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateResultCtrl = $controller('CreateResultCtrl', {
      $scope: scope
    });
  }));

  it('should initialize navigation UI view model', function () {
    // Check UI view model.
    expect(CreateResultCtrl.title).toEqual('Generated Timetables');
    expect(CreateResultCtrl.usingRightBtn).toBeFalsy();
    expect(CreateResultCtrl.rightBtnIconClass).toBeNull();
  });

  it('should expose CreateSectionState.popUiState() to view model', function () {
    expect(CreateResultCtrl.popUiState).toBeDefined();
    expect(CreateResultCtrl.popUiState)
        .toBe(mockCreateSectionState.popUiState);
  });

  it('should update navigation UI view model when UI state is set to create.result.details', function () {
    // Set UI state to create.result.details.
    $rootScope.$broadcast(
        '$stateChangeStart',
        {
          name: 'create.result.details'
        },
        undefined,
        {
          name: 'create.result.list'
        },
        undefined);
    // Check UI view model.
    expect(CreateResultCtrl.title).toEqual('Details');
    expect(CreateResultCtrl.usingRightBtn).toBeTruthy();
    expect(CreateResultCtrl.rightBtnIconClass).toBeNull();
  });

  it('should update navigation UI view model when UI state is set to create.result.list', function () {
    // Set UI state to create.result.details.
    $rootScope.$broadcast(
        '$stateChangeStart',
        {
          name: 'create.result.list'
        },
        undefined,
        {
          name: 'create.result.details'
        },
        undefined);
    // Check UI view model.
    expect(CreateResultCtrl.title).toEqual('Generated Timetables');
    expect(CreateResultCtrl.usingRightBtn).toBeFalsy();
    expect(CreateResultCtrl.rightBtnIconClass).toBeNull();
  });

});
