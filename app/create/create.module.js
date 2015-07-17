(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name dashApp.create
   * @description
   * # dashApp.create
   *
   * Module for creating timetables.
   */
  angular.
      module('dashApp.create', [
        'dashApp.common'
      ]).
      run(appCreateRun);

  /* @ngInject */
  function appCreateRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'create',
        config: {
          url: '/',
          templateUrl: 'create/create.tpl.html',
          controller: 'CreateCtrl'
        }
      }
    ];
  }
})();
