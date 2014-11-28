'use strict';

describe('Dash App', function () {

  beforeEach(function () {
    browser.get('index.html');
  });

  it('should automatically redirect to / when location hash is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch('/');
  });

  describe('search box', function () {
    var boxGroupBottom, keywordBox, backdrop;

    beforeEach(function () {
      boxGroupBottom = $('.box-group-bottom > .box-group');
      keywordBox = element(by.model('keyword'));
      backdrop = $('#dsBackdrop');
      expect(boxGroupBottom.isDisplayed()).toBeFalsy();
      expect(backdrop.isPresent()).toBeFalsy();
    });

    describe('should open the box group of search option box and search result box with backdrop', function () {
      it('when the keyword box is focused', function () {
        keywordBox.click();
      });

      it('when the gear icon is clicked', function () {
        $('.box-group-top button').click();
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
  });
});
