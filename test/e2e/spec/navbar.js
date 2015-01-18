'use strict';

var HttpBackend = require('http-backend-proxy');
var mockCampuses = require('../../mock/campuses');
var NavBar = require('../page/navbar');

describe('Navigation bar', function () {

  var proxy;

  var navbar;

  beforeEach(function () {
    proxy = new HttpBackend(browser);
    mockCampuses(proxy.onLoad);
    navbar = new NavBar();
    browser.get('index_e2e.html');
  });

  describe('campus dropdown', function () {
    var firstRun = true;
    var dropdown;
    var menuItems;

    beforeEach(function () {
      if (firstRun) {
        firstRun = false;
        dropdown = navbar.campusDropdown;
        menuItems = [];
        for (var i = 0; i < 2; ++i) {
          menuItems.push(dropdown.menuItemAt(i));
        }
      }
    });

    it('should show currently selected campus', function () {
      expect(dropdown.selectedCampus.getText()).toBe('HYU Seoul');
    });

    it('should show the list of campuses when dropdown is toggled', function () {
      dropdown.selectedCampus.click();

      expect(dropdown.menu.isDisplayed()).toBeTruthy();
      expect(menuItems[0].elem.getText()).toBe('HYU Seoul');
      expect(menuItems[0].isSelected()).toBeTruthy();
      expect(menuItems[1].elem.getText()).toBe('HYU ERICA');
      expect(menuItems[1].isSelected()).toBeFalsy();
    });

    it('should be able to change selected campus', function () {
      navbar.setSelectedCampus(1);
      expect(dropdown.menu.isDisplayed()).toBeFalsy();
      expect(dropdown.selectedCampus.getText()).toBe('HYU ERICA');

      dropdown.toggle();
      expect(menuItems[0].isSelected()).toBeFalsy();
      expect(menuItems[1].isSelected()).toBeTruthy();
    });
  });

  afterEach(function () {
    proxy.onLoad.reset();
  });

});
