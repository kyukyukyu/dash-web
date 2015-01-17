'use strict';

angular
  .module('dashApp.entity', [
    'ngCookies',
    'ngSanitize',
    'restangular'
  ])
  .config(function (RestangularProvider) {
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
  });
