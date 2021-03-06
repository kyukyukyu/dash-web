(function () {
  'use strict';

  var common = angular.module('dashApp.common');

  /* @ngInject */
  function configRestangular(RestangularProvider) {
    RestangularProvider
      .setBaseUrl('/api')
      .addResponseInterceptor(function (data, operation) {
        var extractedData;
        if (operation === 'getList') {
          /* jshint sub: true */
          extractedData = data.objects;
          extractedData.numResults = data['num_results'];
          extractedData.page = data.page;
          extractedData.numPages = data['num_pages'];
        } else {
          extractedData = data;
        }
        return extractedData;
      });
  }

  common.config(configRestangular);

  /* @ngInject */
  function configUiRouter($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  }

  common.config(configUiRouter);

})();
