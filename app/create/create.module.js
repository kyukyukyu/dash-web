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
          abstract: true,
          url: '/',
          templateUrl: 'create/create.tpl.html',
          controller: 'CreateCtrl'
        }
      },
      {
        state: 'create.conf',
        config: {
          abstract: true,
          templateUrl: 'create/create.conf.tpl.html',
          controller: 'CreateConfCtrl'
        }
      },
      {
        state: 'create.conf.course-cart',
        config: {
          url: ''
        }
      },
      {
        state: 'create.conf.search',
        config: {
        }
      },
      {
        state: 'create.conf.search-result',
        config: {
        }
      },
      {
        state: 'create.result',
        config: {
          abstract: true,
          templateUrl: 'create/create.result.tpl.html',
          controller: 'CreateResultCtrl as resultVm'
        }
      },
      {
        state: 'create.result.list',
        config: {
          templateUrl: 'create/create.result.list.tpl.html',
          controller: 'CreateResultListCtrl as resultListVm'
        }
      },
      {
        state: 'create.result.details',
        config: {
          templateUrl: 'create/create.result.details.tpl.html',
          controller: 'CreateResultDetailsCtrl as resultDetailsVm'
        }
      }
    ];
  }
})();
