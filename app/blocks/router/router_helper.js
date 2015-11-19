(function () {
  'use strict';

  angular.
      module('blocks.router').
      provider('routerHelper', routerHelperProvider);

  /* @ngInject */
  function routerHelperProvider($stateProvider) {
    /* jshint validthis: true */
    this.$get = RouterHelper;

    function RouterHelper() {
      var service = {
        configureStates: configureStates
      };

      return service;

      function configureStates(states) {
        _.each(states, function (state) {
          $stateProvider.state(state.state, state.config);
        });
      }
    }
  }
})();
