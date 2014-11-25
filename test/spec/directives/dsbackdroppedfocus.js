'use strict';

describe('Directive: dsBackdroppedFocus', function () {

  // load the directive's module
  beforeEach(module('dashApp'));

  var $compile, $rootElement, element, backdrop, scope;

  beforeEach(inject(function (_$compile_, _$rootElement_, _$rootScope_) {
    $compile = _$compile_;
    $rootElement = _$rootElement_;
    scope = _$rootScope_.$new();

    jasmine.getStyleFixtures().set(
      '.ds-backdrop {position: fixed; left: 0; right: 0; top: 0; bottom: 0;}'
    );
  }));

  it('should transclude', function () {
    element = angular.element('<div ds-backdropped-focus>Dash rocks!</div>');
    element = $compile(element)(scope);
    expect(element).toContainText('Dash rocks!');
  });

  describe('should listen to', function () {
    beforeEach(function () {
      element = angular.element('<div ds-backdropped-focus></div>');
      element = $compile(element)(scope);
    });

    it('focusin/focusout event on the element by creating/removing backdrop', function () {
      element.focusin();
      expect($rootElement).toContainElement('.ds-backdrop');

      element.focusout();
      expect($rootElement).not.toContainElement('.ds-backdrop');
    });

    it('click event on the backdrop by removing itself and emitting focusout event on the element', function () {
      element.focusin();

      backdrop = $rootElement.children('.ds-backdrop');
      backdrop.click();

      expect(backdrop).not.toBeInDOM();
      expect(element).not.toBeFocused();
    });
  });

  describe('should emit event to scope', function () {
    var callbackFn;
    beforeEach(function () {
      element = angular.element('<div ds-backdropped-focus></div>');
      element = $compile(element)(scope);
      callbackFn = jasmine.createSpy('callbackFn');
    });

    describe('when focused in', function () {
      beforeEach(function () {
        scope.$on('focusin.backdropped.ds', function () {
          callbackFn();
        });
      });

      it('during $apply', function () {
        scope.$apply(function () {
          element.triggerHandler('focusin');
          expect(callbackFn).not.toHaveBeenCalled();
        });

        expect(callbackFn).toHaveBeenCalled();
      });

      it('outside $apply', function () {
        element.triggerHandler('focusin');
        expect(callbackFn).toHaveBeenCalled();
      });
    });

    describe('when focused out', function () {
      beforeEach(function () {
        scope.$on('focusout.backdropped.ds', function () {
          callbackFn();
        });
      });

      it('during $apply', function () {
        scope.$apply(function () {
          element.triggerHandler('focusout');
          expect(callbackFn).not.toHaveBeenCalled();
        });
        expect(callbackFn).toHaveBeenCalled();
      });

      it('outside $apply', function () {
        element.triggerHandler('focusout');
        expect(callbackFn).toHaveBeenCalled();
      });
    });
  });
});
