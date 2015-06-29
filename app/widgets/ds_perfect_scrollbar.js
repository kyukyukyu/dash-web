(function () {

'use strict';

/**
 * @ngdoc directive
 * @name dashApp.widgets:dsPerfectScrollbar
 * @description
 * dsPerfectScrollbar is AngularJS directive that applies
 * perfect-scrollbar plugin.
 */
angular.module('dashApp.widgets').
    directive('dsPerfectScrollbar', perfectScrollbar);

/* @ngInject */
function perfectScrollbar() {
  /* global Ps */
  return {
    link: linkFn,
    restrict: 'A'
  };

  function linkFn(scope, element) {
    Ps.initialize(element[0]);
    element.on('$destroy', function () {
      Ps.destroy(element[0]);
    });
  }
}

})();
