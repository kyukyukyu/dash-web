'use strict';

describe('Service: UIBackdrop', function () {

  // load the service's module
  beforeEach(module('dashApp.common'));

  // instantiate service
  var $rootElement, $timeout, UIBackdrop;
  beforeEach(inject(function (_$rootElement_, _$timeout_, _UIBackdrop_) {
    $rootElement = _$rootElement_;
    $timeout = _$timeout_;
    UIBackdrop = _UIBackdrop_;
  }));

  it('should show backdrop', function () {
    expect($rootElement).not.toContainElement('#dsBackdrop');
    UIBackdrop.show();
    expect($rootElement).toContainElement('#dsBackdrop');
  });

  it('should hide backdrop', function () {
    UIBackdrop.show();
    UIBackdrop.hide();
    expect($rootElement).not.toContainElement('#dsBackdrop');
  });

  it('should return promise when it shows backdrop and resolve it when backdrop is hidden', function () {
    var foo = false;

    UIBackdrop.show().then(function () {
      foo = true;
    });
    expect(foo).toBe(false);
    UIBackdrop.hide();
    $timeout.flush();
    expect(foo).toBe(true);
  });

  it('should indicate whether backdrop is shown', function () {
    expect(UIBackdrop.isShown()).toBe(false);
    UIBackdrop.show();
    expect(UIBackdrop.isShown()).toBe(true);
    UIBackdrop.hide();
    expect(UIBackdrop.isShown()).toBe(false);
  });

  it('should throw an exception if hide() is called multiple times consecutively', function () {
    UIBackdrop.show();
    UIBackdrop.hide();
    expect(function () { UIBackdrop.hide(); }).toThrow();
  });

  it('should resolve the promise which are made by the first call to show() only, ' +
  'others rejected immediately on show() without appending new backdrop', function () {
    var spies = [];
    for (var i = 0; i < 3; ++i) {
      spies.push(jasmine.createSpy('spy' + i));
    }

    UIBackdrop.show().then(function () {
      spies[0]();
    });
    UIBackdrop.show().catch(function () {
      spies[1]();
    });
    UIBackdrop.show().catch(function () {
      spies[2]();
    });

    $timeout.flush();
    angular.forEach(spies.slice(1), function (spy) {
      expect(spy).toHaveBeenCalled();
    });
    expect($rootElement.children('#dsBackdrop').length).toBe(1);

    UIBackdrop.hide();

    $timeout.flush();
    expect(spies[0]).toHaveBeenCalled();
  });

  describe('backdrop', function () {
    var backdrop;

    beforeEach(function () {
      backdrop = $rootElement.children('#dsBackdrop');
    });

    it('should disappear when clicked', function () {
      UIBackdrop.show();
      backdrop.triggerHandler('click');
      expect(backdrop).not.toBeInDOM();
    });
  });

});
