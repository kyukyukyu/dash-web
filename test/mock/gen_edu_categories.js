(function (undefined) {
'use strict';

var collectionUrl = /^\/api\/gen_edu_categories(\?(.*))?$/;
var mock = function ($httpBackend, fxGenEduCategories) {
  $httpBackend.when('GET', collectionUrl).respond(fxGenEduCategories);
  fxGenEduCategories.objects.forEach(function (category) {
    $httpBackend.when('GET', '/api/gen_edu_categories/' + category.id).respond(category);
  });
};

if (module !== undefined && module.exports) {
  // for e2e testing
  var fxGenEduCategories = require('./gen_edu_categories.json');
  module.exports = function ($httpBackend) {
    return mock.call(this, $httpBackend, fxGenEduCategories);
  };
} else {
  // for unit testing
  angular.module('dashApp.mock.genEduCategories', ['dashApp.mock.common'])
    .factory('fxGenEduCategories', function () {
      return getJSONFixture('gen_edu_categories.json');
    })
    .constant('genEduCategoryApiUrlRegex', collectionUrl)
    .run(mock);
}
})();
