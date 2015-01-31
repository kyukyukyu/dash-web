'use strict';

var HttpBackend = require('http-backend-proxy');
var mockCampuses = require('../../mock/campuses');
var mockDepartments = require('../../mock/departments');
var mockGenEduCategories = require('../../mock/gen_edu_categories');

var NavBar = require('../page/common/navbar');
var SearchOptionBox = require('../page/create/search_option_box');

describe('Main', function () {

  var proxy;

  var navbar,
    keywordBox, gearIcon,
    boxGroupBottom, searchOptionBox,
    backdrop;

  beforeEach(function () {
    proxy = new HttpBackend(browser);
    mockCampuses(proxy.onLoad);
    mockDepartments(proxy.onLoad);
    mockGenEduCategories(proxy.onLoad);
    browser.get('index_e2e.html');
  });

  beforeEach(function () {
    navbar = new NavBar();

    keywordBox = element(by.model('userInput.keyword'));
    gearIcon = $('.box-group-top button');

    boxGroupBottom = $('.box-group-bottom > .box-group');
    searchOptionBox = new SearchOptionBox($('.box-group-bottom .box-search-option'));

    backdrop = $('#dsBackdrop');
  });

  it('should automatically redirect to / when location hash is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch('/');
  });

  describe('searching', function () {
    beforeEach(function () {
      expect(boxGroupBottom.isDisplayed()).toBeFalsy();
      expect(backdrop.isPresent()).toBeFalsy();
    });

    describe('should open the box group of search option box and search result box with backdrop', function () {
      it('when the keyword box is focused', function () {
        keywordBox.click();
      });

      it('when the gear icon is clicked', function () {
        gearIcon.click();
      });

      afterEach(function () {
        expect(boxGroupBottom.isDisplayed()).toBeTruthy();
        expect(backdrop.isPresent()).toBeTruthy();
      });
    });

    it('should hide backdrop and the box group when backdrop is clicked', function () {
      keywordBox.click();
      backdrop.click();
      expect(backdrop.isPresent()).toBeFalsy();
      expect(boxGroupBottom.isDisplayed()).toBeFalsy();
    });

    describe('search options', function () {
      beforeEach(function () {
        gearIcon.click();
      });

      it('should show no other options than course type at first', function () {
        expect(searchOptionBox.btnGroupGrade.isDisplayed()).toBeFalsy();
      });

      it('should show options related to major courses when type option is set to major', function () {
        var selectBoxDepartment = searchOptionBox.selectBoxDepartment;
        searchOptionBox.setType(searchOptionBox.TYPE_MAJOR);
        expect(searchOptionBox.btnGroupGrade.isDisplayed()).toBeTruthy();
        expect(selectBoxDepartment.isDisplayed()).toBeTruthy();
        expect(selectBoxDepartment.$('option:checked').getText()).toEqual('(All)');
        expect(selectBoxDepartment.$$('option').count()).toBe(1 + 11);
        expect(searchOptionBox.selectBoxCategory.isDisplayed()).toBeFalsy();
      });

      it('should show options related to general courses when type option is set to general', function () {
        var selectBoxCategory = searchOptionBox.selectBoxCategory;
        searchOptionBox.setType(searchOptionBox.TYPE_GENERAL);
        expect(selectBoxCategory.isDisplayed()).toBeTruthy();
        expect(selectBoxCategory.$('option:checked').getText()).toEqual('(All)');
        expect(selectBoxCategory.$$('option').count()).toBe(1 + 4);
        expect(searchOptionBox.btnGroupGrade.isDisplayed()).toBeFalsy();
        expect(searchOptionBox.selectBoxDepartment.isDisplayed()).toBeFalsy();
      });
    });
  });

  afterEach(function () {
    proxy.onLoad.reset();
  });

});
