(function () {
  'use strict';

  describe('routerHelper', function () {
    beforeEach(module('blocks.router'));

    /*
    var $state;
    beforeEach(inject(['$state', function ($s) {
      $state = $s;
    }]));
   */

    it('should configure states', function () {
      var states = [
        {
          state: 'customer',
          config: {
            abstract: true,
            template: '<ui-view class="shuffle-animation"/>',
            url: '/customer'
          }
        }
      ];

      var $sp;
      module(function ($stateProvider) {
        $sp = $stateProvider;
        spyOn($stateProvider, 'state');
      });

      inject(['routerHelper', function (routerHelper) {
        routerHelper.configureStates(states);
        expect($sp.state).toHaveBeenCalledWith(
          states[0].state,
          states[0].config);
      }]);
    });
  });
})();
