'use strict';

var HttpBackend = require('http-backend-proxy');
var mockCampuses = require('../../mock/campuses');

describe('Dash App – Campus List', function () {

  var proxy;

  beforeEach(function () {
    proxy = new HttpBackend(browser);
    mockCampuses(proxy.onLoad);
    browser.get('index_e2e.html');
    browser.setLocation('/campuses');
  });

  var campusList = element.all(by.repeater('campus in campuses'));

  it('should show the list of campuses', function() {
    var campusData = [
      {id: 1, name: 'HYU Seoul'},
      {id: 2, name: 'HYU ERICA'}
    ];

    campusList.then(function (campuses) {
      expect(campuses.length).toBe(2);
    });

    campusList.reduce(function (acc, elem, index) {
      return protractor.promise.fullyResolved([
        elem.element(by.css('.id')).getText(),
        elem.element(by.css('.name')).getText()
        ])
      .then(function (arr) {
        return acc && (arr[0] === '#' + campusData[index].id) && (arr[1] === campusData[index].name);
      });
    }, true)
    .then(function (val) {
      expect(val).toBeTruthy();
    });
  });

  afterEach(function () {
    proxy.onLoad.reset();
  });
});
