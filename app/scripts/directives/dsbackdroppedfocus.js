'use strict';

/**
 * @ngdoc directive
 * @name dashApp.directive:dsBackdroppedFocus
 * @description
 * # dsBackdroppedFocus
 */
angular.module('dashApp')
  .directive('dsBackdroppedFocus', function ($rootElement, $rootScope) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var backdrop = angular.element('<div></div>').addClass('ds-backdrop');
        var createJqEventHandler = function (ngApplyExp) {
          return function () {
            if ($rootScope.$$phase) {
              scope.$evalAsync(ngApplyExp);
            } else {
              scope.$apply(ngApplyExp);
            }
          };
        };

        element
          .on('$destroy', function () {
            backdrop.remove();
          })
          .focusin(createJqEventHandler(function (sc) {
            $rootElement.append(backdrop);
            sc.$emit('focusin.backdropped.ds');
          }))
          .focusout(createJqEventHandler(function (sc) {
            sc.$emit('focusout.backdropped.ds');
            backdrop.detach();
          }));
        backdrop
          .click(function () {
            angular.element(this).hide();
          });
      }
    };
  });
