/* global protractor, element, by */
'use strict';

var mock = require('protractor-http-mock');

describe('Dash App – Campus List', function () {

  beforeEach(function () {
    mock(['campuses']);
    browser.get('index.html');
    browser.setLocation('/campuses');
  });

  afterEach(function () {
    mock.teardown();
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
});
