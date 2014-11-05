'use strict';

describe('Dash App', function () {

  beforeEach(function () {
    browser.get('index.html');
  });

  it('should automatically redirect to / when location hash is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch('/');
  });
});
